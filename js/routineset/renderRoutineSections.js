import { fetchRoutineById, updateRoutineById } from "../api/routineApi.js";
const cycleMap = {
  NO: "없음",
  DAY: "매일",
  WEEK: "매주",
  MONTH: "매월",
  YEAR: "매년",
};

document.addEventListener("click", async (e) => {
  const pencil = e.target.closest(".freq-edit-icon");
  if (!pencil) return;

  const routineItem = pencil.closest(".routine-item");
  const routineId = routineItem?.dataset?.routineId;

  if (!routineId) {
    alert("루틴 ID를 찾을 수 없습니다.");
    return;
  }

  try {
    // ✅ 사용자 입력 받기 (간단하게 prompt로 구현)
    const name = prompt("루틴 이름을 입력하세요:");
    if (!name) return;

    const description = prompt("루틴 설명을 입력하세요:");
    if (description === null) return;

    const startAt = prompt("시작 날짜 (예: 2025-07-11):");
    if (!startAt) return;

    const endAt = prompt("종료 날짜 (예: 2025-07-13):");
    if (!endAt) return;

    const cycle = prompt("주기 (NO, DAY, WEEK, MONTH, YEAR 중 하나):", "NO");

    // ✅ PATCH 요청 보내기
    const updated = await updateRoutineById(routineId, {
      name,
      description,
      startAt,
      endAt,
      cycle: cycle || "NO",
    });

    alert("✅ 루틴이 수정되었습니다.");
    location.reload(); // or renderRoutineSections(...) 호출
  } catch (err) {
    console.error("❌ 루틴 수정 실패:", err);
    alert("루틴 수정 중 오류가 발생했습니다.");
  }
});

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
    if (
      e.target.classList.contains("checkbox-icon") ||
      e.target.classList.contains("freq-edit-icon")
    )
      return;

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

  const existingEmptyMessage = container.querySelector(
    ".routine-box .empty-message"
  );
  if (existingEmptyMessage) {
    existingEmptyMessage.remove();
  }

  // ✅ 전체 루틴 박스 및 리스트 요소 생성
  const routineBox = document.createElement("div");
  routineBox.className = "routine-box";

  const ul = document.createElement("ul");
  ul.className = "routine-list";

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
        <div class="item-frequency">
          <div class="freq-content">
            <p>루틴 주기: ${cycleMap[routine.cycle] || "없음"}</p>
            <p>루틴 설명: ${routine.description || "설명이 없습니다."}</p>
            <p>시작 날짜: ${routine.startAt?.slice(2) || "없음"}</p>
            <p>종료 날짜: ${routine.endAt?.slice(2) || "없음"}</p>
          </div>
          <div class="freq-icon">
            <img src="../assets/pencil.svg" alt="edit" class="freq-edit-icon" />
          </div>
        </div>
      `;

      attachToggleEvents(li);
      ul.appendChild(li);
    } catch (err) {
      console.error(`❌ 루틴 ${routineId} 로딩 실패`, err);
    }
  }
  // ✅ ✨ 루틴이 없을 때 안내 메시지 추가
  if (totalTasks === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "empty-message";
    emptyMessage.textContent = "수정하기 버튼을 통해 추천 루틴을 확인해보세요!";
    routineBox.appendChild(emptyMessage);
  }

  // ✅ 루틴 목록과 수정 버튼 추가
  routineBox.appendChild(ul);

  const editSection = document.createElement("div");
  editSection.className = "edit-section";
  editSection.innerHTML = `<button class="edit-button">수정하기</button>`;
  routineBox.appendChild(editSection);

  // ✅ 최종 결과 container에 추가
  container.appendChild(routineBox);
  // ✅ ✨ 진행률 계산 및 설명 표시
  const routineDes = document.getElementById("routine-description");
  if (routineDes && totalTasks > 0) {
    const percentage = Math.round((completedTasks / totalTasks) * 100);
    const userName = "멋사님"; // 동적으로 바꾸기 가능

    routineDes.innerHTML = `
      벌써 오늘 하루 목표의 <strong>${percentage}%</strong>에 도달했어요!<br />
      아자아자 ${userName}은 해낼 수 있어요 ~
    `;
    console.log("📊 총 루틴:", totalTasks, "완료된 루틴:", completedTasks);
    console.log(
      "📈 계산된 진행률:",
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    );
  }
}
