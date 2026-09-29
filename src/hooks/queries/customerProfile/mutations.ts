import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createCustomerProfile,
  updateCustomerProfile,
} from '@/lib/api/customerProfile';
import { HttpError } from '@/lib/api/errors';

import { customerProfileKeys } from '@/hooks/queries/customerProfile/keys';

/*=================================================
고객 프로필 Mutation
=================================================*/

/*
@ 고객 프로필 최초 등록
- 등록 성공 응답을 Guard와 수정 화면이 함께 사용하는 detail 캐시에 즉시 저장한다.
- 캐시를 먼저 갱신해야 견적 요청 화면으로 이동할 때 Guard가 이전의 null 값을 보고
  사용자를 다시 등록 페이지로 보내는 문제를 막을 수 있다.
- 409는 서버에는 프로필이 있지만 브라우저 캐시만 미등록 상태인 경우일 수 있으므로
  프로필 Query를 다시 조회해 화면 상태를 서버와 동기화한다.
- 토스트와 페이지 이동은 화면 정책이므로 mutation이 아니라 등록 페이지에서 처리한다.
*/
export function useCreateCustomerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerProfile,
    onSuccess: (createdProfile) => {
      queryClient.setQueryData(customerProfileKeys.detail(), createdProfile);
    },
    onError: async (error) => {
      if (error instanceof HttpError && error.status === 409) {
        await queryClient.invalidateQueries({
          queryKey: customerProfileKeys.detail(),
        });
      }
    },
  });
}

/*
@ 고객 프로필 수정
- PATCH 성공 응답을 detail 캐시에 저장해 Guard와 수정 화면이 같은 최신 값을 사용하게 한다.
- 페이지 이동과 토스트는 화면 정책이므로 수정 페이지에서 처리한다.
*/
export function useUpdateCustomerProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(customerProfileKeys.detail(), updatedProfile);
    },
  });
}
