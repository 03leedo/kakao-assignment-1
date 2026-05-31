const todoForm = document.querySelector("#todoForm");
const todoInput = document.querySelector("#todoInput");
const todoList = document.querySelector("#todoList");
const message = document.querySelector("#message");
const filterButtons = document.querySelectorAll(".filter-button");
const selectedDateText = document.querySelector("#selectedDateText");
const weekRangeText = document.querySelector("#weekRangeText");
const weekView = document.querySelector("#weekView");
const prevWeekButton = document.querySelector("#prevWeekButton");
const nextWeekButton = document.querySelector("#nextWeekButton");
const TODO_STORAGE_KEY = "vanilla-todos";

let todos = loadTodosFromStorage();
let currentFilter = "all";
let selectedDate = createDateKey(new Date());

// Date 객체를 Todo에 저장하기 쉬운 YYYY-MM-DD 형식으로 변환합니다.
function createDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// YYYY-MM-DD 형식의 날짜 문자열을 Date 객체로 변환합니다.
function createDateFromKey(dateKey) {
  const dateParts = dateKey.split("-");
  const year = Number(dateParts[0]);
  const month = Number(dateParts[1]) - 1;
  const day = Number(dateParts[2]);

  return new Date(year, month, day);
}

// 선택된 날짜를 사용자가 읽기 쉬운 형식으로 표시합니다.
function formatDateLabel(dateKey) {
  const date = createDateFromKey(dateKey);

  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long"
  });
}

// 선택된 날짜가 포함된 주의 월요일을 계산합니다.
function getMondayOfWeek(dateKey) {
  const date = createDateFromKey(dateKey);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + mondayOffset);

  return date;
}

// 이번 주 월요일부터 일요일까지의 날짜 목록을 만듭니다.
function getWeekDateKeys() {
  const monday = getMondayOfWeek(selectedDate);
  const weekDateKeys = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    weekDateKeys.push(createDateKey(date));
  }

  return weekDateKeys;
}

// 특정 날짜에 저장된 Todo 개수를 반환합니다.
function getTodoCountByDate(dateKey) {
  return todos.filter(function (todo) {
    return todo.date === dateKey;
  }).length;
}

// 주간 날짜 버튼을 그리고, 오늘과 선택된 날짜를 시각적으로 표시합니다.
function renderWeekView() {
  const todayDateKey = createDateKey(new Date());
  const weekDateKeys = getWeekDateKeys();

  weekView.innerHTML = "";

  weekDateKeys.forEach(function (dateKey) {
    const date = createDateFromKey(dateKey);
    const weekDayButton = document.createElement("button");
    const weekDayName = document.createElement("span");
    const weekDayNumber = document.createElement("span");
    const weekDayCount = document.createElement("span");

    weekDayButton.type = "button";
    weekDayButton.className = "week-day-button";
    weekDayButton.dataset.date = dateKey;
    weekDayButton.setAttribute("aria-pressed", dateKey === selectedDate);

    if (dateKey === selectedDate) {
      weekDayButton.classList.add("selected");
    }

    if (dateKey === todayDateKey) {
      weekDayButton.classList.add("today");
    }

    weekDayName.className = "week-day-name";
    weekDayName.textContent = date.toLocaleDateString("ko-KR", { weekday: "short" });

    weekDayNumber.className = "week-day-number";
    weekDayNumber.textContent = date.getDate();

    weekDayCount.className = "week-day-count";
    weekDayCount.textContent = `${getTodoCountByDate(dateKey)}개`;

    weekDayButton.append(weekDayName, weekDayNumber, weekDayCount);
    weekDayButton.addEventListener("click", function () {
      selectedDate = dateKey;
      showMessage("");
      renderTodos();
    });

    weekView.append(weekDayButton);
  });
}

// 입력값이 비어 있는지 확인하고, 앞뒤 공백을 제거한 텍스트를 반환합니다.
function getTodoText() {
  return todoInput.value.trim();
}

// 사용자에게 보여줄 안내 메시지를 설정합니다.
function showMessage(text) {
  message.textContent = text;
}

