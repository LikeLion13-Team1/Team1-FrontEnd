import { fetchWithAuth } from "../js/auth/auth.js";

// ✅ 회원 정보 로딩
async function loadUserInfo() {
  try {
    const res = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/members/info"
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

// ✅ 내 루틴 그룹 정보 로딩
async function loadRoutineGroups() {
  try {
    const res = await fetchWithAuth(
      "http://13.209.221.182:8080/api/v1/groups/my?cursor=0&size=3"
    );
    const data = await res.json();

    if (!data.isSuccess) throw new Error("그룹 조회 실패");

    const groups = data.result.groups;
    const liElements = document.querySelectorAll(".routine-list li");

    liElements.forEach((li, idx) => {
      const strong = li.querySelector("strong");
      const span = li.querySelector("span");
      const btn = li.querySelector("button");

      if (idx < groups.length) {
        const group = groups[idx];
        strong.textContent = `루틴 ${idx + 1}`;

        if (group.name) {
          span.textContent = group.name;
          span.classList.remove("empty");
        } else {
          span.textContent = "루틴이 비어있어요.";
          span.classList.add("empty");
        }

        if (btn) {
          btn.addEventListener("click", () => {
            window.location.href = `./routineset.html?groupId=${group.groupId}`;
          });
        }
      } else {
        // 그룹이 없을 경우: 빈 텍스트 처리
        strong.textContent = `루틴 ${idx + 1}`;
        span.textContent = "루틴이 비어있어요.";
        span.classList.add("empty");

        // 버튼 동작 제거 또는 비활성화
        if (btn) {
          btn.disabled = true;
          btn.style.opacity = "0.4"; // 또는 visibility: hidden;
          btn.removeEventListener("click", () => {});
        }
      }
    });
  } catch (err) {
    console.error("❌ 루틴 그룹 정보 불러오기 실패:", err);
  }
}

// ✅ 로그아웃 처리
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn?.addEventListener("click", async () => {
    try {
      const res = await fetchWithAuth(
        "http://13.209.221.182:8080/api/v1/auth/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.isSuccess) {
        alert("로그아웃 완료되었습니다.");
        localStorage.removeItem("accessToken");
        window.location.href = "login.html";
      } else {
        alert(`로그아웃 실패: ${data.message}`);
      }
    } catch (err) {
      console.error("❌ 로그아웃 서버 오류:", err);
      alert("서버와 연결할 수 없습니다.");
    }
  });
}

// ✅ 히스토리 버튼 클릭 시 모달 열기 (예시)
function setupHistoryModal() {
  const openBtn = document.getElementById("openPageBtn");
  openBtn?.addEventListener("click", () => {
    document.getElementById("myModal").style.display = "block";
  });
}

// ✅ 페이지 이동 버튼 처리 (기본 링크가 있는 경우 대비)
function setupDirectLinks() {
  document.querySelectorAll(".go-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.getAttribute("data-url");
      if (url) window.location.href = url;
    });
  });
}

// ✅ 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  loadUserInfo();
  loadRoutineGroups();
  setupLogout();
  setupHistoryModal();
  setupDirectLinks();
});
