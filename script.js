
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