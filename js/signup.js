console.log("Signup script loaded");

document.addEventListener("DOMContentLoaded", function () {
  const signupPage1 = document.getElementById("signupPage1");
  const signupPage2 = document.getElementById("signupPage2");

  const toSignup2 = document.getElementById("toSignup2");
  const backToLoginLinks = document.querySelectorAll(".backToLogin");

  const signupEmail = document.getElementById("signupEmail");
  const finalEmail = document.getElementById("finalEmail");

  // 회원가입 1 → 회원가입 2
  toSignup2.addEventListener("click", function (e) {
    const email = signupEmail.value.trim();
    if (email === "") {
      e.preventDefault();
      alert("이메일을 입력해주세요.");
      signupEmail.focus();
      return;
    }

    finalEmail.value = email;
    signupPage1.style.display = "none";
    signupPage2.style.display = "flex";
  });

  // 로그인 페이지로 돌아가기
  backToLoginLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "login.html";
    });
  });
});
