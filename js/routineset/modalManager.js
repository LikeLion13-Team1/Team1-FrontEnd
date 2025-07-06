import { recommendedItems } from "./data.js";

// 모달 열기, 항목 렌더링, 저장 처리 로직
let currentSectionBox = null;

// 이벤트 등록 함수
export function setupModalHandlers() {
  const modal = document.getElementById("edit-modal");

  // 수정 버튼 클릭 시
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-button")) {
      currentSectionBox = e.target.closest(".routine-box");
      const sectionTitle = currentSectionBox
        .querySelector("h3")
        .textContent.trim();
      renderRecommendedItems(sectionTitle);
      modal.classList.remove("hidden");
    }

    // 모달 바깥 클릭 시 닫기
    if (e.target.id === "edit-modal") {
      modal.classList.add("hidden");
      currentSectionBox = null;
    }
  });

  // 저장 버튼 클릭 시 선택 항목들 추가
  document.querySelector(".save-button-modal").addEventListener("click", () => {
    if (!currentSectionBox) return;

    const checkedBoxes = document.querySelectorAll(
      ".recommend-checkbox:checked"
    );
    checkedBoxes.forEach((checkbox) => {
      currentSectionBox.querySelector("ul").insertAdjacentHTML(
        "beforeend",
        `
        <li>
          <span class="item-name">${checkbox.value}</span>
          <img src="../assets/unchecked.svg" class="checkbox-icon" data-checked="false" alt="checkbox" />
        </li>
      `
      );
    });

    const customInput = document
      .querySelector(".custom-add-input")
      .value.trim();
    if (customInput) {
      currentSectionBox.querySelector("ul").insertAdjacentHTML(
        "beforeend",
        `
        <li>
          <span class="item-name">${customInput}</span>
          <img src="../assets/unchecked.svg" class="checkbox-icon" data-checked="false" alt="checkbox" />
        </li>
      `
      );
    }

    modal.classList.add("hidden");
    document.querySelector(".custom-add-input").value = "";
  });
}
// 추천 항목 리스트 렌더링 함수
function renderRecommendedItems(sectionTitle) {
  const leftList = document.querySelector(".modal-list.left");
  const rightList = document.querySelector(".modal-list.right");
  leftList.innerHTML = "";
  rightList.innerHTML = "";

  recommendedItems.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" class="recommend-checkbox" value="${item}" />
        ${item}
      </label>
    `;
    (i % 2 === 0 ? leftList : rightList).appendChild(li);
  });

  document.querySelector(
    ".save-button-modal"
  ).textContent = `이대로 '${sectionTitle}'에 저장하기`;
}
