// ===============================
// SELECT ELEMENTS
// ===============================

const greeting = document.getElementById("greeting");
const username = document.getElementById("username");

const clock = document.getElementById("clock");
const date = document.getElementById("date");

const timer = document.getElementById("timer");

const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");

const sortTasks =
document.getElementById("sort-tasks");

const savedSort =
    localStorage.getItem("taskSort") || "pending";

sortTasks.value = savedSort;

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");

const linkName = document.getElementById("link-name");
const linkUrl = document.getElementById("link-url");
const addLinkBtn = document.getElementById("add-link");
const linksContainer = document.getElementById("links-container");

const themeToggle = document.getElementById("theme-toggle");

// ===============================
// CLOCK
// ===============================

function updateClock(){

    const now = new Date();

    clock.textContent = now.toLocaleTimeString();

    date.textContent = now.toLocaleDateString(
        "en-US",
        {
            weekday:"long",
            year:"numeric",
            month:"long",
            day:"numeric"
        }
    );

}

updateClock();

setInterval(()=>{

    updateClock();

    updateGreeting();

},1000);

// ===============================
// GREETING
// ===============================

function updateGreeting(){

    const hour = new Date().getHours();

    if(hour < 12){

        greeting.textContent = "Good Morning ☀️";

    }

    else if(hour < 18){

        greeting.textContent = "Good Afternoon 🌤️";

    }

    else{

        greeting.textContent = "Good Evening 🌙";

    }

}

updateGreeting();

// ===============================
// USERNAME
// ===============================

let savedName =
localStorage.getItem("username");

if(savedName){

    username.textContent =
    `Welcome back, ${savedName}! ❤️`;

}

else{

    Swal.fire({

        title:"👋 Welcome!",

        text:"What should we call you?",

        input:"text",

        inputPlaceholder:"Enter your name...",

        confirmButtonText:"Continue",

        confirmButtonColor:"#6A8D73",

        allowOutsideClick:false,

        allowEscapeKey:false,

        inputValidator:(value)=>{

            if(!value){

                return "Please enter your name!";

            }

        }

    }).then((result)=>{

        savedName =
        result.value.trim();

        localStorage.setItem(

            "username",

            savedName

        );

        username.textContent =
        `Welcome back, ${savedName}! ❤️`;

    });

}

// ===============================
// DARK MODE
// ===============================

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add("dark");

    themeToggle.textContent="☀️";

}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

        themeToggle.textContent="☀️";

    }

    else{

        localStorage.setItem("theme","light");

        themeToggle.textContent="🌙";

    }

});

// ===============================
// POMODORO TIMER
// ===============================
const timerDuration =
document.getElementById("timer-duration");

let savedDuration =
Number(localStorage.getItem("pomodoroTime")) || 25;

let totalSeconds =
savedDuration * 60;

let currentSeconds =
totalSeconds;

let timerInterval = null;

