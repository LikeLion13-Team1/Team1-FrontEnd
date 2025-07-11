import { reissueAccessToken } from "../api/tokenReissue.js";

// 인증이 필요한 요청을 감싸는 fetch wrapper 함수
export async function fetchWithAuth(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const authOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let res = await fetch(url, authOptions);

  // 토큰 만료 401코드 -> 재발급 시도
  if (res.status === 401) {
    console.warn("accessToken 만료 → 재발급 시도 중");
    // 리프레쉬 토큰으로 새로운 액세스 토큰 재발급
    const success = await reissueAccessToken();
    if (!success) return res; // 만약 재발급 실패 -> 로그인 페이지로 이동됨

    // 재발급 성공 ->  새 accessToken으로 다시 요청
    const newAccessToken = localStorage.getItem("accessToken");
    authOptions.headers.Authorization = `Bearer ${newAccessToken}`;
    res = await fetch(url, authOptions);
  }

  return res;
}
