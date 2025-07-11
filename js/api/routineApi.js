import { fetchWithAuth } from "../auth/auth.js";

// ✅ 루틴 그룹 관련 API
// --------------------
// --------------------

// ✅ 루틴 그룹 생성
export async function createRoutineGroup(name) {
  const res = await fetchWithAuth("http://13.209.221.182:8080/api/v1/groups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("루틴 그룹 생성 실패");

  const data = await res.json();
  return data.result.groupId;
}

// ✅ 루틴 그룹 단일 조회
export async function fetchRoutineGroup(groupId) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/groups/${groupId}`
  );
  if (!res.ok) throw new Error("루틴 그룹 조회 실패");

  const data = await res.json();
  return data.result; // { groupId, name }
}

// ✅ 루틴 그룹 수정
export async function updateRoutineGroup(groupId, name) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/groups/${groupId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }
  );

  if (!res.ok) throw new Error("루틴 그룹 수정 실패");

  const data = await res.json();
  return data.result;
}

// ✅ 루틴 그룹 삭제
export async function deleteRoutineGroup(groupId) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/groups/${groupId}`,
    {
      method: "DELETE",
    }
  );

  if (!res.ok) throw new Error("루틴 그룹 삭제 실패");

  return true; // 삭제 성공 시 true 반환
}

// ✨ 특정 그룹의 루틴 목록 조회
export async function fetchRoutinesInGroup(groupId, cursor, size) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/groups/${groupId}/routines/my?cursor=${cursor}&size=${size}`
  );
  const data = await res.json();
  return data.result.routines || [];
}

// ✅ 개별 루틴 관련 API
// --------------------
// --------------------

// ✅ 루틴 생성 (그룹 내)
export async function createRoutineInGroup(groupId, routineData) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/group/${groupId}/routines`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(routineData),
    }
  );

  if (!res.ok) throw new Error("루틴 생성 실패");

  const data = await res.json();
  return data.result; // 생성된 루틴 정보
}

// ✅ 루틴 단일 조회
export async function fetchRoutineById(routineId) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/routines/${routineId}`
  );

  if (!res.ok) throw new Error("루틴 단일 조회 실패");

  const data = await res.json();
  return data.result;
}

// ✅ 그룹의 모든 루틴 + isActive = true
export async function fetchRoutineActive(groupId, cursor, size) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/groups/${groupId}/routines/my/active?cursor=${cursor}&size=${size}`
  );

  if (!res.ok) throw new Error("루틴 Active 조회 실패");

  const data = await res.json();
  return data.result;
}

// ✅ 루틴 활성화
export async function activateRoutine(routineId) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/routines/${routineId}/activate`,
    { method: "PATCH" }
  );

  if (!res.ok) throw new Error("루틴 활성화 실패");

  const data = await res.json();
  return data.result;
}

// ✅ 루틴 비활성화
export async function inactivateRoutine(routineId) {
  const res = await fetchWithAuth(
    `http://13.209.221.182:8080/api/v1/routines/${routineId}/inactivate`,
    { method: "PATCH" }
  );

  if (!res.ok) throw new Error("루틴 비활성화 실패");

  const data = await res.json();
  return data.result;
}

// ✅ 내 루틴 전체 목록 조회
export async function fetchMyRoutines() {
  const res = await fetchWithAuth(
    "http://13.209.221.182:8080/api/v1/routines/my"
  );

  if (!res.ok) throw new Error("루틴 목록 불러오기 실패");

  const data = await res.json();
  console.log(data.result);
  return data.result; // 루틴 배열
}
