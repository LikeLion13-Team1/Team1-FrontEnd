import { renderRoutineSections } from "../js/routineset/renderRoutineSections.js";
import {
  fetchRoutineGroup,
  fetchRoutinesInGroup,
} from "../js/api/routineApi.js";
import { setupModalHandlers } from "../js/routineset/modalManager.js";
import { setupCheckboxToggle } from "../js/routineset/routineCheckBox.js";

document.addEventListener("DOMContentLoaded", async () => {
  setupModalHandlers();
  setupCheckboxToggle();

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");

  if (!groupId) {
    console.error("❌ URL에 groupId가 없습니다.");
    alert("올바른 접근이 아닙니다. groupId가 필요합니다.");
    return;
  }

  const numericGroupId = Number(groupId);

  try {
    // ✅ 1. 그룹 정보 불러오기
    const group = await fetchRoutineGroup(numericGroupId);
    console.log("📘 그룹 정보:", group);

    const titleEl = document.getElementById("routine-title");
    if (titleEl) {
      titleEl.innerHTML = `
        <img src="../assets/broomstick.svg" alt="Broomstick Icon" width="22px" height="35px" />
        ${group.name}
      `;
    }

    const routineDes = document.getElementById("routine-description");
    routineDes.innerText = group.name;

    // ✅ 2. 루틴 목록 불러오기
    const routineData = await fetchRoutinesInGroup(numericGroupId);
    const routineIds = routineData.map((r) => r.routineId); // ✨ routineId만 추출
    console.log("📦 루틴 ID 목록:", routineIds);

    // ✅ 3. 렌더링
    const container = document.getElementById("routine-sets-container");
    await renderRoutineSections(routineIds, container);
  } catch (error) {
    console.error("❌ 그룹 정보 또는 루틴 렌더링 실패", error);
  }
});
