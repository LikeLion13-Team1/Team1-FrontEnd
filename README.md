## 1. 기본적인 작업 흐름 예시
```
# 최신 코드 받아오기
git checkout develop
git pull origin develop

# 본인 브랜치에서 작업 시작(예시) -> 브랜치 이름은 본인이름으로 하시면 됩니다..!
git checkout -b (영준)

# 작업 후 커밋
git add .
git commit -m "feat(main-page): 메인 페이지 구성 및 ui 요소 렌더링"

# 원격 저장소에 푸시 및 PR 생성(예시)
git push origin (영준)

# GitHub에서 Pull Request(PR) 생성 → develop 브랜치에 병합
```

## 2. 파일 구조
파일 구조 예시입니다.
```
TEAM1-FRONTEND/
├── assets/
│   └── salimi_icon.png       ← 이미지 등 정적 파일
│
├── js/
│   ├── index.js              ← index.html에 연결될 JS
│   └── chatbot.js            ← chatbot.html에 연결될 JS
│
├── styles/
│   ├── global.css            ← 공통 스타일
│   └── chatbot.css           ← chatbot 전용 스타일
│
├── pages/
│   └── chatbot.html          ← 챗봇 페이지
│
├── index.html                ← 메인 랜딩 페이지 (Vercel용)
└── README.md

```
