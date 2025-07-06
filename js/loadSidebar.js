export function loadSidebar(path = "../pages/sidebar.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    fetch(path)
      .then((res) => res.text())
      .then((html) => {
        sidebar.innerHTML = html;

        // 로고 부분 클릭 시 home2.html로 이동하도록 이벤트 등록
        const logoArea = sidebar.querySelector("#logo-area");
        if (logoArea) {
          logoArea.style.cursor = "pointer";
          logoArea.addEventListener("click", () => {
            window.location.href = "/pages/home2.html";
          });
        }
      })
      .catch((err) => {
        console.error("사이드바 로딩 실패:", err);
        sidebar.innerHTML = "<p>사이드바 로딩 실패</p>";
      });
  });
}
