import { promptSetting } from "./prompt.js";

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const routineBtn = document.getElementById("routineBtn");
const weatherBtn = document.getElementById("weatherBtn");
const tipBtn = document.getElementById("tipBtn");
const questionBtns = document.querySelectorAll(".question-btn");
const welcomeMessage = document.querySelector(".welcome-message");

const cityNameMap = {
  Seoul: "서울",
  Busan: "부산",
  Incheon: "인천",
  Daegu: "대구",
  // 필요한 도시 더 추가 가능
};

// OpenAI API 키 및 프롬프트 설정 (이 부분은 config.js에서 가져옵니다)
const apiKey = OPENAI_API_KEY;

// 챗봇 박스를 보여주는 함수
function showChatBox() {
  if (chatBox.style.display !== "block") {
    chatBox.style.display = "block";
  }
}

function hideWelcomeMessage() {
  if (welcomeMessage && !welcomeMessage.classList.contains("hidden")) {
    welcomeMessage.classList.add("hidden");
  }
}

// 추천 질문 버튼 클릭 시 챗박스 보여주기 & 환영 메시지 숨기기
questionBtns.forEach((btn) => {
  btn.addEventListener("click", showChatBox);
  btn.addEventListener("click", hideWelcomeMessage);
});

// 입력버튼 클릭 시 챗박스 보여주기 & 환영 메시지 숨기기
sendBtn.addEventListener("click", showChatBox);
sendBtn.addEventListener("click", hideWelcomeMessage);

// 메시지를 추가하는 함수
function addMessage(text, who) {
  const msg = document.createElement("div");
  msg.className = `msg ${who}`;

  // 아바타 이미지 생성
  const avatar = document.createElement("img");
  avatar.className = "avatar";
  avatar.src = who === "user" ? "../assets/user.svg" : "../assets/bot.svg";
  avatar.alt = who === "user" ? "사용자" : "챗봇";

  // 메시지 내용 생성
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = text;

  // append 순서: 챗봇은 avatar 먼저, 유저는 반대로
  if (who === "user") {
    msg.appendChild(bubble);
    msg.appendChild(avatar);
  } else {
    msg.appendChild(avatar);
    msg.appendChild(bubble);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 챗봇에게 질문을 보내는 함수
// 메시지를 추가하고 OpenAI API로 요청을 보냅니다.
async function askChatbot(message) {
  addMessage(message, "user");
  chatInput.value = "";
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: promptSetting },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await res.json();
    const reply =
      data.choices?.[0]?.message?.content || "답변을 불러오지 못했습니다.";
    addMessage(reply, "bot");
  } catch (error) {
    console.error(error);
    addMessage("⚠️ 오류가 발생했습니다.", "bot");
  }
}

// 오늘 날짜를 가져오는 함수
function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  return `${year}년 ${month}월 ${date}일`;
}

// 날씨 정보를 가져오는 함수
// 기본적으로 서울 날씨를 가져오며, 다른 도시도 가능
async function getWeather(city = "Seoul") {
  const weatherKey = WEATHER_API_KEY; //(이 부분은 config.js에서 가져옵니다)
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric&lang=kr`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const weather = data.weather[0].description; // 흐림, 맑음 등
    const temp = data.main.temp; // 온도
    const cityKor = cityNameMap[city] || city;
    return `${cityKor}의 날씨는 ${weather}, ${temp}도야.`;
  } catch (err) {
    console.error("날씨 불러오기 실패", err);
    return "날씨 정보를 가져오지 못했어요.";
  }
}

// 메시지 전송 버튼 클릭 이벤트
sendBtn.addEventListener("click", () => {
  const message = chatInput.value.trim();
  if (message) {
    askChatbot(message);
  }
});

// 엔터 키로 메시지 전송
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// 추천 루틴 버튼 클릭 이벤트
routineBtn.addEventListener("click", () => {
  const message = "오늘의 살림 루틴 추천좀 해줘!";
  askChatbot(message);
});

// 날씨 버튼 클릭 이벤트
weatherBtn.addEventListener("click", async () => {
  const today = getTodayDate();
  const weather = await getWeather("Seoul");
  const message = `오늘은 ${today}이고, ${weather} 오늘 어떤 살림 루틴을 하면 좋을까?`;
  askChatbot(message);
});

// 살림 꿀팁 버튼 클릭 이벤트
tipBtn.addEventListener("click", () => {
  const message = "오늘의 살림 꿀팁 하나만 알려줘!";
  askChatbot(message);
});
