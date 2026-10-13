/*
@ Supabase 브라우저 클라이언트 (싱글턴)
- 채팅 전용 DB. 기존 도메인 DB(PostgreSQL + API_BASE_URL)와는 별개다
- Realtime 구독(채팅 메시지 수신), Storage(이미지 업로드)에서 쓴다
- Supabase Auth는 안 쓰지만, BE가 Legacy JWT Secret을 우리 액세스 토큰과 맞춰둬서
  그 토큰을 Authorization으로 보내면 RLS의 auth.uid()가 우리 User.id로 채워진다.
  그래서 accessToken 콜백(Third-Party Auth)으로 로그인 상태의 토큰을 흘려보낸다
  (토큰 자체는 src/lib/supabase/accessToken.ts 에서 로그인/리프레시 응답으로 채운다)
*/
import { createClient } from '@supabase/supabase-js';

import { getSupabaseAccessToken } from '@/lib/supabase/accessToken';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL/KEY)가 없습니다.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  accessToken: async () => getSupabaseAccessToken(),
});
