// modalManager.js
import {
  createRoutineInGroup,
  fetchRoutineGroup,
  fetchRoutinesInGroup,
} from "../api/routineApi.js";
import { renderRoutineSections } from "./renderRoutineSections.js";

window.dispatchEvent(new Event("routine-added"));
const cycleMap = {
  NO: "없음",
  DAY: "매일",
  WEEK: "매주",
  MONTH: "매월",
  YEAR: "매년",
};

let currentSectionBox = null;
let currentGroupId = null;
const cursor = 0;
const size = 20;

function createRoutineItem(name, routineId = null, options = {}) {
  const {
    cycle = "NO",
    description = "",
    startAt = "-",
    endAt = "-",
    isActive = true,
  } = options;

  const li = document.createElement("li");
  li.className = "routine-item";
  if (routineId) li.dataset.routineId = routineId;

  li.innerHTML = `
    <div class="item-main">
      <div class="item-leftsection">
        <span class="item-name">${name}</span>
        <img class="toggle-frequency" src="../assets/closing.svg" />
      </div>
      <img
        src="../assets/${isActive ? "checked" : "unchecked"}.svg"
        class="checkbox-icon"
        data-checked="${isActive}"
        alt="checkbox"
      />
    </div>
    <div class="item-frequency">
      <div class="freq-content">
        <p>루틴 주기: ${cycleMap[cycle] || "없음"}</p>
        <p>루틴 설명: ${description || "설명이 없습니다."}</p>
        <p>시작 날짜: ${startAt?.slice(2) || "없음"}</p>
        <p>종료 날짜: ${endAt?.slice(2) || "없음"}</p>
      </div>
      <div class="freq-icon">
        <img src="../assets/pencil.svg" alt="edit" class="freq-edit-icon" />
      </div>
    </div>
  `;

  attachToggleEvents(li);
  return li;
}

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

async function fetchGroupItems() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");
  const recommendedItems = await fetchRoutinesInGroup(groupId, cursor, size);
  console.log("모달 아이템", recommendedItems);
}

async function initRoutinePage() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = Number(urlParams.get("groupId"));

    if (!groupId) {
      console.error("❌ groupId 없음");
      return;
    }

    const groupData = await fetchRoutineGroup(groupId);
    currentGroupId = groupId;
    renderRoutineSections(groupData);
  } catch (err) {
    console.error("루틴 그룹 정보 불러오기 실패:", err);
  }
}

export function setupModalHandlers() {
  const modal = document.getElementById("edit-modal");

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-button")) {
      currentSectionBox = e.target.closest(".routine-box");
      const sectionTitle =
        currentSectionBox?.querySelector("h3")?.textContent.trim() ||
        "이름 없음";
      renderRecommendedItems(sectionTitle);
      modal.classList.remove("hidden");
    }

    if (e.target.id === "edit-modal") {
      modal.classList.add("hidden");
      currentSectionBox = null;
    }
  });

  document
    .querySelector(".save-button-modal")
    .addEventListener("click", async () => {
      if (!currentSectionBox || !currentGroupId) return;
      // ✅ [1] 안내 문구 제거
      const emptyMessage = currentSectionBox.querySelector(".empty-message");
      if (emptyMessage) emptyMessage.remove();

      const ul = currentSectionBox.querySelector("ul");
      const checkedBoxes = document.querySelectorAll(
        ".recommend-checkbox:checked"
      );
      const customInput = document
        .querySelector(".custom-add-input")
        .value.trim();

      for (const checkbox of checkedBoxes) {
        try {
          const routine = await createRoutineInGroup(currentGroupId, {
            name: checkbox.value,
            description: checkbox.dataset.description,
            isActive: true,
            cycle: checkbox.dataset.cycle,
            startAt: checkbox.dataset.start,
            endAt: checkbox.dataset.end,
          });
          const li = createRoutineItem(checkbox.value, routine.routineId, {
            cycle: checkbox.dataset.cycle,
            description: checkbox.dataset.description,
            startAt: checkbox.dataset.start,
            endAt: checkbox.dataset.end,
            isActive: true,
          });
          ul.appendChild(li);
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
            startAt: customInput.startAt || "2025-07-13",
            endAt: customInput.endAt || "2025-07-13",
          });
          const li = createRoutineItem(customInput, routine.routineId);
          ul.appendChild(li);
        } catch (err) {
          console.error("직접 입력 루틴 생성 실패:", err);
        }
      }

      document.querySelector(".custom-add-input").value = "";
      modal.classList.add("hidden");
    });

  initRoutinePage();
}

async function renderRecommendedItems(sectionTitle) {
  const leftList = document.querySelector(".modal-list.left");
  const rightList = document.querySelector(".modal-list.right");

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");
  const cursor = 0;
  const size = 20;

  try {
    const recommendedItems = await fetchRoutinesInGroup(groupId, cursor, size);
    leftList.innerHTML = "";
    rightList.innerHTML = "";

    recommendedItems.forEach((item, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <label class="toggle-switch recommend-switch">
          <span class="switch-label">${item.name}</span>
          <input 
            type="checkbox"
            class="recommend-checkbox"
            value="${item.name}"
            data-description="${item.description || ""}"
            data-cycle="${item.cycle || "NO"}"
            data-start="${item.startAt || ""}"
            data-end="${item.endAt || ""}"
          />
          <span class="slider"></span>
        </label>
      `;
      (i % 2 === 0 ? leftList : rightList).appendChild(li);
    });
  } catch (err) {
    console.error("추천 항목 불러오기 실패:", err);
  }

  document.querySelector(".save-button-modal").textContent =
    "이대로 루틴에 저장하기";
}
