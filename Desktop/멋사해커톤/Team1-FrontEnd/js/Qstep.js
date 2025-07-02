export function updateQstep(currentStep) {
  const steps = document.querySelectorAll(".step");

  steps.forEach((step) => {
    const stepNum = Number(step.dataset.step);
    step.classList.remove("done", "current");

    if (stepNum < currentStep) {
      step.classList.add("done");
    } else if (stepNum === currentStep) {
      step.classList.add("current");
    }
  });
}
