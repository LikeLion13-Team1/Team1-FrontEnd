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
const helpBtn = document.getElementById("helpBtn");
const helpCloseBtn = helpModal?.querySelector(".close");

if (helpBtn && helpModal && helpCloseBtn) {
  helpBtn.addEventListener("click", () => {
    helpModal.style.display = "block";
  });

  helpCloseBtn.addEventListener("click", () => {
    helpModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === helpModal) {
      helpModal.style.display = "none";
    }
  });
}

// ✅ 비밀번호 수정 모달 열기/닫기
const editModal = document.getElementById("editModal");
const editBtn = document.getElementById("editBtn");
const editCloseBtn = editModal?.querySelector(".close");

if (editBtn && editModal && editCloseBtn) {
  editBtn.addEventListener("click", () => {
    editModal.style.display = "block";
  });

  editCloseBtn.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.style.display = "none";
    }
  });
}

// ✅ 로그아웃 모달 처리
const logoutModal = document.getElementById("logoutModal");
const logoutBtn = document.getElementById("logoutBtn");
const logoutConfirmBtn = logoutModal?.querySelector(".confirm");
const logoutCancelBtn = logoutModal?.querySelector(".cancel");

if (logoutBtn && logoutModal && logoutConfirmBtn && logoutCancelBtn) {
  logoutBtn.addEventListener("click", () => {
    logoutModal.style.display = "block";
  });

  logoutConfirmBtn.addEventListener("click", async () => {
    try {
      const response = await fetchWithAuth(
        "http://13.209.221.182:8080/api/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      console.error("서버 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  });

  logoutCancelBtn.addEventListener("click", () => {
    logoutModal.style.display = "none";
  });
}

// ✅ 탈퇴하기
const deleteModal = document.getElementById("deleteModal");
const deleteBtn = document.getElementById("deleteBtn");
const deleteConfirmBtn = deleteModal?.querySelector(".confirm");
const deleteCancelBtn = deleteModal?.querySelector(".cancel");

if (deleteBtn && deleteModal && deleteConfirmBtn && logoutCancelBtn) {
  deleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "block";
  });

  deleteConfirmBtn.addEventListener("click", async () => {
    try {
      const response = await fetchWithAuth(
        "http://13.209.221.182:8080/api/v1/members/withdrawal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
      console.error("서버 오류:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  });

  deleteCancelBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });
}

//비밀번호 변경

document.getElementById("completeBtn").addEventListener("click", async () => {
  const currentPassword = document
    .getElementById("currentPassword")
    .value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const newPasswordConfirm = document
    .getElementById("newPasswordConfirm")
    .value.trim();

  // 비어 있는 필드 체크
  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    alert("모든 필드를 입력해주세요.");
    return;
  }

  // 새 비밀번호와 확인 불일치
  if (newPassword !== newPasswordConfirm) {
    alert("변경 비밀번호와 확인이 일치하지 않습니다.");
    // 시각적 피드백
    const label = document.querySelector("label[for='newPasswordConfirm']");
    const input = document.getElementById("newPasswordConfirm");
    if (label) label.style.color = "red";
    if (input) input.style.border = "1px solid red";
    return;
  }

  try {
    const response = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/auth/password/reset",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          newPasswordConfirmation: newPasswordConfirm,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.isSuccess) {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      document.getElementById("currentPassword").value = "";
      document.getElementById("newPassword").value = "";
      document.getElementById("newPasswordConfirm").value = "";
    } else {
      alert(`비밀번호 변경 실패: ${data.message}`);
    }
  } catch (error) {
    console.error("서버 오류:", error);
    alert("비밀번호 변경 중 오류가 발생했습니다.");
  }
});
