// login.js 입니다.
document.addEventListener("DOMContentLoaded", function () {
  const toSignup1 = document.getElementById("toSignup1");
  const loginButton = document.querySelector(".login-button");

  // 👉 회원가입 페이지 이동
  toSignup1.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "signup.html";
  });

  // 👉 로그인 버튼 클릭
  loginButton.addEventListener("click", async function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.209.221.182:8080/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (data.isSuccess) {
        // 토큰 저장 (필요 시 result.accessToken / result.refreshToken 등)
        const accessToken = data.result?.accessToken;
        console.log(accessToken);
        if (accessToken) {
          sessionStorage.setItem("token", accessToken);
        }

        // 로그인 후 이동할 페이지로 리디렉션
        window.location.href = "/pages/home2.html";
      } else {
        alert("❌ 로그인 실패: " + data.message);
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  });
});
