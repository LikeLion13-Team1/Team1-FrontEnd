document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken"); // ✅ 수정: localStorage + accessToken
  const welcomeEl = document.querySelector(".welcome");

  if (!token || !welcomeEl) return;

  try {
    const res = await fetch("http://13.209.221.182:8080/api/v1/members/info", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // ❗ JSON 에러 방지: 먼저 text로 확인 후 파싱
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("사용자 이름:", data.result.username);

      if (data.isSuccess && data.result?.username) {
        const userName = data.result.username;
        welcomeEl.innerHTML = `${userName}님, 오늘도 좋은 하루 보내세요 :)`;
      } else {
        welcomeEl.innerHTML = `멋사님, 오늘도 좋은 하루 보내세요 :)`;
      }
    } catch (e) {
      console.warn("JSON 파싱 실패 (비정상 응답):", text);
      welcomeEl.innerHTML = `멋사님, 오늘도 좋은 하루 보내세요 :)`;
    }
  } catch (err) {
    console.error("사용자 정보 요청 실패:", err);
    welcomeEl.innerHTML = `멋사님, 오늘도 좋은 하루 보내세요 :)`;
  }
});
