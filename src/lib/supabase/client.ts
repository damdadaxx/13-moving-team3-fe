/*
@ Supabase 브라우저 클라이언트 (싱글턴)
- 채팅 전용 DB. 기존 도메인 DB(PostgreSQL + API_BASE_URL)와는 별개다
- Realtime 구독(채팅 메시지 수신), Storage(이미지 업로드)에서만 쓴다
- 인증은 기존 자체 로그인(JWT 쿠키)을 쓰므로 Supabase Auth는 사용하지 않는다
*/
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase 환경변수(NEXT_PUBLIC_SUPABASE_URL/KEY)가 없습니다.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
