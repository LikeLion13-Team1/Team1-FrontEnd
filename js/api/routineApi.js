import { fetchWithAuth } from "../auth/auth.js";

// 루틴 관련 api 요청 함수 모음
export async function fetchMyRoutines() {
  const res = await fetchWithAuth(
    "http://13.209.221.182:8080/api/v1/routines/my"
  );

  if (!res.ok) throw new Error("루틴 불러오기 실패");

  const data = await res.json();
  return data.result;
}
