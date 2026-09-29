# 13-moving-team3-fe

3팀 고급 프로젝트 - 무빙 : 이사 소비자와 이사 전문가 매칭 서비스 플랫폼 프론트 레포지토리입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Runtime**: React 19

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173) (고정 포트)로 접속하여 확인할 수 있습니다.

## 스크립트

| 명령어             | 설명             |
| ------------------ | ---------------- |
| `npm run dev`      | 개발 서버 실행   |
| `npm run build`    | 프로덕션 빌드    |
| `npm run lint`     | ESLint 검사      |
| `npm run lint:fix` | ESLint 자동 수정 |
| `npm run format`   | Prettier 포맷    |

## 브랜치 전략

```
main              ← 프로덕션 배포 (Vercel)
dev               ← 개발 통합 브랜치
feat/이슈번호-기능명  ← 기능 개발
fix/이슈번호-기능명   ← 버그 수정
```

### Merge 전략

| 방향             | 방식             |
| ---------------- | ---------------- |
| `feat/*` → `dev` | Squash and Merge |
| `dev` → `main`   | Merge Commit     |

## Git 훅 (Husky)

커밋 시 자동으로 아래 작업이 실행됩니다.

| 훅           | 실행 내용                                 |
| ------------ | ----------------------------------------- |
| `pre-commit` | lint-staged (Prettier + ESLint 자동 수정) |
| `commit-msg` | commitlint (커밋 메시지 형식 검사)        |

## 커밋 컨벤션

```
feat:     새로운 기능 추가
fix:      버그 수정
docs:     문서 내용 변경
style:    포매팅, 세미콜론 누락 등 코드 변경이 없는 경우
refactor: 코드 구조 개선 (리팩토링)
test:     테스트 코드 작성
chore:    빌드 수정, 패키지 매니저 설정 등
```

**예시**

```bash
git commit -m "feat: 사용자 로그인 기능 추가"
git commit -m "fix: 모달 닫기 버튼 오류 수정"
git commit -m "docs: README 설정 가이드 추가"
git commit -m "style: 들여쓰기 정렬"
git commit -m "refactor: 버튼 컴포넌트 구조 개선"
git commit -m "test: 로그인 기능 단위 테스트 작성"
git commit -m "chore: 패키지 의존성 업데이트"
```
