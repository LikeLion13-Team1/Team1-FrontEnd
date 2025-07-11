import { saveUserFeature, getUserFeature } from "./api/featuresApi.js";
import { fetchWithAuth } from "../js/auth/auth.js";

const BASE_URL = "http://13.209.221.182:8080";

// 점수 매핑
const scoreMap = {
  "청소는 무조건! 먼지는 못 참아요.": 3,
  "정리는 해요~ 너무 더러우면요.": 2,
  "청소에는 전혀 관심 없어요!": 1,
  "매일매일 정리정돈 필수!": 3,
  "그래도 적당히는 치워요.": 2,
  "안보이면 장땡 괜찮아요.": 1,
  "살림왕이 되고 싶어요!!": 3,
  "습관 정도는 들여야죠...": 2,
  "살 수 있을 정도면 됐죠..?": 1,
  "힘들어도 좋아요:) 확실한 루틴을 주세요.": 3,
  "쉬운 것부터 차근차근이 좋아요.": 2,
  "흠.. 그날 기분 따라 알아서 할게요.": 1,
};

// ✅ 루틴 생성 확인 함수
async function checkRoutinesInGroup(groupId) {
  const res = await fetchWithAuth(
    `${BASE_URL}/api/v1/groups/${groupId}/routines/my?cursor=0&size=5`
  );
  const data = await res.json();
  console.log(`📦 그룹 ${groupId}의 루틴 목록:`, data.result.routines);
}

// ✅ 그룹 가져오고 추천 루틴 생성 + 루틴 확인까지
async function fetchMyGroups() {
  const res = await fetchWithAuth(
    `${BASE_URL}/api/v1/groups/my?cursor=0&size=3`
  );
  const data = await res.json();

  if (data.isSuccess) {
    const groups = data.result.groups;
    console.log("✅ 내 그룹 목록:", groups);

    for (const group of groups) {
      // 1. 루틴 추천 생성
      await fetchWithAuth(
        `${BASE_URL}/api/v1/groups/${group.groupId}/recommendation`,
        {
          method: "POST",
        }
      );
      console.log(`✅ 그룹 ${group.groupId}에 추천 루틴 생성 완료`);

      // 2. 루틴 목록 확인
      await checkRoutinesInGroup(group.groupId);
    }

    localStorage.setItem("myGroupList", JSON.stringify(groups));
  } else {
    console.error("❌ 그룹 목록 조회 실패", data.message);
  }
}

// ✅ 메인 시작
document.addEventListener("DOMContentLoaded", async () => {
  const saved = JSON.parse(localStorage.getItem("surveyAnswers") || "{}");

  const featureBody = {
    q1: scoreMap[saved.q1] || 0,
    q2: scoreMap[saved.q2] || 0,
    q3: scoreMap[saved.q3] || 0,
    q4: scoreMap[saved.q4] || 0,
  };
  console.log("✅ Q1~Q4 답:", featureBody);

  // 1. 회원 특성 저장
  try {
    const result = await saveUserFeature(featureBody);
    console.log("✅ 회원 특성 저장 or 수정 성공:", result);
  } catch (err) {
    console.error("❌ 회원 특성 저장 실패", err);
    return;
  }

  // 2. 그룹 목록 조회 + 루틴 추천 생성 + 확인
  await fetchMyGroups();
});
