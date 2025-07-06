// 루틴 카드 렌더링
export function renderRoutineSections(data, container) {
  container.innerHTML = "";
  let totalTasks = 0;
  let completedTasks = 0;

  // 각 섹션(오전/오후) 루틴 박스
  data.sections.forEach((section) => {
    const sectionBox = document.createElement("div");
    sectionBox.className = "routine-box";

    const itemsHTML = section.items
      .map((item) => {
        totalTasks++;
        if (item.done) completedTasks++;
        return `
        <li>
          <span class="item-name">${item.name}</span>
          <img src="../assets/${item.done ? "checked" : "unchecked"}.svg"
              class="checkbox-icon"
              data-checked="${item.done}" alt="checkbox" />
        </li>
      `;
      })
      .join("");

    sectionBox.innerHTML = `
      <h3>
        <img src="${section.icon}" class="routine-icon" alt="icon" />
        ${section.title}
      </h3>
      <ul>${itemsHTML}</ul>
      <button class="edit-button">수정하기</button>
    `;

    container.appendChild(sectionBox);
  });

  // 진행률 표시 텍스트
  const percent = Math.round((completedTasks / totalTasks) * 100);
  document.getElementById("routine-description").innerHTML = `
    벌써 오늘 하루 목표의 ${percent}%에 도달했어요!<br>
    아자아자 멋사님은 해낼 수 있어요 ~
  `;
}
