import { renderRoutineSections } from "../js/routineset/renderRoutineSections.js";
import {
  fetchRoutineGroup,
  fetchRoutinesInGroup,
  deleteRoutineGroup,
  fetchRoutineActive,
} from "../js/api/routineApi.js";
import { setupModalHandlers } from "../js/routineset/modalManager.js";
import { setupCheckboxToggle } from "../js/routineset/routineCheckBox.js";

const cursor = 0;
const size = 20;

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

  // ✅ 삭제 버튼 이벤트 등록
  const deleteButton = document.querySelector(".delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async () => {
      const confirmDelete = confirm("정말 이 루틴 그룹을 삭제하시겠습니까?");
      if (!confirmDelete) return;

      try {
        await deleteRoutineGroup(numericGroupId);
        alert("✅ 루틴 그룹이 삭제되었습니다.");
        window.location.href = "./home2.html"; // 삭제 후 이동할 경로
      } catch (err) {
        console.error("❌ 루틴 그룹 삭제 실패:", err);
        alert("루틴 그룹 삭제에 실패했습니다.");
      }
    });
  }

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
    const routineData = await fetchRoutineActive(numericGroupId, cursor, size);
    const arr = routineData.routines;
    console.log("루틴데이터", routineData);
    console.log("배열", arr);
    const routineId = arr.map((r) => r.routineId);
    console.log("📦 루틴 ID 목록:", routineId);

    // ✅ 3. 렌더링
    const container = document.getElementById("routine-sets-container");
    await renderRoutineSections(routineId, container);
  } catch (error) {
    console.error("❌ 그룹 정보 또는 루틴 렌더링 실패", error);
  }
});
