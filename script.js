// Load tasks when page loads
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  let input = document.getElementById("taskInput");
  let taskText = input.value.trim();
  let dueDate = document.getElementById("dueDate").value;
  let priority = document.getElementById("priority").value;

  if (taskText === "") {
    alert("Please enter a task");
    return;
  }

  let tasks = getTasks().sort((a, b) => {
  return new Date(a.date || "9999-12-31") - new Date(b.date || "9999-12-31");
});
  tasks.push({
  text: taskText,
  completed: false,
  date: dueDate,
  priority: priority
});

  localStorage.setItem("tasks", JSON.stringify(tasks));

  input.value = "";
  document.getElementById("dueDate").value = "";
  document.getElementById("priority").value = "High";
  loadTasks();
}

function loadTasks() {
  let pendingList = document.getElementById("pendingList");
let completedList = document.getElementById("completedList");

pendingList.innerHTML = "";
completedList.innerHTML = "";

  let tasks = getTasks();
  let total = tasks.length;
let completed = tasks.filter(task => task.completed).length;
let msg = "";

if (completed === total && total > 0) {
  msg = "🎉 All tasks completed! Great job!";
} else if (completed > 0) {
  msg = "💪 Keep going!";
} else {
  msg = "📌 Start your tasks!";
}

document.getElementById("motivation").innerText = msg;
  let searchText = document.getElementById("searchInput").value.toLowerCase();

  tasks.forEach((task, index) => {
    let today = new Date().toISOString().split("T")[0];

if (task.date === today && !task.completed) {
  alert("⏰ Reminder: " + task.text + " is due today!");
}

  if (!task.text.toLowerCase().includes(searchText)) {
    return;
  }
    let li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
  <span onclick="toggleTask(${index})">
    📌 ${task.text} <br>
    <small>Due: ${task.date || "No date"}</small><br>
    <small class="priority ${task.priority}">${task.priority}</small>
  </span>
  <div class="btn-group">
  <button class="edit-btn" onclick="editTask(${index})">Edit</button>
  <button class="delete-btn" onclick="deleteTask(${index})">❌</button>
</div>
`;

    if (task.completed) {
  completedList.appendChild(li);
} else {
  pendingList.appendChild(li);
}
  });
  document.getElementById("taskCounter").innerText =
  `Total: ${total} | Completed: ${completed}`;
  updateStreak();
}

function deleteTask(index) {
  let tasks = getTasks();
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function toggleTask(index) {
  let tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

function editTask(index) {
  let tasks = getTasks();

  let newTask = prompt("Edit your task:", tasks[index].text);

  if (newTask !== null && newTask.trim() !== "") {
    tasks[index].text = newTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

function clearAll() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    localStorage.removeItem("tasks");
    loadTasks();
  }
}

let progress = total === 0 ? 0 : (completed / total) * 100;

document.getElementById("progressBar").style.width = progress + "%";
document.getElementById("progressText").innerText =
  `Progress: ${Math.round(progress)}%`;

  function startVoice() {
  let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

  recognition.onresult = function(event) {
    let text = event.results[0][0].transcript;
    document.getElementById("taskInput").value = text;
  };

  recognition.start();
}

function updateStreak() {
  let today = new Date().toISOString().split("T")[0];
  let streakData = JSON.parse(localStorage.getItem("streak")) || {
    lastDate: "",
    count: 0
  };

  if (streakData.lastDate !== today) {
    streakData.count += 1;
    streakData.lastDate = today;
  }

  localStorage.setItem("streak", JSON.stringify(streakData));

  document.getElementById("streak").innerText =
    `🔥 Streak: ${streakData.count} days`;
}

function exportTasks() {
  let tasks = getTasks();

  let data = JSON.stringify(tasks, null, 2);

  let blob = new Blob([data], { type: "application/json" });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.href = url;
  a.download = "tasks.json";
  a.click();

  URL.revokeObjectURL(url);
}