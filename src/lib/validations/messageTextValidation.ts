import { z } from 'zod';

import { validationKey } from '@/lib/validations/validationMessage';

/*=================================================
메시지형 긴 글 검증 (반려 사유, 견적 상세 정보, 리뷰)
=================================================*/

/*
@ 최소 글자 수
- 입력창 안내(FormTextarea의 minLength)와 같은 값을 쓰도록 여기서 내보낸다.
- 최소 10자는 백엔드 검증(comment / rejectReason / review content)과 같다.
- 에러 문구(messages > Validation > messageTextMin)에 숫자가 들어 있으니
  이 값을 바꾸면 번역도 함께 바꾼다.
*/
export const MESSAGE_TEXT_MIN_LENGTH = 10;

export const messageTextSchema = z
  .string()
  .trim()
  .min(MESSAGE_TEXT_MIN_LENGTH, validationKey('messageTextMin'));
