console.log("Index script loaded");

document.addEventListener("DOMContentLoaded", function () {
  const loginPage = document.getElementById("loginPage");
  const signupPage1 = document.getElementById("signupPage1");
  const signupPage2 = document.getElementById("signupPage2");

  const toSignup1 = document.getElementById("toSignup1");
  const toSignup2 = document.getElementById("toSignup2");
  const backToLoginLinks = document.querySelectorAll(".backToLogin");

  const signupEmail = document.getElementById("signupEmail");
  const finalEmail = document.getElementById("finalEmail");

  // 로그인 → 회원가입 1
  toSignup1.addEventListener("click", function (e) {
    e.preventDefault();
    loginPage.style.display = "none";
    signupPage1.style.display = "flex";
  });

  // 회원가입 1 → 회원가입 2
  toSignup2.addEventListener("click", function () {
    finalEmail.value = signupEmail.value;
    signupPage1.style.display = "none";
    signupPage2.style.display = "flex";
  });

  // 로그인 화면으로 돌아가기
  backToLoginLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      signupPage1.style.display = "none";
      signupPage2.style.display = "none";
      loginPage.style.display = "flex";
    });
  });
});

document.getElementById("signupSubmit").addEventListener("click", function (e) {
  const agree = document.getElementById("agreeTerms");
  if (!agree.checked) {
    e.preventDefault();
    alert("개인 정보 제공에 동의하셔야 회원가입이 가능합니다.");
    return;
  }

  alert("회원가입 완료!");
});
