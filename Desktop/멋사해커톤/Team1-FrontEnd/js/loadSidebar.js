export function loadSidebar(path = "../pages/sidebar.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    fetch(path)
      .then((res) => res.text())
      .then((html) => {
        sidebar.innerHTML = html;
      })
      .catch((err) => {
        console.error("사이드바 로딩 실패:", err);
        sidebar.innerHTML = "<p>사이드바 로딩 실패</p>";
      });
  });
}
