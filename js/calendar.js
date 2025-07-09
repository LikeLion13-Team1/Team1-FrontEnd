//현재 보여주고 있는 년,월,일
let viewYear = 2025;
let viewMonth = 6;
let selectedDate = 11; // 전역으로 선택된 날짜

function renderCalendar(year, month) {
  // 초기화
  const daysContainer = document.getElementById("days");
  const monthLabel = document.getElementById("month-year");
  daysContainer.innerHTML = "";

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  monthLabel.textContent = monthNames[month] + " " + year;

  //일요일=0 --> 해당 달이 월요일부터 시작하는지 봄
  const firstDay = new Date(year, month, 1).getDay(); //해당 달의 1일이 어떤 요일인지
  const lastDate = new Date(year, month + 1, 0).getDate(); //  마지막 날짜구하기(다음달의 0일 -> 자동적으로 이번달의 마지막일로 됨 )
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  //firstDay=0이면 일요일이 첫째날, 6칸비워둠 : 아니면 firstday-1칸 비워둠

  // 이전 달 날짜 표시
  const prevLastDate = new Date(year, month, 0).getDate();
  for (let i = offset - 1; i >= 0; i--) {
    const prevDate = prevLastDate - i;
    const btn = document.createElement("button");
    btn.textContent = prevDate;
    btn.classList.add("outside");
    daysContainer.appendChild(btn);
  }

  // 현재 달 날짜 렌더링, 선택한 날짜 기준 어제,다음날,다다음날, 다다다음날까지 반영
  const range = [
    selectedDate - 1,
    selectedDate + 1,
    selectedDate + 2,
    selectedDate + 3,
  ];
  for (let date = 1; date <= lastDate; date++) {
    const dayBtn = document.createElement("button");
    dayBtn.textContent = date;

    if (date === selectedDate) {
      dayBtn.classList.add("selected");
    } else if (range.includes(date)) {
      dayBtn.classList.add("range");
    }

    dayBtn.onclick = () => {
      selectedDate = date;
      renderCalendar(viewYear, viewMonth); //캘린더 버튼 표시
      showRoutines(viewYear, viewMonth, selectedDate); //루틴 표시
    };

    daysContainer.appendChild(dayBtn);
  }

  // 다음 달 날짜 채우기
  const totalCells = offset + lastDate;
  const nextDays = 42 - totalCells;
  for (let i = 1; i <= nextDays; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("outside");
    daysContainer.appendChild(btn);
  }
}

//루틴박스 초기화
function showRoutines(year, month, date) {
  const routineContainer = document.getElementById("routine-container");
  while (routineContainer.firstChild) {
    routineContainer.removeChild(routineContainer.firstChild);
  }

  //getDay() --> 요일(숫자)를 요일(문자)로
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // 날짜 기준 배열 구성: 전날, 선택일, 다음날, 다다음날
  const baseDate = new Date(year, month, date);
  const datesToShow = [
    new Date(baseDate.getTime() - 1 * 86400000), // 전날
    baseDate, // 선택일
    new Date(baseDate.getTime() + 1 * 86400000), // 다음날
    new Date(baseDate.getTime() + 2 * 86400000), // 다다음날
    new Date(baseDate.getTime() + 3 * 86400000), //다다다음날
  ];

  datesToShow.forEach((dateObj) => {
    const displayYear = dateObj.getFullYear();
    const displayMonth = dateObj.getMonth();
    const displayDate = dateObj.getDate();
    const weekday = daysOfWeek[dateObj.getDay()];

    //날짜, 요일, 루틴 박스 감싸줌
    const column = document.createElement("div");
    column.className = "routine-column";

    // 선택된 날짜면 강조
    if (
      displayYear === year &&
      displayMonth === month &&
      displayDate === date
    ) {
      column.classList.add("selected");
    }

    const routineHeader = document.createElement("div");
    routineHeader.className = "routine-date"; //날짜+요일을 감쌈

    const dateNum = document.createElement("div");
    dateNum.className = "routine-day-number"; //날짜
    dateNum.textContent = displayDate;

    const weekdayEl = document.createElement("div");
    weekdayEl.className = "routine-day-week"; //요일
    weekdayEl.textContent = weekday;

    routineHeader.appendChild(dateNum);
    routineHeader.appendChild(weekdayEl);
    column.appendChild(routineHeader);

    const Routines = getRoutines(displayYear, displayMonth, displayDate);
    const stepEl = document.createElement("div");
    stepEl.className = "routine-step";
    column.appendChild(stepEl);

    const hr = document.createElement("hr");
    hr.className = "routine-divider";
    column.appendChild(hr);
    // Routines.forEach(...) 전
    if (Routines.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "routine-box empty";
      emptyEl.textContent = "루틴 없음"; // 또는 아이콘/공백 등 원하는 표시
      column.appendChild(emptyEl);
    } else {
      Routines.forEach((task) => {
        const taskEl = document.createElement("div");
        taskEl.className = "routine-box";

        const textEl = document.createElement("p");
        textEl.className = "routine-text";
        textEl.textContent = task;

        const imgEl = document.createElement("img");
        imgEl.className = "routine-img";
        imgEl.src = "../assets/time.png";
        imgEl.alt = "routine image";

        taskEl.appendChild(textEl);
        taskEl.appendChild(imgEl);
        column.appendChild(taskEl);
      });
    }
    routineContainer.appendChild(column);
  });
}
// 예시 루틴 데이터 (테스트용)
function getRoutines(year, month, date) {
  const dummy = {
    10: ["창문 열고 환기", "쓰레기 비우기", "마른 걸레로 바닥 쓰기"],
    11: ["식탁 닦기", "세탁물 확인", "내일 일정 체크", "에어컨 필터 교체하기"],
    12: ["택배 개봉 후 정리", "분리수거날", "화분 물주기", "책상 청소"],
    13: ["창문 열고 환기", "화분 물주기", "냉장고 정리", "계절 옷 정리"],
    14: ["창문 열고 환기", "화분 물주기", "냉장고 정리", "계절 옷 정리"],
    15: ["창문 열고 환기", "쓰레기 비우기", "마른 걸레로 바닥 쓰기"],
    16: ["식탁 닦기", "세탁물 확인", "내일 일정 체크", "에어컨 필터 교체하기"],
    17: ["택배 개봉 후 정리", "분리수거날", "화분 물주기", "책상 청소"],
    18: ["창문 열고 환기", "화분 물주기", "냉장고 정리", "계절 옷 정리"],
    19: ["창문 열고 환기", "화분 물주기", "냉장고 정리", "계절 옷 정리"],
  };
  return dummy[date] || [];
}
//전달, 전월로 이동
function prevMonth() {
  if (viewMonth === 0) {
    viewMonth = 11;
    viewYear--;
  } else {
    viewMonth--;
  }
  renderCalendar(viewYear, viewMonth);
  showRoutines(viewYear, viewMonth, selectedDate);
}
//다음달 , 다음 월로 이동
function nextMonth() {
  if (viewMonth === 11) {
    viewMonth = 0;
    viewYear++;
  } else {
    viewMonth++;
  }
  renderCalendar(viewYear, viewMonth);
  showRoutines(viewYear, viewMonth, selectedDate);
}

// 초기 실행
renderCalendar(viewYear, viewMonth);
showRoutines(viewYear, viewMonth, selectedDate);
