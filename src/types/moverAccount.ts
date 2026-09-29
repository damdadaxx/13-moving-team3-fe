/*=================================================
기사님 기본정보 수정 폼 타입
=================================================*/

/*
@ 화면에서 관리하는 값
- 이름·이메일·전화번호는 회원가입 때 저장된 기본정보를 표시한다.
- 이메일은 현재 API 수정 계약에 포함되지 않지만, 조회값을 폼에서 함께 보여주기 위해 유지한다.
- 새 비밀번호 확인은 프론트 검증용이며 PATCH /auth/password에는 전송하지 않는다.
*/
export interface MoverAccountFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
