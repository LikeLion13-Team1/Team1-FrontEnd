# Team1-FrontEnd의 프론트엔드 레포지토리입니다.

바닐라 JS + Vite 기반으로 진행합니다

## ✅ 설치 및 실행

npm install
npm run dev

## ✅ 브랜치 네이밍 규칙

브랜치 이름은 다음 규칙을 따릅니다:

| 브랜치 유형 | 설명                                                                                | 예시                                |
| ----------- | ----------------------------------------------------------------------------------- | ----------------------------------- |
| main        | 배포 가능한 안정적인 코드가 존재하는 메인 브랜치                                    | `main`                              |
| develop     | 개발자들이 작업한 기능(feature branch)을 병합하여 통합하는 개발 브랜치              | `develop`                           |
| feature     | 새로운 기능 개발 시 생성하는 브랜치                                                 | `feat/login-page`, `feat/main-page` |
| fix         | 버그 수정 시 생성하는 브랜치                                                        | `fix/login-error`                   |
| hotfix      | 긴급하게 수정해야 하는 버그 발생 시 main에서 분기하여 작업 후 main과 develop에 병합 | `hotfix/login-error`                |

## ✅ 커밋 메시지 규칙

### 1. 커밋 메세지 구조

커밋 메시지는 다음 구조를 따릅니다:

```
<type>(<scope>): <subject>

<body>
```

### 2. 커밋 메시지 유형

커밋의 유형을 나타내며, 다음 중 하나를 선택합니다:

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 형식 변경 (코드 로직에 영향을 주지 않는 변경)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가 또는 수정
- `chore`: 빌드 프로세스 또는 보조 도구 변경

### 3. 커밋 예시

#### feat (새로운 기능)😁

```
feat(auth): 소셜 로그인 기능 추가

- Google과 Kakao 소셜 로그인 구현
- 유저 프로필 정보 연동 및 DB 저장 로직 추가

```

## ✅ src 폴더 구조

```
src/
├── assets/         # 이미지, 폰트 등 정적 파일
├── components/     # 재사용 가능한 UI 컴포넌트
├── pages/          # 각각의 화면(라우트 단위)
│   ├── Home.js
│   ├── Post.js
│   └── ...
├── router/         # 라우터 관련 파일
│   ├── router.js
│   └── routes.js
├── styles/         # 전역 또는 모듈 CSS
│   └── style.css
├── utils/          # 유틸 함수 모음
├── main.js         # 진입점
```

## ✅ 코드 스타일

- ESLint + Prettier 사용
- 저장 시 자동 포맷 (`editor.formatOnSave`)
- 수동 검사:
  - `npx eslint .`
  - `npx prettier --write .`
