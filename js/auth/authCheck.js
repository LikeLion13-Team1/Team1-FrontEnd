const token = sessionStorage.getItem("token");
console.log(token);

if (!token) {
  alert("로그인이 필요한 서비스입니다!");
  window.location.href = "/pages/home1.html";
}
