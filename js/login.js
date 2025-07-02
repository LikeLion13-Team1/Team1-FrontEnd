console.log("Login script loaded");

document.addEventListener("DOMContentLoaded", function () {
  const toSignup1 = document.getElementById("toSignup1");

  toSignup1.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "signup.html";
  });
});
