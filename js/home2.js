document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("token");
  const welcomeEl = document.querySelector(".welcome");

  if (!token || !welcomeEl) return;

  try {
    const response = await fetch(
      "http://13.209.221.182:8080/api/v1/members/info",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    console.log("사용자 정보 응답:", data);
    if (data.isSuccess && data.result?.username) {
      const userName = data.result.username;
      welcomeEl.innerHTML = `${userName}님, 오늘도 좋은 하루 보내세요 :)`;
    } else {
      welcomeEl.innerHTML = `멋사님, 오늘도 좋은 하루 보내세요 :)`;
    }
  } catch (err) {
    console.error("사용자 정보 요청 실패:", err);
    welcomeEl.innerHTML = `멋사님, 오늘도 좋은 하루 보내세요 :)`;
  }
});
//카드
document.querySelector(".card1").addEventListener("click", () => {
  window.location.href = "Q1.html";
});
document.querySelector(".card2").addEventListener("click", () => {
  window.location.href = "chatbot.html";
});
document.querySelector(".card3").addEventListener("click", () => {
  window.location.href = "calender.html";
});
