
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