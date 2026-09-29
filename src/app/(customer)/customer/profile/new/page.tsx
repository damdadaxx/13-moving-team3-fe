// [메뉴] 헤더 모달 메뉴 > 프로필
// [페이지] 프로필 최초 생성
'use client';

import type { CustomerProfileFormValues } from '@/types/customerProfile';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';

import { useToast } from '@/hooks/common/useToast';
import { useCreateCustomerProfileMutation } from '@/hooks/queries/customerProfile/mutations';

import CustomerProfileForm from '@/components/customer/CustomerProfileForm';

export default function ProfileNewPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createProfileMutation = useCreateCustomerProfileMutation();

  /*
  @ 고객 프로필 등록 제출
  - 폼에서 Zod 검증을 통과한 값만 전달받는다.
  - mutation 성공 시 detail 캐시가 먼저 갱신되므로 CustomerProfileGuard가
    사용자를 다시 등록 페이지로 보내지 않는다.
  - 등록 화면이 브라우저 뒤로가기에 남지 않도록 push가 아니라 replace로 이동한다.
  - 오류는 다시 폼 훅으로 전달되어 필드 오류 또는 폼 전체 오류로 표시된다.
  */
  const handleSubmit = async (values: CustomerProfileFormValues) => {
    await createProfileMutation.mutateAsync(values);
    showToast('프로필 등록이 완료되었습니다.');
    router.replace(ROUTES.customerHome);
  };

  return (
    <CustomerProfileForm
      mode="create"
      isSubmitting={createProfileMutation.isPending}
      onSubmit={handleSubmit}
    />
  );
}
