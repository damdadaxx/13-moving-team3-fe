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

[http://localhost:3000](http://localhost:3000) 에서 확인

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
main    ← 배포용 (PR로만 merge)
dev     ← 개발 통합 브랜치
feat/*  ← 기능 개발
fix/*   ← 버그 수정
```

## 커밋 컨벤션

```
feat:     새로운 기능
fix:      버그 수정
style:    스타일 변경
refactor: 리팩토링
chore:    설정/의존성
docs:     문서
test:     테스트
```
