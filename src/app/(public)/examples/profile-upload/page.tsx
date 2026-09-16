// [메뉴] 공용 컴포넌트 예시
// [페이지] ProfileUpload 상태 및 React Hook Form 연동 확인

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import ImgProfileExample from '@/assets/images/img_profile_example.png';

import Button from '@/components/ui/Button/Button';
import ProfileUpload from '@/components/ui/ProfileUpload/ProfileUpload';

interface ProfileUploadFormValues {
  profileImage: FileList;
}

export default function ProfileUploadExamplePage() {
  const [submittedFileName, setSubmittedFileName] = useState('');
  const [profileUploadKey, setProfileUploadKey] = useState(0);
  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<ProfileUploadFormValues>();

  const handleProfileSubmit = ({ profileImage }: ProfileUploadFormValues) => {
    setSubmittedFileName(profileImage[0]?.name ?? '');
  };

  /*
  @ 선택한 프로필 이미지 초기화
  - resetField로 react-hook-form이 보관한 FileList 값을 비운다.
  - key를 변경해 ProfileUpload를 다시 마운트하면 내부 미리보기가 제거되고,
    컴포넌트의 cleanup에서 기존 Object URL도 안전하게 해제된다.
  - 이 예시는 imageUrl이 없는 업로드이므로 초기화 후 Gallery 아이콘이 있는
    default 상태로 돌아간다.
  */
  const handleProfileReset = () => {
    resetField('profileImage');
    setSubmittedFileName('');
    setProfileUploadKey((previousKey) => previousKey + 1);
  };

  return (
    <main className="mx-auto flex max-w-[720px] flex-col gap-[40px] px-[24px] py-[40px]">
      <header>
        <h1 className="text-2xl-bold text-black-300">ProfileUpload</h1>
        <p className="mt-[8px] text-md-regular text-gray-500">
          파일 선택, 미리보기, 서버 이미지 표시와 React Hook Form 연동을
          확인하는 페이지입니다. 화면 너비 744px부터 업로드 영역이 100px에서
          160px로 변경됩니다.
        </p>
      </header>

      <section>
        <h2 className="mb-[20px] text-xl-semibold text-black-300">
          파일 선택 예시
        </h2>

        {/*
        @ React Hook Form 사용 예시
        - register의 ref, name, onChange, onBlur가 실제 file input까지 전달된다.
        - 파일 형식 같은 업무 검증은 React Hook Form에서 관리한다.
        - 검증 결과의 error를 전달하면 ProfileUpload가 오류 메시지와 aria 속성을 함께 처리한다.
        - label, labelVariant와 required를 전달하면 공용 Label과 필수 표시가 자동으로 연결된다.
        */}
        <form
          noValidate
          onSubmit={handleSubmit(handleProfileSubmit)}
          className="flex flex-col items-start"
        >
          <ProfileUpload
            key={profileUploadKey}
            id="profileImage"
            label="프로필 이미지"
            labelVariant="profile"
            required
            error={errors.profileImage?.message}
            {...register('profileImage', {
              required: '프로필 이미지를 선택해 주세요.',
              validate: (files) =>
                !files[0] ||
                files[0].type.startsWith('image/') ||
                '이미지 파일만 선택할 수 있습니다.',
            })}
          />

          <div className="mt-[24px] flex gap-[12px]">
            <Button
              type="submit"
              variant="solid"
              size="xs"
              className="w-[140px]"
            >
              선택 확인
            </Button>
            <Button
              type="button"
              variant="outlined"
              size="xs"
              onClick={handleProfileReset}
              className="w-[140px]"
            >
              초기화
            </Button>
          </div>

          <p
            role="status"
            aria-live="polite"
            className="mt-[12px] min-h-[24px] text-md-regular text-black-200"
          >
            {submittedFileName && `선택된 파일: ${submittedFileName}`}
          </p>
        </form>
      </section>

      <section>
        <h2 className="mb-[20px] text-xl-semibold text-black-300">
          서버 이미지가 있는 상태
        </h2>
        <ProfileUpload
          id="savedProfileImage"
          name="savedProfileImage"
          label="등록된 프로필 이미지"
          labelVariant="profile"
          imageUrl={ImgProfileExample.src}
          aria-label="등록된 프로필 이미지 변경"
        />
        <p className="mt-[12px] text-md-regular text-gray-500">
          실제 화면에서는 API가 반환한 이미지 URL을 imageUrl로 전달합니다. 새
          파일을 선택하면 로컬 미리보기가 기존 이미지를 대신합니다.
        </p>
      </section>
    </main>
  );
}
