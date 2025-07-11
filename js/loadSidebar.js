import { fetchWithAuth } from "../js/auth/auth.js";
const BASE_URL = "https://www.dlrbdjs.store";

export function loadSidebar(path = "../pages/sidebar.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    fetch(path)
      .then((res) => res.text())
      .then((html) => {
        sidebar.innerHTML = html;

        // 로고 클릭 시 홈으로 이동
        const logoArea = sidebar.querySelector("#logo-area");
        if (logoArea) {
          logoArea.style.cursor = "pointer";
          logoArea.addEventListener("click", () => {
            window.location.href = "../pages/home2.html";
          });
        }

        // ✅ 그룹 ID 받아서 루틴 버튼에 동적으로 href 설정
        setupRoutineSidebarLinks();
      })
      .catch((err) => {
        console.error("사이드바 로딩 실패:", err);
        sidebar.innerHTML = "<p>사이드바 로딩 실패</p>";
      });
  });
}

// ✅ 그룹 ID 받아서 사이드바에 연결
async function setupRoutineSidebarLinks() {
  try {
    const res = await fetchWithAuth(
      `${BASE_URL}/api/v1/groups/my?cursor=0&size=3`
    );
    const data = await res.json();

    if (!data.isSuccess) {
      console.error("❌ 그룹 불러오기 실패:", data.message);
      return;
    }

    const groups = data.result.groups;
    if (!groups || groups.length < 3) {
      console.warn("❗ 그룹이 3개 미만입니다.");
      return;
    }

    // DOM이 사이드바에 렌더된 이후 버튼에 링크 설정
    const routine1 = document.getElementById("routine1-btn");
    const routine2 = document.getElementById("routine2-btn");
    const routine3 = document.getElementById("routine3-btn");

    if (routine1 && routine2 && routine3) {
      routine1.href = `./routineset.html?groupId=${groups[0].groupId}`;
      routine2.href = `./routineset.html?groupId=${groups[1].groupId}`;
      routine3.href = `./routineset.html?groupId=${groups[2].groupId}`;
    } else {
      console.warn("❗ 루틴 버튼을 찾지 못했습니다.");
    }
  } catch (err) {
    console.error("❌ 그룹 정보 불러오기 실패:", err);
  }
}
