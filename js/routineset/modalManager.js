import { recommendedItems } from "./data.js";
import { createRoutineInGroup, fetchRoutineGroup } from "../api/routineApi.js";
import { renderRoutineSections } from "./renderRoutineSections.js";

let currentSectionBox = null;
let currentGroupId = null;

async function initRoutinePage() {
  try {
    // URL에서 groupId 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = Number(urlParams.get("groupId"));

    if (!groupId) {
      console.error("❌ groupId 없음");
      return;
    }

    const groupData = await fetchRoutineGroup(groupId);
    currentGroupId = groupId; // ✔ groupId 저장
    renderRoutineSections(groupData); // 루틴 UI 렌더링 함수
  } catch (err) {
    console.error("루틴 그룹 정보 불러오기 실패:", err);
  }
}

// ✅ 루틴 아이템 DOM 생성 함수
function createRoutineItem(name, routineId = null) {
  const li = document.createElement("li");
  li.className = "routine-item";

  if (routineId) {
    li.dataset.routineId = routineId;
  }

  li.innerHTML = `
    <div class="item-main">
      <div class="item-leftsection">
        <span class="item-name">${name}</span>
        <img class="toggle-frequency" src="../assets/closing.svg" />
      </div>
      <img src="../assets/unchecked.svg" class="checkbox-icon" data-checked="false" alt="checkbox" />
    </div>
    <div class="item-frequency">주기: 매일</div>
  `;
  return li;
}

// ✅ 주기 토글 기능 연결 함수
function attachToggleEvents(item) {
  const btn = item.querySelector(".toggle-frequency");
  const freq = item.querySelector(".item-frequency");

  // 버튼 클릭 시 주기 표시 on/off
  btn?.addEventListener("click", (e) => {
    e.stopPropagation();
    freq.classList.toggle("show");
    btn.classList.toggle("rotated");
  });

  // 전체 item 클릭 시도 주기 표시 on/off + 체크박스는 제외
  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("checkbox-icon")) return;
    freq.classList.toggle("show");
    btn.classList.toggle("rotated");
  });
}

// ✅ 추천 항목 렌더링 함수
function renderRecommendedItems(sectionTitle) {
  const leftList = document.querySelector(".modal-list.left");
  const rightList = document.querySelector(".modal-list.right");

  leftList.innerHTML = "";
  rightList.innerHTML = "";

  recommendedItems.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label class="toggle-switch recommend-switch">
        <span class="switch-label">${item}</span>
        <input type="checkbox" class="recommend-checkbox" value="${item}" />
        <span class="slider"></span>
      </label>
    `;
    (i % 2 === 0 ? leftList : rightList).appendChild(li);
  });

  // 저장 버튼 텍스트 변경
  document.querySelector(
    ".save-button-modal"
  ).textContent = `이대로 '${sectionTitle}'에 저장하기`;
}

// ✅ 모달 관련 이벤트 핸들러 등록 함수
export function setupModalHandlers() {
  const modal = document.getElementById("edit-modal");

  // 전체 클릭 이벤트 (수정 버튼 or 모달 배경)
  document.addEventListener("click", (e) => {
    // 수정 버튼 클릭 시
    if (e.target.classList.contains("edit-button")) {
      currentSectionBox = e.target.closest(".routine-box");

      const sectionTitle =
        currentSectionBox?.querySelector("h3")?.textContent.trim() ||
        "이름 없음";
      renderRecommendedItems(sectionTitle);
      modal.classList.remove("hidden");
    }

    // 모달 배경 클릭 시 닫기
    if (e.target.id === "edit-modal") {
      modal.classList.add("hidden");
      currentSectionBox = null;
    }
  });

  // ✅ 저장 버튼 클릭 시 루틴 추가
  document
    .querySelector(".save-button-modal")
    .addEventListener("click", async () => {
      if (!currentSectionBox || !currentGroupId) return;

      const ul = currentSectionBox.querySelector("ul");
      const checkedBoxes = document.querySelectorAll(
        ".recommend-checkbox:checked"
      );
      const customInput = document
        .querySelector(".custom-add-input")
        .value.trim();

      const today = new Date().toISOString().split("T")[0];

      for (const checkbox of checkedBoxes) {
        try {
          const routine = await createRoutineInGroup(currentGroupId, {
            name: checkbox.value,
            description: "사용자 추가 루틴",
            isActive: true,
            cycle: "NO",
            startAt: today,
            endAt: today,
          });
          const li = createRoutineItem(checkbox.value, routine.routineId);
          ul.appendChild(li);
          attachToggleEvents(li);
        } catch (err) {
          console.error("추천 루틴 생성 실패:", err);
        }
      }

      if (customInput) {
        try {
          const routine = await createRoutineInGroup(currentGroupId, {
            name: customInput,
            description: "사용자 추가 루틴",
            isActive: true,
            cycle: "NO",
            startAt: today,
            endAt: today,
          });
          const li = createRoutineItem(customInput, routine.routineId);
          ul.appendChild(li);
          attachToggleEvents(li);
        } catch (err) {
          console.error("직접 입력 루틴 생성 실패:", err);
        }
      }

      document.querySelector(".custom-add-input").value = "";
      modal.classList.add("hidden");
      initRoutinePage();
    });
  initRoutinePage();
}