// Todo 배열을 JSON 문자열로 변환해 로컬스토리지에 저장합니다.
function saveTodosToStorage() {
  localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

// 로컬스토리지에 저장된 JSON 문자열을 Todo 배열로 복원합니다.
function loadTodosFromStorage() {
  const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

  if (!savedTodos) {
    return [];
  }

  try {
    const parsedTodos = JSON.parse(savedTodos);

    if (!Array.isArray(parsedTodos)) {
      localStorage.removeItem(TODO_STORAGE_KEY);
      return [];
    }

    return parsedTodos;
  } catch (error) {
    localStorage.removeItem(TODO_STORAGE_KEY);
    return [];
  }
}

// 선택된 날짜 텍스트를 화면 상단에 표시합니다.
function updateSelectedDateText() {
  selectedDateText.textContent = formatDateLabel(selectedDate);
}

// 주간 범위(예: 2026-04-27 ~ 2026-05-03)를 네비게이터에 표시합니다.
function updateWeekRangeText() {
  const weekDateKeys = getWeekDateKeys();
  const firstDate = createDateFromKey(weekDateKeys[0]);
  const lastDate = createDateFromKey(weekDateKeys[6]);

  function formatShort(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  weekRangeText.textContent = `${formatShort(firstDate)} ~ ${formatShort(lastDate)}`;
}

// 선택된 날짜와 현재 필터에 맞는 Todo만 반환합니다.
function getFilteredTodos() {
  const selectedDateTodos = todos.filter(function (todo) {
    return todo.date === selectedDate;
  });

  if (currentFilter === "active") {
    return selectedDateTodos.filter(function (todo) {
      return !todo.isCompleted;
    });
  }

  if (currentFilter === "completed") {
    return selectedDateTodos.filter(function (todo) {
      return todo.isCompleted;
    });
  }

  return selectedDateTodos;
}

// 선택된 필터 버튼에 active 클래스를 적용해 현재 탭을 표시합니다.
function updateFilterButtonStyle() {
  filterButtons.forEach(function (button) {
    const buttonFilter = button.dataset.filter;
    const isSelected = buttonFilter === currentFilter;

    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", isSelected);
  });
}

// Todo 항목에서 사용하는 액션 버튼을 공통된 방식으로 생성합니다.
function createActionButton(text, extraClassName, clickHandler) {
  const actionButton = document.createElement("button");
  actionButton.type = "button";
  actionButton.className = extraClassName
    ? `action-button ${extraClassName}`
    : "action-button";
  actionButton.textContent = text;
  actionButton.addEventListener("click", clickHandler);

  return actionButton;
}

// 현재 필터 조건에 맞춰 화면의 Todo 목록을 다시 그립니다.
function renderTodos() {
  todoList.innerHTML = "";
  updateSelectedDateText();
  updateWeekRangeText();
  renderWeekView();

  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach(function (todo) {
    const todoItem = document.createElement("li");
    todoItem.className = "todo-item";

    if (todo.isCompleted) {
      todoItem.classList.add("completed");
    }

    const todoText = document.createElement("span");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const actionContainer = document.createElement("div");
    actionContainer.className = "todo-actions";

    const editButton = createActionButton("수정", "", function () {
      editTodo(todo.id);
    });

    const completeButton = createActionButton(todo.isCompleted ? "취소" : "완료", "", function () {
      toggleTodoCompletion(todo.id);
    });

    const deleteButton = createActionButton("삭제", "delete-button", function () {
      deleteTodo(todo.id);
    });

    actionContainer.append(editButton, completeButton, deleteButton);
    todoItem.append(todoText, actionContainer);
    todoList.append(todoItem);
  });

  updateFilterButtonStyle();
}

// 새 Todo를 생성하고 목록에 추가합니다.
function addTodo(text) {
  const newTodo = {
    id: Date.now(),
    text: text,
    date: selectedDate,
    isCompleted: false
  };

  todos.push(newTodo);
  saveTodosToStorage();
  renderTodos();
}

// 주차 이동 버튼을 누르면 선택된 날짜를 7일씩 변경합니다.
function moveSelectedWeek(dayAmount) {
  const date = createDateFromKey(selectedDate);
  date.setDate(date.getDate() + dayAmount);
  selectedDate = createDateKey(date);

  showMessage("");
  renderTodos();
}

// 선택한 Todo의 내용을 prompt로 수정합니다.
function editTodo(todoId) {
  const selectedTodo = todos.find(function (todo) {
    return todo.id === todoId;
  });

  if (!selectedTodo) {
    return;
  }

  const editedText = prompt("수정할 내용을 입력하세요.", selectedTodo.text);

  if (editedText === null) {
    return;
  }

  const trimmedText = editedText.trim();

  if (trimmedText === "") {
    showMessage("수정할 내용은 비워둘 수 없어요.");
    return;
  }

  selectedTodo.text = trimmedText;
  showMessage("");
  saveTodosToStorage();
  renderTodos();
}

// 선택한 Todo의 완료 상태를 반대로 변경합니다.
function toggleTodoCompletion(todoId) {
  todos = todos.map(function (todo) {
    if (todo.id !== todoId) {
      return todo;
    }

    return {
      id: todo.id,
      text: todo.text,
      date: todo.date,
      isCompleted: !todo.isCompleted
    };
  });

  showMessage("");
  saveTodosToStorage();
  renderTodos();
}

// 선택한 Todo를 목록에서 삭제합니다.
function deleteTodo(todoId) {
  todos = todos.filter(function (todo) {
    return todo.id !== todoId;
  });

  showMessage("");
  saveTodosToStorage();
  renderTodos();
}

// 폼 제출 시 빈 입력을 막고 Todo를 생성합니다.
todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const todoText = getTodoText();

  if (todoText === "") {
    showMessage("할 일을 입력한 뒤 추가해 주세요.");
    return;
  }

  addTodo(todoText);
  todoInput.value = "";
  showMessage("");
});

// 필터 탭 클릭 시 현재 필터 상태를 변경하고 목록을 다시 그립니다.
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;
    showMessage("");
    renderTodos();
  });
});

prevWeekButton.addEventListener("click", function () {
  moveSelectedWeek(-7);
});

nextWeekButton.addEventListener("click", function () {
  moveSelectedWeek(7);
});

renderTodos();
