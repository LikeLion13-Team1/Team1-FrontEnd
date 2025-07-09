export async function reissueAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  console.log("재re:", refreshToken);

  const res = await fetch("http://13.209.221.182:8080/api/v1/auth/reissue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await res.json();

  if (data.isSuccess) {
    localStorage.setItem("accessToken", data.result.accessToken);
    localStorage.setItem("refreshToken", data.result.refreshToken);
    console.log("✅ 새 accessToken:", data.result.accessToken);
    console.log("✅ 새 refreshToken:", data.result.refreshToken);

    return true;
  } else {
    // 토큰 갱신 실패 시 로그인페이지로 이동
    alert("토큰 갱신 실패! 다시 로그인 해주세요.");
    window.location.href = "/pages/login.html";
    return false;
  }
}
