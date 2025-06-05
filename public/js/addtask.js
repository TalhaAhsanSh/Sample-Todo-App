// frontend/js/addTask.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("addTask.js: DOMContentLoaded");

    if (!isLoggedIn()) {
        console.log("addTask.js: User not logged in, redirecting to login.");
        window.location.href = 'login.html';
        return;
    }

    const addTaskForm = document.getElementById('addTaskFormActual');
    const messageArea = document.getElementById('addTaskMessageArea');

    if (addTaskForm) {
        console.log("addTask.js: Attaching listener to addTaskFormActual.");
        addTaskForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            if (messageArea) clearMessage('addTaskMessageArea'); // from main.js

            const titleInput = document.getElementById('taskTitle');
            const descriptionInput = document.getElementById('taskDescription');
            const dueDateInput = document.getElementById('taskDueDate');
            const prioritySelect = document.getElementById('taskPriority');

            if (!titleInput) {
                console.error("addTask.js: Title input not found!");
                if (messageArea) displayMessage('addTaskMessageArea', 'Title field is missing. Please refresh.', 'error');
                return;
            }
            const title = titleInput.value;

            if (!title.trim()) {
                if (messageArea) displayMessage('addTaskMessageArea', 'Task title is required.', 'error');
                return;
            }

            const taskData = {
                title: title.trim(),
                description: descriptionInput ? descriptionInput.value.trim() : '',
                priority: prioritySelect ? prioritySelect.value : 'medium'
            };

            if (dueDateInput && dueDateInput.value) {
                taskData.dueDate = dueDateInput.value;
            }
            
            console.log("addTask.js: Submitting new task data:", taskData);
            try {
                const result = await makeApiRequest('/tasks', 'POST', taskData); // makeApiRequest from main.js
                console.log("addTask.js: API response from create task:", result);
                if (messageArea) displayMessage('addTaskMessageArea', 'Task added successfully! Redirecting to view tasks...', 'success');
                addTaskForm.reset();
                // Redirect to view tasks page after a short delay
                setTimeout(() => {
                    window.location.href = 'viewtask.html';
                }, 1500); 
            } catch (error) {
                console.error('addTask.js: Failed to add task:', error);
                if (messageArea) displayMessage('addTaskMessageArea', error.data?.error || error.message || 'Could not add task.', 'error');
            }
        });
    } else {
        console.error("addTask.js: addTaskFormActual not found!");
    }
});
console.log("addTask.js script finished loading.");
