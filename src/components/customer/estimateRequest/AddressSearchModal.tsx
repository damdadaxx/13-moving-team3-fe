// 주소 검색 모달 (Figma: Component/address-card, node 1:4767)
// 카드 규격(608px · radius 32 · px-24 pt-32 pb-40)이 Modal popup과 같아서 Modal을 그대로 쓴다.
// 선택 여부에 따라 "선택완료" 버튼이 켜졌다 꺼지므로 useModal 대신 Modal을 직접 렌더한다.

'use client';

import { useState } from 'react';

import type { AddressSearchResult } from '@/app/api/address-search/route';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import InputSearchbar from '@/components/ui/Form/InputSearchbar';
import Modal from '@/components/ui/Modal/Modal';

export type AddressResult = AddressSearchResult;

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** '출발지' | '도착지' — 제목에 쓰인다 */
  label: string;
  onSelect: (address: AddressResult) => void;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
  label,
  onSelect,
}: AddressSearchModalProps) {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<AddressResult[] | null>(null);
  const [selected, setSelected] = useState<AddressResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  function resetResults() {
    setResults(null);
    setSelected(null);
    setError('');
  }

  /* 검색 아이콘 클릭 또는 Enter에만 호출한다 (입력마다 API를 때리지 않는다) */
  async function handleSearch(value: string) {
    const query = value.trim();
    setSelected(null);
    setError('');

    if (!query) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const data = await clientFetch<AddressResult[]>(
        `${ENDPOINTS.address.search}?query=${encodeURIComponent(query)}`,
      );
      setResults(data);
    } catch (caught) {
      setResults(null);
      setError(
        caught instanceof HttpError
          ? caught.message
          : '주소를 검색하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  /* 닫을 때 비워야 다시 열었을 때 이전 검색이 남지 않는다 */
  function handleClose() {
    setKeyword('');
    resetResults();
    onClose();
  }

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected);
    handleClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${label}를 선택해주세요`}
      buttons={
        <Button size="lg" disabled={!selected} onClick={handleConfirm}>
          선택완료
        </Button>
      }
    >
      <div className="flex flex-col gap-[24px]">
        {/* size 생략 = responsive: 모바일 52px → desktop 64px(시안 md) */}
        <InputSearchbar
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onSearch={handleSearch}
          onClear={resetResults}
          placeholder="주소를 입력해 주세요."
          aria-label={`${label} 주소 검색`}
        />

        {results?.map((item) => {
          const isSelected = selected?.id === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full cursor-pointer flex-col gap-[16px] rounded-[16px] border px-[16px] pt-[20px] pb-[24px] text-left transition',
                isSelected
                  ? 'border-orange-500 bg-orange-100 drop-shadow-[2px_2px_5px_rgba(224,224,224,0.2)]'
                  : 'border-line-200 bg-gray-50 hover:border-orange-400',
              )}
            >
              <span className="text-md-semibold tablet:text-lg-semibold text-black-400">
                {item.zoneCode}
              </span>
              <span className="flex flex-col gap-[16px]">
                {/* 지번만 있는 주소도 있어서 각각 있을 때만 그린다 */}
                {item.roadAddress && (
                  <span className="flex items-start gap-[8px]">
                    <AddressChip>도로명</AddressChip>
                    <span className="text-md-regular flex-1 text-black-400 tablet:text-lg-regular">
                      {item.roadAddress}
                    </span>
                  </span>
                )}
                {/* 건물번호 없이 도로명만 검색하면 도로명·지번이 같은 값으로 온다 */}
                {item.jibunAddress &&
                  item.jibunAddress !== item.roadAddress && (
                    <span className="flex items-start gap-[8px]">
                      <AddressChip>지번</AddressChip>
                      <span className="text-md-regular flex-1 text-black-400 tablet:text-lg-regular">
                        {item.jibunAddress}
                      </span>
                    </span>
                  )}
              </span>
            </button>
          );
        })}

        {isLoading && (
          <p className="text-lg-regular py-[24px] text-center text-gray-400">
            검색 중입니다...
          </p>
        )}

        {!isLoading && error && (
          <p className="text-lg-regular py-[24px] text-center text-red-200">
            {error}
          </p>
        )}

        {!isLoading && !error && results !== null && results.length === 0 && (
          <p className="text-lg-regular py-[24px] text-center text-gray-400">
            검색 결과가 없습니다. 건물번호까지 입력해 보세요.
          </p>
        )}

        {!isLoading && !error && results === null && (
          <p className="text-lg-regular py-[24px] text-center text-gray-400">
            검색 결과가 없습니다. <br />
            건물번호까지 입력해 보세요.
          </p>
        )}
      </div>
    </Modal>
  );
}

function AddressChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs-semibold flex w-[54px] shrink-0 items-center justify-center rounded-[16px] bg-orange-100 px-[4px] py-[2px] text-orange-400 tablet:text-md-semibold">
      {children}
    </span>
  );
}
