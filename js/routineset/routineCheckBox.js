import { activateRoutine, inactivateRoutine } from "../api/routineApi.js";

// ✅ 루틴 아이디는 요소에 data-routine-id로 넣기
export function setupCheckboxToggle() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("checkbox-icon")) {
      const icon = e.target;
      const isChecked = icon.dataset.checked === "true";
      const routineId = icon.closest(".routine-item")?.dataset.routineId;

      // ✅ 상태 전환 (UI 즉시 반영)
      icon.src = `../assets/${isChecked ? "unchecked" : "checked"}.svg`;
      icon.dataset.checked = (!isChecked).toString();

      try {
        if (routineId) {
          if (!isChecked) {
            await activateRoutine(routineId);
          } else {
            await inactivateRoutine(routineId);
          }
        }

        // ✅ 진행률만 다시 계산
        const allCheckboxes = document.querySelectorAll(".checkbox-icon");
        const total = allCheckboxes.length;
        const completed = [...allCheckboxes].filter(
          (cb) => cb.dataset.checked === "true"
        ).length;

        const percentage =
          total > 0 ? Math.round((completed / total) * 100) : 0;
        const routineDes = document.getElementById("routine-description");
        if (routineDes) {
          routineDes.innerHTML = `
            벌써 오늘 하루 목표의 <strong>${percentage}%</strong>에 도달했어요!<br />
            아자아자 멋사님은 해낼 수 있어요 ~
          `;
        }
      } catch (err) {
        console.error("루틴 상태 변경 실패:", err);
        alert("루틴 상태 변경 중 오류 발생!");
      }
    }
  });
}
