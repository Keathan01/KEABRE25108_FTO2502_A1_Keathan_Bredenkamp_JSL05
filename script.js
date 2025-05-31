
let tasks = [];
const priorityOrder = { urgent: 1, medium: 2, low: 3 };

const todoColumn = document.getElementById("todo-column");
const doingColumn = document.getElementById("doing-column");
const doneColumn = document.getElementById("done-column");

const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".close-modal");
const titleInput = document.getElementById("modalTitle");
const descInput = document.getElementById("modalDes");
const statusSelect = document.getElementById("modalStatus");
const prioritySelect = document.getElementById("modalPriority");
const saveBtn = document.getElementById("saveTask");
const deleteBtn = document.getElementById("deleteTask");
const modalHeading = modal.querySelector("h2");

const toggleSidebarBtn = document.getElementById("toggle-sidebar-btn");
const sidebar = document.querySelector(".Sidebar");
const sideDisSpan = document.getElementById("side-dis");
const toggleIcon = document.getElementById("toggle-icon");

const addBtnDesktop = document.getElementById("add-task-btn");
const addBtnMobile = document.getElementById("mobile-btn");

const chk = document.getElementById("chk"); // dark mode toggle
const promptMsg = document.getElementById("prompt-msg"); // message container

let currentTask = null; 

async function fetchTasksFromAPI() {
  if (!promptMsg) return; // in case promptMsg doesn't exist
  promptMsg.textContent = "Loading tasks...";
  try {
    const res = await fetch("https://jsl-kanban-api.vercel.app/");
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data = await res.json();
    tasks = data;

    saveToLocalStorage();
    renderTasks();
    promptMsg.textContent = "";
  } catch (err) {
    // fallback to localStorage if available
    const stored = localStorage.getItem("tasks");
    if (stored) {
      tasks = JSON.parse(stored);
      renderTasks();
      promptMsg.textContent = "⚠️ Failed to load from API, loaded local data.";
    } else {
      promptMsg.textContent = `❌ Error loading tasks: ${err.message}`;
    }
  }
} 
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  todoColumn.innerHTML = "";
  doingColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  const todoTasks = tasks.filter(t => t.status === "todo");
  const doingTasks = tasks.filter(t => t.status === "doing");
  const doneTasks = tasks.filter(t => t.status === "done");

  const sortByPriority = (a, b) =>
    (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);

  todoTasks.sort(sortByPriority);
  doingTasks.sort(sortByPriority);
  doneTasks.sort(sortByPriority);

  function renderTaskList(taskList, container) {
    taskList.forEach(task => {
      const taskEl = document.createElement("div");
      taskEl.classList.add("tasks");

      const priorityBadge = document.createElement("span");
      priorityBadge.classList.add("priority-badge");

      if (task.priority === "urgent") priorityBadge.classList.add("priority-urgent");
      else if (task.priority === "medium") priorityBadge.classList.add("priority-medium");
      else priorityBadge.classList.add("priority-low");

      taskEl.textContent = task.title;
      taskEl.appendChild(priorityBadge);

      taskEl.addEventListener("click", () => openModal(task));

      container.appendChild(taskEl);
    });
  }

  renderTaskList(todoTasks, todoColumn);
  renderTaskList(doingTasks, doingColumn);
  renderTaskList(doneTasks, doneColumn);
}
function openModal(task, isNew = false) {
  currentTask = task;

  if (isNew) {
    modalHeading.textContent = "Create Task";
    saveBtn.textContent = "Create";
    deleteBtn.style.display = "none";
  } else {
    modalHeading.textContent = "Edit Task";
    saveBtn.textContent = "Save";
    deleteBtn.style.display = "inline-block";
  }

  titleInput.value = task.title || "";
  descInput.value = task.description || "";
  statusSelect.value = task.status || "todo";
  prioritySelect.value = task.priority || "medium";

  modal.classList.remove("hidden");
}

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  currentTask = null;
  clearModalInputs();
});
function clearModalInputs() {
  titleInput.value = "";
  descInput.value = "";
  statusSelect.value = "todo";
  prioritySelect.value = "medium";
}

saveBtn.addEventListener("click", () => {
  if (!titleInput.value.trim()) {
    alert("Task title cannot be empty.");
    return;
  }

  if (!currentTask) return;

  currentTask.title = titleInput.value.trim();
  currentTask.description = descInput.value.trim();
  currentTask.status = statusSelect.value;
  currentTask.priority = prioritySelect.value;

  const existingIndex = tasks.findIndex(t => t.id === currentTask.id);
  if (existingIndex === -1) {
    tasks.push(currentTask); // Add new task
  } else {
    tasks[existingIndex] = currentTask; // Update existing task
  }

  saveToLocalStorage();
  renderTasks();

  modal.classList.add("hidden");
  currentTask = null;
  clearModalInputs();
});

deleteBtn.addEventListener("click", () => {
  if (!currentTask) return;

  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  tasks = tasks.filter(t => t.id !== currentTask.id);
  saveToLocalStorage();
  renderTasks();

  modal.classList.add("hidden");
  currentTask = null;
  clearModalInputs();
});

function addNewTask() {
  openModal({
    id: Date.now(),
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
  }, true);
}

addBtnDesktop.addEventListener("click", addNewTask);
addBtnMobile.addEventListener("click", addNewTask);
chk.addEventListener("change", () => {
  document.body.classList.toggle('dark');
});

toggleSidebarBtn.addEventListener("click", () => {
  const isVisible = sidebar.classList.toggle("sidebar-visible");
  sidebar.classList.toggle("sidebar-hidden", !isVisible);
  document.body.classList.toggle("sidebar-collapsed", !isVisible);

  if (isVisible) {
    toggleIcon.textContent = "🚫";
    sideDisSpan.textContent = "Hide Sidebar";
    sideDisSpan.style.display = "inline";
  } else {
    toggleIcon.textContent = "👀";
    sideDisSpan.textContent = "";
    sideDisSpan.style.display = "none";
  }
});

// Initialize app
(function init() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
    renderTasks();
  }
  fetchTasksFromAPI();
})();

