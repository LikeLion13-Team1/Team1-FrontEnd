token = sessionStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
  const routineData = await fetchRoutineData(); // 실제로는 백엔드로 부터 데이터 가져오기 -> 현재 더미 데이터 사용

  // 제목
  document.getElementById("routine-title").textContent = routineData.title;

  const routineContainer = document.getElementById("routine-sets-container");
  routineContainer.innerHTML = ""; // 기존 루틴 초기화

  // 체크 수 계산용 카운터
  let totalTasks = 0;
  let completedTasks = 0;

  // 각 루틴 섹션을 순회하며 렌더링
  routineData.sections.forEach((section) => {
    const sectionBox = document.createElement("div");
    sectionBox.className = "routine-box";

    const itemsHTML = section.items
      .map((item) => {
        totalTasks++;
        if (item.done) completedTasks++;

        return `
          <li>
            <span class="item-name">${item.name}</span>
            <img
              src="../assets/${item.done ? "checked" : "unchecked"}.svg"
              class="checkbox-icon"
              data-checked="${item.done}"
              alt="checkbox"
            />
          </li>
        `;
      })
      .join("");

    sectionBox.innerHTML = `
      <h3>
        <img src="${section.icon}" class="routine-icon" alt="icon" />${section.title}
      </h3>
      <ul>${itemsHTML}</ul>
      <button class="edit-button">수정하기</button>
    `;

    routineContainer.appendChild(sectionBox);
  });

  // 체크된 비율로 설명 문구 업데이트 출력
  const percent = Math.round((completedTasks / totalTasks) * 100);
  document.getElementById("routine-description").innerHTML = `
    벌써 오늘 하루 목표의 ${percent}%에 도달했어요!<br>
    아자아자 멋사님은 해낼 수 있어요 ~
  `;
});

// SVG 체크박스 클릭 시 상태 전환
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox-icon")) {
    const icon = e.target;
    const isChecked = icon.dataset.checked === "true";
    // 이미지와 상태 동기화
    icon.src = `../assets/${isChecked ? "unchecked" : "checked"}.svg`;
    icon.dataset.checked = (!isChecked).toString();
  }
});

// 수정하기 버튼 클릭 시 모달 열기
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-button")) {
    const modal = document.getElementById("edit-modal");
    modal.classList.remove("hidden");
  }

  // ESC or backdrop 클릭 시 닫기
  if (e.target.id === "edit-modal") {
    e.target.classList.add("hidden");
  }
});

// 더미 데이터 (실제로는 백엔드 연동으로 교체 예정)
async function fetchRoutineData() {
  return {
    title: "루틴 2 매일 아침 저녁 정리 루틴 세트",
    description:
      "벌써 오늘 하루 목표의 60%에 도달했어요!\n아자아자 멋사님은 해낼 수 있어요 ~",
    sections: [
      {
        title: "아침",
        icon: "../assets/morning.svg",
        items: [
          { name: "쓰레기 비우기", done: true },
          { name: "물건 제자리로 정리", done: true },
          { name: "책상 먼지 닦기", done: false },
          { name: "마른 걸레로 바닥 쓸기", done: true },
        ],
      },
      {
        title: "저녁",
        icon: "../assets/evening.svg",
        items: [
          { name: "세탁기 확인", done: false },
          { name: "내일 일정 확인", done: false },
          { name: "내일 입을 옷 미리 정리", done: true },
          { name: "욕실/주방 정리", done: false },
          { name: "간단하게 청소기 돌리기", done: false },
        ],
      },
    ],
  };
}
