const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },

  {
    id: 11,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 12,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
  },
  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
  },
];
let tasks=[...initialTasks];
//get containers
const todoColumn = document.getElementById("todo-column");
const doingColumn=document.getElementById("doing-column");
const doneColumn=document.getElementById("done-column");
// Modal elements
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".close-modal");
const titleInput = document.getElementById("modalTitle");
const descInput = document.getElementById("modalDes");
const statusSelect = document.getElementById("modalStatus");
const saveBtn = document.getElementById("saveTask");

let currentTask = null;

// Render tasks
function renderTasks() {
  todoColumn.innerHTML = "";
  doingColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  tasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.classList.add("tasks");
    taskEl.textContent = task.title;
    taskEl.addEventListener("click", () => openModal(task));

    if (task.status === "todo") {
      todoColumn.appendChild(taskEl);
    } else if (task.status === "doing") {
      doingColumn.appendChild(taskEl);
    } else if (task.status === "done") {
      doneColumn.appendChild(taskEl);
    }
  });
}
//open modal and populate fields
function openModal(task) {
  currentTask = task;
  titleInput.value = task.title;
  descInput.value = task.description;
  statusSelect.value = task.status;
  modal.classList.remove("hidden");
}
// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  currentTask = null;
});
// Save edits
saveBtn.addEventListener("click", () => {
  if (!currentTask) return;

  currentTask.title = titleInput.value;
  currentTask.description = descInput.value;
  currentTask.status = statusSelect.value;

  modal.classList.add("hidden");
  renderTasks();
});

const deleteBtn = document.getElementById("deleteTask");

deleteBtn.addEventListener("click", () => {
  if (!currentTask) return;

  tasks = tasks.filter(task => task.id !== currentTask.id);
  modal.classList.add("hidden");
  currentTask = null;
  renderTasks();
});


const sidebar = document.querySelector('.Sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');

toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('hidden');
});
// Handle add new task
document.getElementById("add-task-btn").addEventListener("click", () => {
  const newTask = {
    id: Date.now(),
    title: "New Task",
    description: "Task description here...",
    status: "todo",
  };
  tasks.push(newTask);
  renderTasks();
  openModal(newTask);
});
// Initial render
renderTasks();



