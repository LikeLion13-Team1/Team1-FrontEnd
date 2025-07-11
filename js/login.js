document.addEventListener("DOMContentLoaded", function () {
  const toSignup1 = document.getElementById("toSignup1");
  const toFindPW = document.getElementById("toFindPW");
  const loginButton = document.querySelector(".login-button");

  // 👉 비밀번호 찾기 페이지 이동
  toFindPW.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "findpw.html";
  });

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
        const accessToken = data.result?.accessToken;
        const refreshToken = data.result?.refreshToken;

        console.log("🔐 accessToken:", accessToken);
        console.log("🔁 refreshToken:", refreshToken);

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        window.location.href = "./home2.html";
      } else {
        alert("❌ 로그인 실패: " + data.message);
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    }
  });
});
const kakaoLoginBtn = document.getElementById("kakaoLoginBtn");
const kakaoClientId = "91f8abb11bc458dd121fa173ace8bf55";
const redirectUri = "http://13.209.221.182:8080/pages/kakao-callback.html";

kakaoLoginBtn.addEventListener("click", function () {
  // 카카오 로그인 페이지로 이동
  window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${redirectUri}`;
});

// const params = new URLSearchParams(window.location.search);
// // const accessToken = params.get("accessToken");
// // const refreshToken = params.get("refreshToken");

// console.log(accessToken);
// console.log(refreshToken);

// if (accessToken && refreshToken) {
//   localStorage.setItem("accessToken", accessToken);
//   localStorage.setItem("refreshToken", refreshToken);
//   window.history.replaceState({}, document.title, "home2.html");
// }
