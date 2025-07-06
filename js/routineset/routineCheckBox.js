// 체크박스 상태 전환 이벤트
export function setupCheckboxToggle() {
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("checkbox-icon")) {
      const icon = e.target;
      const isChecked = icon.dataset.checked === "true";
      icon.src = `../assets/${isChecked ? "unchecked" : "checked"}.svg`;
      icon.dataset.checked = (!isChecked).toString();
    }
  });
}
