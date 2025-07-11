import { activateRoutine, inactivateRoutine } from "../api/routineApi.js";

// ✅ 루틴 아이디는 요소에 data-routine-id로 넣기
export function setupCheckboxToggle() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("checkbox-icon")) {
      const icon = e.target;
      const isChecked = icon.dataset.checked === "true";
      const routineId = icon.closest(".routine-item")?.dataset.routineId;

      console.log("루틴아디:", routineId);
      // ✅ 상태 전환
      icon.src = `../assets/${isChecked ? "unchecked" : "checked"}.svg`;
      icon.dataset.checked = (!isChecked).toString();

      // ✅ API 호출
      try {
        if (routineId) {
          if (!isChecked) {
            await activateRoutine(routineId);
          } else {
            await inactivateRoutine(routineId);
          }
        }
      } catch (err) {
        console.error("루틴 상태 변경 실패:", err);
        alert("루틴 상태 변경 중 오류 발생!");
      }
    }
  });
}
