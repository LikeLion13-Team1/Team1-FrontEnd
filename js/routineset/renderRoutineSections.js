import { fetchRoutineById } from "../api/routineApi.js";

// ✅ 주기 토글 이벤트 핸들러 등록 함수

function attachToggleEvents(item) {
  const btn = item.querySelector(".toggle-frequency");
  const freq = item.querySelector(".item-frequency");

  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    freq.classList.toggle("show");
    btn.classList.toggle("rotated");
  });

  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("checkbox-icon")) return;
    freq.classList.toggle("show");
    btn.classList.toggle("rotated");
  });
}

// ✅ 루틴 섹션 렌더링 함수

export async function renderRoutineSections(routineIds, container) {
  if (!container) {
    console.error("❌ container가 없음");
    return;
  }

  container.innerHTML = "";

  // ✅ 전체 루틴 박스 및 리스트 요소 생성
  const routineBox = document.createElement("div");
  routineBox.className = "routine-box";

  const ul = document.createElement("ul");

  let totalTasks = 0;
  let completedTasks = 0;

  // ✅ 루틴 목록 순회하며 렌더링
  for (const routineId of routineIds) {
    try {
      const routine = await fetchRoutineById(routineId);

      totalTasks++;
      if (routine.isActive) completedTasks++;

      const li = document.createElement("li");
      li.className = "routine-item";
      li.dataset.routineId = routine.routineId;

      li.innerHTML = `
        <div class="item-main">
          <div class="item-leftsection">
            <span class="item-name">${routine.name}</span>
            <img class="toggle-frequency" src="../assets/closing.svg" />
          </div>
          <img
            src="../assets/${routine.isActive ? "checked" : "unchecked"}.svg"
            class="checkbox-icon"
            data-checked="${routine.isActive}" 
            alt="checkbox"
          />
        </div>
        <div class="item-frequency">주기: ${routine.cycle}</div>
      `;

      attachToggleEvents(li);
      ul.appendChild(li);
    } catch (err) {
      console.error(`❌ 루틴 ${routineId} 로딩 실패`, err);
    }
  }

  // ✅ 루틴 목록과 수정 버튼 추가
  routineBox.appendChild(ul);

  const editSection = document.createElement("div");
  editSection.className = "edit-section";
  editSection.innerHTML = `<button class="edit-button">수정하기</button>`;
  routineBox.appendChild(editSection);

  // ✅ 최종 결과 container에 추가
  container.appendChild(routineBox);
}
