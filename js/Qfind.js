//Q에대한 대답 저장
document.addEventListener("DOMContentLoaded", () => {
  const questionKey = document.body.dataset.questionKey;
  if (!questionKey) {
    console.warn("data-question-key가 없음! 저장 스킵함.");
    return;
  }
  console.log(" 현재 질문 키:", questionKey);

  document.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".option-btn").forEach((b) => {
        b.classList.remove("selected");
      });
      e.target.classList.add("selected");

      const answer = e.target.dataset.answer || e.target.textContent.trim();
      const answers = JSON.parse(localStorage.getItem("surveyAnswers")) || {};
      answers[questionKey] = answer;
      localStorage.setItem("surveyAnswers", JSON.stringify(answers));
      console.log(`${questionKey} 저장됨:`, answer);
    });
  });
});
