console.log("Mypage script loaded");

document.getElementById("openPageBtn").addEventListener("click", () => {
  document.getElementById("myModal").style.display = "block";
}); //연결하려는 모달

//회원정보 불러오기
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      "http://13.209.221.182:8080/api/v1/members/info",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("회원 정보 불러오기 실패");
    }

    const data = await response.json();

    document.getElementById("nickname").textContent = data.result.nickname;
    document.getElementById("email").textContent = data.result.email;

    //함께한 날 계산 (예: 가입일이 서버에서 내려올 경우)
    //const joinedDate = new Date(data.result.createdAt); // 가입일
    //const today = new Date();
    //const days = Math.floor((today - joinedDate) / (1000 * 60 * 60 * 24));
    //document.getElementById("joinedDays").textContent = `${days}일째`;
  } catch (error) {
    console.error("유저 정보를 불러오는 중 오류 발생:", error);
  }
});

//페이지 연결
document.addEventListener("DOMContentLoaded", () => {
  const goButtons = document.querySelectorAll(".go-btn");

  goButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetUrl = button.getAttribute("data-url");
      if (targetUrl) {
        window.location.href = targetUrl;
      }
    });
  });
});

//로그아웃
document.getElementById("logoutBtn").addEventListener("click", async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인된 상태가 아닙니다.");
    return;
  }

  try {
    const response = await fetch(
      "http://13.209.221.182:8080/api/v1/members/withdrawal",
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer ${token}}",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      alert("로그아웃 완료되었습니다.");
      localStorage.removeItem("accessToken");
      window.location.href = "login.html";
    } else {
      alert("로그아웃 실패: ${data.message");
    }
  } catch (error) {
    console.error("서버오류:", error);
    alert("서버와 연결할 수 없습니다.");
  }
});
