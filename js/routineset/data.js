export const recommendedItems = [
  "창틀 청소",
  "이불정리",
  "쓰레기 비우기",
  "물건 제자리로 정리",
  "식탁, 싱크대 닦기",
  "세탁기 확인",
  "내일 일정 확인",
  "욕실/주방 정리",
  "문 손잡이 닦기",
  "냉장고 정리하기",
  "입을 옷 미리 정리",
  "청소기 돌리기",
  "가스레인지 닦기",
  "책상 먼지 닦기",
  "걸레로 바닥 닦기",
  "창문 열고 환기",
  "화분 물주기",
  "택배 개봉 후 정리",
];
// 더미 데이터 및 추천 항목 정의

export async function fetchRoutineData() {
  return {
    title: "루틴 2 매일 아침 저녁 정리 루틴 세트",
    sections: [
      {
        title: "아침",
        icon: "../assets/morning.svg",
        items: [
          { name: "쓰레기 비우기", done: true },
          { name: "물건 제자리로 정리", done: true },
          { name: "책상 먼지 닦기", done: false },
          { name: "마른 걸레로 바닥 쓸기", done: true },
        ],
      },
      {
        title: "저녁",
        icon: "../assets/evening.svg",
        items: [
          { name: "세탁기 확인", done: false },
          { name: "내일 일정 확인", done: false },
          { name: "내일 입을 옷 미리 정리", done: true },
          { name: "욕실/주방 정리", done: false },
          { name: "간단하게 청소기 돌리기", done: false },
        ],
      },
    ],
  };
}
