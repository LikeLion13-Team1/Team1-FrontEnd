import { fetchWithAuth } from "../auth/auth.js";

const BASE_URL = "https://www.dlrbdjs.store";

// 회원 특성 저장 (존재하면 PATCH, 없으면 POST)
export const saveUserFeature = async (featureData) => {
  // 먼저 회원 특성 존재 여부 확인
  const getRes = await fetchWithAuth(`${BASE_URL}/api/v1/features/my`);
  const isExists = getRes.ok;

  const method = isExists ? "PATCH" : "POST";

  const res = await fetchWithAuth(`${BASE_URL}/api/v1/features/my`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(featureData),
  });

  if (!res.ok) {
    const errorMessage = isExists
      ? "회원 특성 수정 실패"
      : "회원 특성 생성 실패";
    throw new Error(errorMessage);
  }

  const json = await res.json();
  console.log(json.result);
  return json.result;
};

export const getUserFeature = async () => {
  const res = await fetchWithAuth(`${BASE_URL}/api/v1/features/my`);
  if (!res.ok) throw new Error("회원 특성 조회 실패");
  const json = await res.json();
  return json.result;
};