function updateTimerDisplay() {

    const minutes = Math.floor(currentSeconds / 60);

    const seconds = currentSeconds % 60;

    timer.textContent =
        `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;

}

updateTimerDisplay();

function startTimer() {

    if(timerInterval !== null) return;

    timerInterval = setInterval(() => {

        if(currentSeconds > 0){

            currentSeconds--;

            updateTimerDisplay();

        }

        else{

            clearInterval(timerInterval);

            timerInterval = null;

            Swal.fire({

                icon:"success",

                title:"Pomodoro Complete! 🎉",

                text:"Great job! Time to take a short break.",

                confirmButtonColor:"#6A8D73"

            });
        }

    },1000);

}

function stopTimer(){

    clearInterval(timerInterval);

    timerInterval = null;

}

function resetTimer(){

    stopTimer();

    currentSeconds = totalSeconds;

    updateTimerDisplay();

}

startBtn.addEventListener("click",startTimer);

stopBtn.addEventListener("click",stopTimer);

resetBtn.addEventListener("click",resetTimer);

timerDuration.value = savedDuration;

timerDuration.addEventListener("change", () => {

    clearInterval(timerInterval);

    timerInterval = null;

    const minutes = Number(timerDuration.value);

    localStorage.setItem(
        "pomodoroTime",
        minutes
    );

    totalSeconds = minutes * 60;

    currentSeconds = totalSeconds;

    updateTimerDisplay();

});

// ===============================
// TODO LIST
// ===============================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];

const prevPage =
document.getElementById("prev-page");

const nextPage =
document.getElementById("next-page");

const pageInfo =
document.getElementById("page-info");

const tasksPerPage = 6;

let currentPage =
Number(
    localStorage.getItem("taskPage")
) || 1;

function saveTasks(){

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}

function renderTasks(){

    taskList.innerHTML = "";

    sortTaskList();

    const totalPages = Math.max(
        1,
        Math.ceil(tasks.length / tasksPerPage)
    );

    if(currentPage > totalPages){

        currentPage = totalPages;

    }

    const start =
        (currentPage - 1) * tasksPerPage;

    const end =
        start + tasksPerPage;

    const visibleTasks =
        tasks.slice(start, end);

    visibleTasks.forEach((task,index)=>{

        const realIndex =
            start + index;

        const li =
            document.createElement("li");

        li.innerHTML = `
        <input
            type="checkbox"
            class="task-check"
            ${task.done ? "checked" : ""}
        >

        <span
            style="
            text-decoration:${task.done ? "line-through":"none"};
            "
        >
            ${task.text}
        </span>

        <div>

            <button class="edit-btn">
                ✏️
            </button>

            <button class="delete-btn">
                🗑️
            </button>

        </div>
        `;

        const checkbox =
            li.querySelector(".task-check");

        checkbox.addEventListener("change",()=>{

            tasks[realIndex].done =
                checkbox.checked;

            saveTasks();

            renderTasks();

        });

        li.querySelector(".delete-btn")
        .addEventListener("click",()=>{

            tasks.splice(realIndex,1);

            saveTasks();

            renderTasks();

        });

        li.querySelector(".edit-btn")
        .addEventListener("click",()=>{

            const newTask =
                prompt(
                    "Edit Task",
                    task.text
                );

            if(newTask){

                tasks[realIndex].text =
                    newTask.trim();

                saveTasks();

                renderTasks();

            }

        });

        taskList.appendChild(li);

    });

    pageInfo.textContent =
    `${currentPage} / ${totalPages}`;

    prevPage.disabled =
    currentPage === 1;

    nextPage.disabled =
    currentPage === totalPages;

    localStorage.setItem(
    "taskPage",
    currentPage
    );

}

addTaskBtn.addEventListener("click",()=>{

    const text =
        taskInput.value.trim();

    if(text==="") return;

    const duplicate =
        tasks.some(task=>

            task.text.toLowerCase() ===
            text.toLowerCase()

        );

    if(duplicate){

        Swal.fire({

            icon:"warning",

            title:"Duplicate Task",

            text:"This task is already in your list.",

            confirmButtonColor:"#6A8D73"

        });

        return;

    }

    tasks.push({

        text,

        done:false

    });

    currentPage =
        Math.ceil(
            tasks.length /
            tasksPerPage
        );

    saveTasks();

    renderTasks();

    taskInput.value="";

});

function sortTaskList(){

    switch(sortTasks.value){

        case "pending":

            tasks.sort((a,b)=>

                Number(a.done) -
                Number(b.done)

            );

            break;

        case "completed":

            tasks.sort((a,b)=>

                Number(b.done) -
                Number(a.done)

            );

            break;

        case "az":

            tasks.sort((a,b)=>

                a.text.localeCompare(b.text)

            );

            break;

        case "za":

            tasks.sort((a,b)=>

                b.text.localeCompare(a.text)

            );

            break;

    }

}

sortTasks.addEventListener("change",()=>{

    localStorage.setItem(

        "taskSort",

        sortTasks.value

    );

    currentPage = 1;

    renderTasks();

});

prevPage.addEventListener("click",()=>{

    if(currentPage > 1){

        currentPage--;

        renderTasks();

    }

});

nextPage.addEventListener("click",()=>{

    const totalPages = Math.max(
        1,
        Math.ceil(
            tasks.length /
            tasksPerPage
        )
    );

    if(currentPage < totalPages){

        currentPage++;

        renderTasks();

    }

});

renderTasks();

// ===============================
// QUICK LINKS
// ===============================

let links =
    JSON.parse(localStorage.getItem("links")) || [];

renderLinks();

function saveLinks(){

    localStorage.setItem(
        "links",
        JSON.stringify(links)
    );

}

function renderLinks(){

    linksContainer.innerHTML="";

    links.forEach((link,index)=>{

        const wrapper=document.createElement("div");

        wrapper.style.display="flex";
        wrapper.style.alignItems="center";
        wrapper.style.gap="10px";

        const button = document.createElement("button");

        button.textContent = link.name;

        button.addEventListener("click", () => {

        window.open(link.url, "_blank");

        });

        const deleteBtn=document.createElement("button");

        deleteBtn.textContent="🗑️";

        deleteBtn.addEventListener("click",()=>{

            links.splice(index,1);

            saveLinks();

            renderLinks();

        });

        wrapper.appendChild(button);

        wrapper.appendChild(deleteBtn);

        linksContainer.appendChild(wrapper);

    });

}

addLinkBtn.addEventListener("click",()=>{

    const name=linkName.value.trim();

    let url = linkUrl.value.trim();

    if (
        !url.startsWith("http://") &&
        !url.startsWith("https://")
    ) {
        url = "https://" + url;
    }

    if(name==="" || url===""){

        Swal.fire({

            icon:"error",

            title:"Incomplete Information",

            text:"Please fill in both the website name and URL.",

            confirmButtonColor:"#6A8D73"

        });

        return;

    }

    links.push({

        name,
        url

    });

    saveLinks();

    renderLinks();

    linkName.value="";

    linkUrl.value="";

});

taskInput.addEventListener("keypress",(event)=>{

    if(event.key==="Enter"){

        addTaskBtn.click();

    }

});

linkUrl.addEventListener("keypress",(event)=>{

    if(event.key==="Enter"){

        addLinkBtn.click();

    }

});

sortTasks.addEventListener("change", () => {

    localStorage.setItem(
        "taskSort",
        sortTasks.value
    );

    sortTaskList();

    saveTasks();

    renderTasks();

});