document.addEventListener("DOMContentLoaded", () => {
  const page1 = document.getElementById("signupPage1");
  const page2 = document.getElementById("signupPage2");
  const toSignup2Btn = document.getElementById("toSignup2");
  const backToLoginLinks = document.querySelectorAll(".backToLogin");
  const signupButton = page2.querySelector(".login-button");

  // ✅ 이메일 유효성 검사 함수
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ✅ 1단계 → 2단계로 넘어가기
  toSignup2Btn.addEventListener("click", () => {
    const email = document.getElementById("signupEmail").value.trim();
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("유효한 이메일 형식을 입력해주세요.");
      return;
    }

    document.getElementById("finalEmail").value = email;
    page1.style.display = "none";
    page2.style.display = "flex";
  });

  // ✅ 로그인 페이지로 돌아가기
  backToLoginLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "login.html";
    });
  });

  // ✅ 최종 회원가입 요청
  signupButton.addEventListener("click", async () => {
    const email = document.getElementById("finalEmail").value.trim();
    const name = document.getElementById("name").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const agreeTerms = document.getElementById("agreeTerms").checked;

    if (!name || !password || !confirmPassword || !agreeTerms) {
      alert("필수 항목을 모두 입력하고 약관에 동의해주세요.");
      return;
    }

    const confirmPasswordInput = document.getElementById("confirmPassword");
    const confirmPasswordLabel = document.querySelector(
      'label[for="confirmPassword"]'
    );

    // 에러 클래스 먼저 제거 (기존 스타일 제거)
    confirmPasswordInput.classList.remove("error");
    confirmPasswordLabel.classList.remove("error");

    if (password !== confirmPassword) {
      confirmPasswordInput.classList.add("error");
      confirmPasswordLabel.classList.add("error");
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.209.221.182:8080/api/v1/members/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email,
            password,
            profileImage: "string",
          }),
        }
      );

      if (response.status === 409) {
        alert("❌ 이미 존재하는 이메일입니다.");
        return;
      }

      const data = await response.json();

      if (data.isSuccess) {
        console.log("회원가입 성공");
        window.location.href = "login.html";
      } else {
        alert("회원가입 실패: " + data.message);
      }
    } catch (err) {
      console.error("회원가입 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  });
});
