import { fetchRoutineData } from "./data.js";
import { renderRoutineSections } from "./routineRender.js";
import { setupModalHandlers } from "./modalManager.js";
import { setupCheckboxToggle } from "./routineCheckBox.js";

// 진입점 -> 초기화 및 모듈 실행

document.addEventListener("DOMContentLoaded", async () => {
  const routineData = await fetchRoutineData();
  const container = document.getElementById("routine-sets-container");
  // 루틴 렌더링
  renderRoutineSections(routineData, container);
  // 모달 open/close 로직
  setupModalHandlers();
  // 체크박스 상태 전환 로직
  setupCheckboxToggle();
});
