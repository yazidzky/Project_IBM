// DOM Elements
const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const totalTasksSpan = document.getElementById("total-tasks");
const completedTasksSpan = document.getElementById("completed-tasks");

// State
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

// Initialize
function init() {
  renderTodos();
  updateStats();

  // Event Listeners
  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTodos();
    });
  });
}

// Add Todo
function addTodo() {
  const text = todoInput.value.trim();
  if (text === "") return;

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  updateStats();

  todoInput.value = "";
  todoInput.focus();
}

// Toggle Todo Completion
function toggleTodo(id) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  saveTodos();
  renderTodos();
  updateStats();
}

// Edit Todo
function editTodo(id) {
  const todo = todos.find((t) => t.id === id);
  const newText = prompt("Edit tugas:", todo.text);

  if (newText !== null && newText.trim() !== "") {
    todos = todos.map((t) => {
      if (t.id === id) {
        return { ...t, text: newText.trim() };
      }
      return t;
    });

    saveTodos();
    renderTodos();
  }
}

// Delete Todo
function deleteTodo(id) {
  if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
  }
}

// Save to Local Storage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Render Todos based on filter
function renderTodos() {
  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
                    <div class="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                        <p>Tidak ada tugas ${getFilterText()}. Tambahkan tugas baru!</p>
                    </div>
                `;
    return;
  }

  todoList.innerHTML = filteredTodos
    .map(
      (todo) => `
                <div class="todo-item ${todo.completed ? "completed" : ""}">
                    <input type="checkbox" class="todo-checkbox" ${
                      todo.completed ? "checked" : ""
                    } 
                           onchange="toggleTodo(${todo.id})">
                    <span class="todo-text">${todo.text}</span>
                    <div class="todo-actions">
                        <button class="edit-btn" onclick="editTodo(${todo.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button class="delete-btn" onclick="deleteTodo(${
                          todo.id
                        })">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `
    )
    .join("");
}

// Get filter text for empty state
function getFilterText() {
  switch (currentFilter) {
    case "active":
      return "yang aktif";
    case "completed":
      return "yang selesai";
    default:
      return "";
  }
}

// Update statistics
function updateStats() {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;

  totalTasksSpan.textContent = `Total: ${total} tugas`;
  completedTasksSpan.textContent = `Selesai: ${completed}`;
}

// Initialize the app
init();
