# Todo List

## 1. 개요
### 이 프로젝트는 할 일을 관리하는 Todo List 프로젝트 입니다.

## 2. 주요기능설명
- 할 일 추가
- 한 일 체크
- 목록 삭제

## 3. API구조
| 개념        | 설명                                               |
| --------- | ------------------------------------------------ |
| useState  | `text`, `todos` 상태 관리                            |
| useEffect | 컴포넌트 마운트 시 로컬스토리지 불러오기, `todos` 변경 시 저장          |
| 함수형 컴포넌트  | `App` 자체가 함수형 컴포넌트                               |
| 이벤트 핸들러   | `addTodo`, `toggleTodo`, `removeTodo`를 버튼/클릭에 연결 |
| 리스트 렌더링   | `TodoList`에서 `todos.map()`으로 할 일 목록 표시           |
| 조건부 처리    | `text.trim() === ''`일 때 추가 막기, `done` 상태 토글      |
| props     | `TodoForm`과 `TodoList`에 상태와 함수 전달                |
| 로컬스토리지    | `localStorage.getItem`, `setItem`으로 데이터 영구 저장    |


## 4. 기술스택
### 프론트엔드
- React

## 5. 시스템 구조설명
![이미지](https://images.velog.io/images/fromzoo/post/25badbb6-d09e-4061-88d2-0f91b84d528b/reactLogo.jpeg)

## 6. 디렉토리 구조
- src/
  - App.jsx
  - TodoForm.jsx
  - TodoList.jsx

## 7. 회고
오늘은 기존에 알던 리액트 개념 외에도 useReducer 같은 Hook에 대해 알 수 있어 좋았다. useState로 도배되어 있던 나의 코드들을 수정하고 싶어졌다.
다음 프로젝트에서는 해당 개념들을 직접 적용해보아야겠다.

필터링을 통해서 삭제할 대상을 제거하는 아이디어도 인상적이었다.
