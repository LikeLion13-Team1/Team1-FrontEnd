const token = localStorage.getItem("accessToken");

const today = new Date();
let viewYear = today.getFullYear();
let viewMonth = today.getMonth(); // 0부터 시작: 0 = January
let selectedDate = today.getDate();

function renderCalendar(year, month) {
  const daysContainer = document.getElementById("days");
  const monthLabel = document.getElementById("month-year");
  daysContainer.innerHTML = "";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  monthLabel.textContent = monthNames[month] + " " + year;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  // 이전 달 날짜 표시
  const prevLastDate = new Date(year, month, 0).getDate();
  for (let i = offset - 1; i >= 0; i--) {
    const prevDate = prevLastDate - i;
    const btn = document.createElement("button");
    btn.textContent = prevDate;
    btn.classList.add("outside");
    daysContainer.appendChild(btn);
  }

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
      renderCalendar(viewYear, viewMonth);
      showRoutines(viewYear, viewMonth, selectedDate);
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

// showRoutines를 async 함수로 변경
async function showRoutines(year, month, date) {
  const routineContainer = document.getElementById("routine-container");
  while (routineContainer.firstChild) {
    routineContainer.removeChild(routineContainer.firstChild);
  }

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const baseDate = new Date(year, month, date);
  const datesToShow = [
    new Date(baseDate.getTime() - 1 * 86400000), // 전날
    baseDate, // 선택일
    new Date(baseDate.getTime() + 1 * 86400000), // 다음날
    new Date(baseDate.getTime() + 2 * 86400000), // 다다음날
    new Date(baseDate.getTime() + 3 * 86400000), // 다다다음날
  ];

  for (const dateObj of datesToShow) {
    const displayYear = dateObj.getFullYear();
    const displayMonth = dateObj.getMonth();
    const displayDate = dateObj.getDate();
    const weekday = daysOfWeek[dateObj.getDay()];

    const column = document.createElement("div");
    column.className = "routine-column";

    if (
      displayYear === year &&
      displayMonth === month &&
      displayDate === date
    ) {
      column.classList.add("selected");
    }

    const routineHeader = document.createElement("div");
    routineHeader.className = "routine-date";

    const dateNum = document.createElement("div");
    dateNum.className = "routine-day-number";
    dateNum.textContent = displayDate;

    const weekdayEl = document.createElement("div");
    weekdayEl.className = "routine-day-week";
    weekdayEl.textContent = weekday;

    routineHeader.appendChild(dateNum);
    routineHeader.appendChild(weekdayEl);
    column.appendChild(routineHeader);

    // 비동기 getRoutines 호출
    const Routines = await getRoutines(displayYear, displayMonth, displayDate);

    const stepEl = document.createElement("div");
    stepEl.className = "routine-step";
    column.appendChild(stepEl);

    const hr = document.createElement("hr");
    hr.className = "routine-divider";
    column.appendChild(hr);

    if (!Array.isArray(Routines) || Routines.length === 0) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "routine-box empty";
      emptyEl.textContent = "루틴 없음";
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
  }
}

async function getRoutines(year, month, date) {
  try {
    const response = await fetch(
      `http://13.209.221.182:8080/api/v1/events?start=${year}-${String(
        month + 1
      ).padStart(2, "0")}-${String(date).padStart(2, "0")}&end=${year}-${String(
        month + 1
      ).padStart(2, "0")}-${String(date).padStart(2, "0")}&cursor=0&size=20`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 필요한 경우만
        },
      }
    );

    if (!response.ok) {
      throw new Error("서버 응답 오류");
    }

    const data = await response.json();

    // 실제로 받아온 event 목록에서 routineId들을 이용해 루틴 이름 목록을 병렬로 가져오는 로직 예시
    const routinePromises = data.result.events.map(async (event) => {
      const res = await fetch(
        `http://13.209.221.182:8080/api/v1/routines/${event.routineId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("루틴 상세 응답 오류");
      const routineData = await res.json();
      // routineData 구조에 따라 조절 필요 (예: routineData.result.name)
      return routineData.result.name;
    });

    const routineNames = await Promise.all(routinePromises);
    return routineNames;
  } catch (error) {
    console.error("루틴 로딩 실패:", error);
    return [];
  }
}

// 전달, 전월로 이동
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
// 다음달, 다음 월로 이동
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
