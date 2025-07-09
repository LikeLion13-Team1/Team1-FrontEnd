import { fetchWithAuth } from "../js/auth/auth.js";

document.getElementById("openPageBtn").addEventListener("click", () => {
  document.getElementById("myModal").style.display = "block";
});

// ✅ 회원정보 불러오기
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/members/info"
    ); // Authorization은 fetchWithAuth가 처리

    if (!response.ok) throw new Error("회원 정보 불러오기 실패");

    const data = await response.json();
    const { username, email, createdAt } = data.result;

    document.getElementById("nickname").textContent = username;
    document.getElementById("email").textContent = email;

    if (createdAt) {
      const joinDate = new Date(createdAt);
      const today = new Date();
      const diffDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
      document.getElementById("joindays").textContent = `${diffDays}일 째`;
    }
  } catch (error) {
    console.error("유저 정보를 불러오는 중 오류 발생:", error);
  }
});

// ✅ 페이지 연결
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".go-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const targetUrl = button.getAttribute("data-url");
      if (targetUrl) window.location.href = targetUrl;
    });
  });
});

// ✅ 로그아웃
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const response = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Authorization은 fetchWithAuth가 처리
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      alert("로그아웃 완료되었습니다.");
      localStorage.removeItem("accessToken");
      window.location.href = "login.html";
    } else {
      alert(`로그아웃 실패: ${data.message}`);
    }
  } catch (error) {
    console.error("서버오류:", error);
    alert("서버와 연결할 수 없습니다.");
  }
});
