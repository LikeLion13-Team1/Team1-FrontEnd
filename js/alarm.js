const alarmToken = localStorage.getItem("accessToken");

function checkAlarm(alarm) {
    if (!alarm || alarm.activation !== "Y") return;

    const now = new Date();
    const alarmTime = new Date(alarm.time);

    // 필요한 경우 시간 비교 추가
    // const alarmHour = alarmTime.getHours();
    // const alarmMinute = alarmTime.getMinutes();

    showModal(alarm);
}

function showModal(alarm) {
    document.getElementById("alarm-modal").classList.add("active");

    document.getElementById("alarm-title").innerHTML = alarm.routineName+" 을(를) 수행하지 않았습니다.";
    document.getElementById("alarm-description").innerHTML = alarm.routineDescription;
    document.getElementById("alarm-time").innerHTML = alarm.time.substring(0, 10);

    setTimeout(closeModal, 5000);
}

function closeModal() {
    document.getElementById("alarm-modal").classList.remove("active");
}

const url = 'http://13.209.221.182:8080/api/v1/alarm'; // 단건 알람 반환하는 API

function fetchAndCheckAlarm() {
    console.log("실행완료")
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${alarmToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(alarm => {
        checkAlarm(alarm);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}

// 초기 실행
fetchAndCheckAlarm();

// 15초 간격으로 실행
setInterval(fetchAndCheckAlarm, 15000);
