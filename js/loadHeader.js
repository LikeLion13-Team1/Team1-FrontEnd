// loadHeader.js
export function loadHeader(path = "../pages/header.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    if (!header) return;

    fetch(path)
      .then((res) => res.text())
      .then((html) => {
        header.innerHTML = html;

        // 헤더가 삽입된 이후에 메시지 순환
        const messages = [
          "루틴을 세우면 하루를 알차게 보낼 수 있어요!",
          "살림 챗봇에게 궁금한 걸 물어보세요!",
          "오늘 할 일을 챗봇이 도와드릴게요!",
          "살리미와 함께 즐거운 하루 보내세요!",
        ];

        let index = 0;
        const speechText = document.querySelector(".speech-text");

        if (speechText) {
          setInterval(() => {
            index = (index + 1) % messages.length;
            speechText.textContent = messages[index];
          }, 5000);
        }
      })
      .catch((err) => {
        console.error("헤더 로딩 실패:", err);
        header.innerHTML = "<p>헤더 로딩 실패</p>";
      });
  });
}
