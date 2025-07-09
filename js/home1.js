document.addEventListener("DOMContentLoaded", () => {
  import("../js/loadHeader.js").then(({ loadHeader }) => {
    loadHeader();
  });

  document.querySelector(".signup-btn")?.addEventListener("click", () => {
    window.location.href = "signup.html";
  });

  document.querySelector(".home1-login")?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  document.querySelector(".home1-signup")?.addEventListener("click", () => {
    window.location.href = "signup.html";
  });
});
