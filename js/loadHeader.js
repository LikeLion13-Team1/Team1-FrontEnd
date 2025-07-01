export function loadHeader(path = "../pages/header.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    if (!header) return;

    fetch(path)
      .then((res) => res.text())
      .then((html) => {
        header.innerHTML = html;
      })
      .catch((err) => {
        console.error("헤더 로딩 실패:", err);
        header.innerHTML = "<p>헤더 로딩 실패</p>";
      });
  });
}
