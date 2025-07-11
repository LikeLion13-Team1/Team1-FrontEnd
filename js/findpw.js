document.addEventListener("DOMContentLoaded", function () {
  const sendCodeBtn = document.getElementById("sendCodeBtn");
  const emailInput = document.getElementById("finalEmail");
  const authSection = document.getElementById("authSection");
  const verifyCodeBtn = document.querySelector(".code-btn");
  const changePasswordBtn = document.querySelector(".login-button");

  // ✅ 1. 인증번호 받기
  sendCodeBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const enteredEmail = emailInput.value.trim();

    if (!enteredEmail) {
      emailInput.classList.add("error");
      emailInput.placeholder = "이메일을 입력해 주세요.";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enteredEmail)) {
      emailInput.classList.add("error");
      emailInput.placeholder = "올바른 이메일을 입력해주세요.";
      return;
    }

    try {
      const response = await fetch(
        `http://13.209.221.182:8080/mail-verifications/request-code?email=${encodeURIComponent(
          enteredEmail
        )}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      const data = await response.json();
      console.log("📩 인증코드 요청 응답:", data);

      if (data.isSuccess) {
        alert("✅ 인증번호가 이메일로 전송되었습니다!");
        emailInput.classList.remove("error");
        authSection.style.display = "block"; // 인증 입력창 열기
      } else {
        emailInput.classList.add("error");
        emailInput.placeholder = "존재하지 않는 이메일입니다.";
      }
    } catch (error) {
      console.error("서버 오류:", error);
      alert("서버 오류로 인증번호를 보내지 못했습니다.");
    }
  });

  // ✅ 2. 인증번호 확인
  verifyCodeBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const code = document.getElementById("authCode").value.trim();

    if (!code) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `http://13.209.221.182:8080/mail-verifications/validation/password?email=${encodeURIComponent(
          email
        )}&code=${encodeURIComponent(code)}`,
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );

      const data = await response.json();
      console.log("✅ 인증번호 확인 응답:", data);

      if (data.isSuccess) {
        alert("✅ 인증번호가 확인되었습니다!");
        console.log(data.result);
        console.log(data.result.uuid);
        localStorage.setItem("passwordResetUUID", data.result.uuid);
      } else {
        alert("❌ 인증번호가 유효하지 않습니다.");
      }
    } catch (error) {
      console.error("인증번호 확인 중 오류:", error);
      alert("서버 오류로 인증번호를 확인할 수 없습니다.");
    }
  });

  // ✅ 3. 비밀번호 변경
  changePasswordBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document
      .getElementById("confirmPassword")
      .value.trim();
    const uuid = localStorage.getItem("passwordResetUUID");

    console.log(uuid);

    if (!uuid) {
      alert("❗ 인증이 완료되지 않았습니다. 인증번호를 먼저 확인해주세요.");
      return;
    }

    if (!password || !confirmPassword) {
      alert("비밀번호를 모두 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(
        "http://13.209.221.182:8080/api/v1/auth/password/reset/code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            PasswordToken: uuid, // 꼭 대소문자 맞게
          },
          body: JSON.stringify({
            newPassword: password,
            newPasswordConfirmation: confirmPassword,
          }),
        }
      );

      const data = await response.json();
      console.log("🔒 비밀번호 변경 응답:", data);

      if (data.isSuccess) {
        alert("✅ 비밀번호가 성공적으로 변경되었습니다!");
        localStorage.removeItem("passwordResetUUID");
        window.location.href = "login.html";
      } else {
        alert("❌ 비밀번호 변경 실패: " + data.message);
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      alert("서버 오류로 비밀번호를 변경할 수 없습니다.");
    }
  });
});
