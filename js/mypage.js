// ✅ 공통 유틸 및 인증 요청 모듈 가져오기
import { fetchWithAuth } from "../js/auth/auth.js";

// ✅ 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  loadRoutineGroups();
  setupLogout();
  setupWithdraw();
  setupPasswordChange();
  setupHelpModal();
  setupEditModal();
  setupDirectLinks();
  setupHistoryButtons();
});

// ✅ 회원 정보 불러오기
async function loadUserInfo() {
  try {
    const res = await fetchWithAuth(
      "https://www.dlrbdjs.store/api/v1/members/info"
    );
    if (!res.ok) throw new Error("회원 정보 불러오기 실패");
    const data = await res.json();
    const { username, email, createdAt } = data.result;

    document.getElementById("nickname").textContent = username;
    document.getElementById("email").textContent = email;

    if (createdAt) {
      const joinDate = new Date(createdAt);
      const today = new Date();
      const diffDays = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
      document.getElementById("joindays").textContent = `${diffDays}일 째`;
    }
  } catch (err) {
    console.error("❌ 회원 정보 불러오기 실패:", err);
  }
}

// ✅ 루틴 그룹 로딩
async function loadRoutineGroups() {
  try {
    const res = await fetchWithAuth(
      "https://www.dlrbdjs.store/api/v1/groups/my?cursor=0&size=3"
    );
    const data = await res.json();
    if (!data.isSuccess) throw new Error("그룹 조회 실패");

    const groups = data.result.groups;
    const liElements = document.querySelectorAll(".routine-list li");

    liElements.forEach((li, idx) => {
      const strong = li.querySelector("strong");
      const span = li.querySelector("span");
      const btn = li.querySelector("button"); // 버튼이 있을 수도 있고 없을 수도 있음

      strong.textContent = `루틴 ${idx + 1}`;

      if (groups[idx]) {
        const group = groups[idx];
        span.textContent = group.name || "루틴이 비어있어요.";
        span.classList.toggle("empty", !group.name);
        if (btn) {
          btn.onclick = () =>
            (window.location.href = `./routineset.html?groupId=${group.groupId}`);
        }
      } else {
        span.textContent = "루틴이 비어있어요.";
        span.classList.add("empty");
        if (btn) {
          btn.disabled = true;
          btn.style.opacity = "0.4";
        }
      }
    });
  } catch (err) {
    console.error("❌ 루틴 그룹 로딩 실패:", err);
  }
}

// ✅ 로그아웃 모달 처리
function setupLogout() {
  const modal = document.getElementById("logoutModal");
  const btn = document.getElementById("logoutBtn");
  const confirmBtn = modal?.querySelector(".confirm");
  const cancelBtn = modal?.querySelector(".cancel");

  if (btn && modal && confirmBtn && cancelBtn) {
    btn.addEventListener("click", () => (modal.style.display = "block"));
    cancelBtn.addEventListener("click", () => (modal.style.display = "none"));
    confirmBtn.addEventListener("click", async () => {
      try {
        const res = await fetchWithAuth(
          "https://www.dlrbdjs.store/api/v1/auth/logout",
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        if (res.ok && data.isSuccess) {
          alert("로그아웃 완료되었습니다.");
          localStorage.removeItem("accessToken");
          window.location.href = "login.html";
        } else alert(`로그아웃 실패: ${data.message}`);
      } catch (err) {
        console.error("❌ 로그아웃 오류:", err);
        alert("서버와 연결할 수 없습니다.");
      }
    });
  }
}

// ✅ 회원 탈퇴 모달 처리
function setupWithdraw() {
  const modal = document.getElementById("deleteModal");
  const btn = document.getElementById("deleteBtn");
  const confirmBtn = modal?.querySelector(".confirm");
  const cancelBtn = modal?.querySelector(".cancel");

  if (btn && modal && confirmBtn && cancelBtn) {
    btn.addEventListener("click", () => (modal.style.display = "block"));
    cancelBtn.addEventListener("click", () => (modal.style.display = "none"));
    confirmBtn.addEventListener("click", async () => {
      try {
        const res = await fetchWithAuth(
          "https://www.dlrbdjs.store/api/v1/members/withdrawal",
          { method: "POST", headers: { "Content-Type": "application/json" } }
        );
        const data = await res.json();
        if (res.ok && data.isSuccess) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("accessToken");
          window.location.href = "login.html";
        } else alert(`탈퇴 실패: ${data.message}`);
      } catch (err) {
        console.error("❌ 탈퇴 오류:", err);
        alert("서버와 연결할 수 없습니다.");
      }
    });
  }
}

// ✅ 비밀번호 변경 처리
function setupPasswordChange() {
  const btn = document.getElementById("completeBtn");
  btn?.addEventListener("click", async () => {
    const current = document.getElementById("currentPassword").value.trim();
    const next = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("newPasswordConfirm").value.trim();
    if (!current || !next || !confirm)
      return alert("모든 필드를 입력해주세요.");
    if (next !== confirm) {
      alert("변경 비밀번호와 확인이 일치하지 않습니다.");
      const label = document.querySelector("label[for='newPasswordConfirm']");
      const input = document.getElementById("newPasswordConfirm");
      if (label) label.style.color = "red";
      if (input) input.style.border = "1px solid red";
      return;
    }
    try {
      const res = await fetchWithAuth(
        "https://www.dlrbdjs.store/api/v1/auth/password/reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: current,
            newPassword: next,
            newPasswordConfirmation: confirm,
          }),
        }
      );
      const data = await res.json();
      if (res.ok && data.isSuccess) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        document.getElementById("currentPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newPasswordConfirm").value = "";
      } else alert(`비밀번호 변경 실패: ${data.message}`);
    } catch (err) {
      console.error("❌ 비밀번호 변경 오류:", err);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    }
  });
}

// ✅ 도움말 모달
function setupHelpModal() {
  const modal = document.getElementById("helpModal");
  const btn = document.getElementById("helpBtn");
  const close = modal?.querySelector(".close");

  if (modal && btn && close) {
    btn.addEventListener("click", () => (modal.style.display = "block"));
    close.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
}

// ✅ 비밀번호 수정 모달
function setupEditModal() {
  const modal = document.getElementById("editModal");
  const btn = document.getElementById("editBtn");
  const close = modal?.querySelector(".close");

  if (modal && btn && close) {
    btn.addEventListener("click", () => (modal.style.display = "block"));
    close.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
}

// ✅ 페이지 이동
function setupDirectLinks() {
  document.querySelectorAll(".go-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      if (url) window.location.href = url;
    });
  });
}

// ✅ 히스토리 날짜 자동 채우기 및 이동
function setupHistoryButtons() {
  const today = new Date();
  document.querySelectorAll(".history-list li").forEach((item, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    item.querySelector(".history-date").textContent = `${mm}월 ${dd}일`;
  });

  document.querySelectorAll(".openPageBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dateStr = btn.getAttribute("data-date");
      if (dateStr) {
        localStorage.setItem("selectedDate", dateStr);
        window.location.href = "calendar.html";
      }
    });
  });
}
