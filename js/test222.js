import { renderRoutineSections } from "../js/routineset/renderRoutineSections.js";
import {
  fetchRoutineGroup,
  fetchRoutinesInGroup,
  deleteRoutineGroup,
  fetchRoutineActive,
  updateRoutineGroup,
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
        window.location.href = "./home2.html";
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
    const routineDes = document.getElementById("routine-description");

    if (titleEl && routineDes) {
      // 초기 그룹 이름 UI 렌더링
      const renderGroupName = (name) => {
        titleEl.innerHTML = `
          <img src="../assets/broomstick.svg" alt="Broomstick Icon" width="22px" height="35px" />
          <p id="group-name-text" style="display:inline-block; margin: 0 8px;">${name}</p>
          <img src="../assets/pencil.svg" id="edit-group-name" alt="Edit" width="18px" height="18px" style="cursor:pointer;" />
        `;
        routineDes.textContent = name;
      };

      renderGroupName(group.name);

      // 연필 버튼 클릭 이벤트 등록
      titleEl.addEventListener("click", async (e) => {
        if (e.target.id !== "edit-group-name") return;

        const existingInput = titleEl.querySelector("input");

        if (existingInput) {
          // 이미 input이 열린 상태 → 저장 시도
          const newName = existingInput.value.trim();
          const oldName = group.name;

          if (newName && newName !== oldName) {
            try {
              await updateRoutineGroup(numericGroupId, newName);
              alert("✅ 그룹 이름이 수정되었습니다.");
              group.name = newName;
              renderGroupName(newName);
            } catch (err) {
              console.error("❌ 수정 실패:", err);
              alert("그룹 이름 수정 실패");
              renderGroupName(oldName);
            }
          } else {
            // 변경 없음 → 복구
            renderGroupName(oldName);
          }
          return;
        }

        // input이 아직 없는 상태 → 생성
        const groupNameText = document.getElementById("group-name-text");
        if (!groupNameText) return;

        const currentName = groupNameText.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentName;
        input.style.fontSize = "24px";
        input.style.width = "150px";
        input.style.margin = "0 8px";
        input.style.padding = "4px";

        groupNameText.replaceWith(input);
        input.focus();

        input.addEventListener("keydown", async (e) => {
          if (e.key === "Enter") {
            document.getElementById("edit-group-name").click(); // 연필 다시 클릭시 저장 로직 재사용
          }

          if (e.key === "Escape") {
            renderGroupName(group.name);
          }
        });
      });
    }

    // ✅ 2. 루틴 목록 불러오기
    const routineData = await fetchRoutineActive(numericGroupId, cursor, size);
    const routineIdList = routineData.routines.map((r) => r.routineId);
    console.log("📦 루틴 ID 목록:", routineIdList);

    // ✅ 3. 렌더링
    const container = document.getElementById("routine-sets-container");
    await renderRoutineSections(routineIdList, container);
  } catch (error) {
    console.error("❌ 그룹 정보 또는 루틴 렌더링 실패", error);
  }
});
