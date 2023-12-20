// Utility function to create DOM elements
function createElement(tag, className, innerText) {
    let element = document.createElement(tag);
    if (className) element.className = className;
    if (innerText) element.innerText = innerText;
    return element;
}

// Load projects from storage
function loadProjects() {
    chrome.storage.local.get(['projects'], function(result) {
        const projects = result.projects || [];
        displayProjects(projects);
    });
}

// Display projects in the popup
function displayProjects(projects) {
    const container = document.getElementById('project-container');
    container.innerHTML = ''; // Clear existing content
    projects.forEach((project, index) => {
        const projectElement = createProjectElement(project, index);
        container.appendChild(projectElement);
    });
}

// Create a DOM element for a project
function createProjectElement(project, index) {
    const div = createElement('div', 'project');
    const title = createElement('h3', null, project.title);
    div.appendChild(title);

    project.tasks.forEach((task, taskIndex) => {
        const taskElement = createTaskElement(task, index, taskIndex);
        div.appendChild(taskElement);
    });

    const addTaskButton = createElement('button', null, 'Add Task');
    addTaskButton.onclick = () => addTaskToProject(index);
    div.appendChild(addTaskButton);

    return div;
}

function createTaskElement(task, projectIndex, taskIndex) {
    const taskDiv = createElement('div', 'form-check');
    const checkbox = createElement('input', 'form-check-input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.id = `task-${projectIndex}-${taskIndex}`;
    checkbox.onchange = () => toggleTaskStatus(projectIndex, taskIndex);

    const label = createElement('label', 'form-check-label', task.title);
    label.htmlFor = checkbox.id;
    if (task.completed) {
        label.classList.add('completed');
    }

    const deleteIcon = createElement('i', 'fas fa-trash-alt');
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.style.color = 'red';
    deleteIcon.style.marginLeft = '10px';
    deleteIcon.onclick = (event) => {
        event.stopPropagation();  // This prevents the checkbox's onclick from firing
        deleteTask(projectIndex, taskIndex);
    };

    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(label);
    taskDiv.appendChild(deleteIcon);

    return taskDiv;
}


function deleteTask(projectIndex, taskIndex) {
    chrome.storage.local.get(['projects'], function(result) {
        const projects = result.projects;
        if (!projects || !projects[projectIndex]) return;

        projects[projectIndex].tasks.splice(taskIndex, 1);
        saveProjects(projects);
        displayProjects(projects);
    });
}


// Toggle the completion status of a task
function toggleTaskStatus(projectIndex, taskIndex) {
    // ... [existing logic to toggle the task and save]
    // Add a class to the label if the task is completed
    const label = document.querySelector(`label[for="task-${projectIndex}-${taskIndex}"]`);
    if (label) {
        if (projects[projectIndex].tasks[taskIndex].completed) {
            label.classList.add('completed');
        } else {
            label.classList.remove('completed');
        }
    }
}
// Add a new project
function addProject() {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    chrome.storage.local.get(['projects'], function(result) {
        const projects = result.projects || [];
        projects.push({ title: projectName, tasks: [] });
        saveProjects(projects);
        displayProjects(projects);
    });
}

// Add a task to a project
function addTaskToProject(projectIndex) {
    const taskName = prompt("Enter task name:");
    if (!taskName) return;

    chrome.storage.local.get(['projects'], function(result) {
        const projects = result.projects;
        if (!projects || !projects[projectIndex]) return;

        projects[projectIndex].tasks.push({ title: taskName, completed: false });
        saveProjects(projects);
        displayProjects(projects);
    });
}

// Toggle the completion status of a task
function toggleTaskStatus(projectIndex, taskIndex) {
    chrome.storage.local.get(['projects'], function(result) {
        const projects = result.projects;
        if (!projects || !projects[projectIndex]) return;

        const task = projects[projectIndex].tasks[taskIndex];
        task.completed = !task.completed;
        saveProjects(projects);
        displayProjects(projects);
    });
}

// Save projects to local storage
function saveProjects(projects) {
    chrome.storage.local.set({projects: projects});
}
// Function to initialize event listeners
function initializeEventListeners() {
    const addProjectButton = document.getElementById('add-project');
    if (addProjectButton) {
        addProjectButton.addEventListener('click', addProject);
    }
}

// Add a new project
function addProject() {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    chrome.storage.local.get(['projects'], function(result) {
        const projects = result.projects || [];
        projects.push({ title: projectName, tasks: [] });
        saveProjects(projects);
        displayProjects(projects);
    });
}
// Initial load of projects
loadProjects();
initializeEventListeners();
