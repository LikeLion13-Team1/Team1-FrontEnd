import { fetchWithAuth } from "../js/auth/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".openPageBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = document.getElementById("myModal");
      if (modal) {
        modal.style.display = "block";
      }
    });
  });
});

// ✅ 회원정보 불러오기
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/members/info"
    ); // Authorization은 fetchWithAuth가 처리

    if (!response.ok) throw new Error("회원 정보 불러오기 실패");

    const data = await response.json();
    const { username, email, createdAt } = data.result;

    document.getElementById("nickname").textContent = username;
    document.getElementById("email").textContent = email;

    if (createdAt) {
      const joinDate = new Date(createdAt);
      const today = new Date();
      const diffDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
      document.getElementById("joindays").textContent = `${diffDays}일 째`;
    }
  } catch (error) {
    console.error("유저 정보를 불러오는 중 오류 발생:", error);
  }
});

// ✅ 루틴 페이지 연결
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".go-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const targetUrl = button.getAttribute("data-url");
      if (targetUrl) window.location.href = targetUrl;
    });
  });
});

// ✅ 히스토리 날짜 자동 채우기
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const historyItems = document.querySelectorAll(".history-list li");

  historyItems.forEach((item, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const dateLabel = item.querySelector(".history-date");
    if (dateLabel) {
      dateLabel.textContent = `${mm}월 ${dd}일`;
    }
  });
});

// ✅ 히스토리 버튼 클릭 시 날짜 저장하고 페이지 이동
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".openPageBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dateStr = btn.getAttribute("data-date");
      if (!dateStr) return;

      // 날짜 저장
      localStorage.setItem("selectedDate", dateStr);

      // 캘린더 페이지로 이동
      window.location.href = "calendar.html";
    });
  });
});

// ✅ 도움말 모달 열기/닫기
const helpModal = document.getElementById("helpModal");
const helpBtn = document.getElementById("helpBtn"); // help-btn 클래스가 있는 버튼
const closeBtn = helpModal?.querySelector(".close");

if (helpBtn && helpModal && closeBtn) {
  helpBtn.addEventListener("click", () => {
    helpModal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      helpModal.style.display = "none";
    }
  });
}

// ✅ 로그아웃
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    const response = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Authorization은 fetchWithAuth가 처리
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      alert("로그아웃 완료되었습니다.");
      localStorage.removeItem("accessToken");
      window.location.href = "login.html";
    } else {
      alert(`로그아웃 실패: ${data.message}`);
    }
  } catch (error) {
    console.error("서버오류:", error);
    alert("서버와 연결할 수 없습니다.");
  }
});

// ✅ 회원 탈퇴
document.getElementById("deleteBtn").addEventListener("click", async () => {
  const confirmDelete = confirm("정말로 탈퇴하시겠습니까? 복구할 수 없습니다.");
  if (!confirmDelete) return;

  try {
    const response = await fetchWithAuth(
      "http://210.121.215.170:8080/api/v1/members/withdrawal",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      alert("회원 탈퇴가 완료되었습니다.");
      localStorage.removeItem("accessToken");
      window.location.href = "login.html";
    } else {
      alert(`회원 탈퇴 실패: ${data.message}`);
    }
  } catch (error) {
    console.error("서버 오류:", error);
    alert("서버와 연결할 수 없습니다.");
  }
});
