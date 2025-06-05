// frontend/js/viewTasks.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("viewTasks.js: DOMContentLoaded");

    if (!isLoggedIn()) {
        console.log("viewTasks.js: User not logged in, redirecting to login.");
        window.location.href = 'login.html';
        return;
    }

    const taskListUL = document.getElementById('taskListActual');
    const loadingMessage = document.getElementById('loadingTasksView');
    const taskCountSpan = document.getElementById('taskCount');
    const messageArea = document.getElementById('viewTasksMessageArea');

    const filterCompletedSelect = document.getElementById('filterCompleted');
    const sortBySelect = document.getElementById('sortBy');
    const sortOrderSelect = document.getElementById('sortOrder');
    const applyFiltersButton = document.getElementById('applyFiltersButtonView');

    // Edit Modal Elements
    const editModal = document.getElementById('editTaskModal');
    const closeEditModalButton = document.getElementById('closeEditModalButton');
    const editTaskForm = document.getElementById('editTaskFormActual');
    const editTaskIdInput = document.getElementById('editTaskId');
    const editTaskTitleInput = document.getElementById('editTaskTitle');
    const editTaskDescriptionInput = document.getElementById('editTaskDescription');
    const editTaskDueDateInput = document.getElementById('editTaskDueDate');
    const editTaskPrioritySelect = document.getElementById('editTaskPriority');
    const editTaskCompletedCheckbox = document.getElementById('editTaskCompleted');
    
    let currentTasksCache = []; // Cache for edit functionality

    async function fetchAndDisplayTasks() {
        console.log("viewTasks.js: Fetching tasks...");
        if (loadingMessage) loadingMessage.style.display = 'block';
        if (taskListUL) taskListUL.innerHTML = '';
        if (messageArea) clearMessage('viewTasksMessageArea');

        try {
            const queryParams = new URLSearchParams();
            if (filterCompletedSelect && filterCompletedSelect.value !== 'all') {
                queryParams.append('isCompleted', filterCompletedSelect.value);
            }
            if (sortBySelect && sortBySelect.value) queryParams.append('sortBy', sortBySelect.value);
            if (sortOrderSelect && sortOrderSelect.value) queryParams.append('sortOrder', sortOrderSelect.value);
            
            const endpoint = `/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            const result = await makeApiRequest(endpoint, 'GET');
            console.log("viewTasks.js: API response for tasks:", result);

            if (loadingMessage) loadingMessage.style.display = 'none';
            currentTasksCache = result.data || [];
            
            if (taskCountSpan) {
                taskCountSpan.textContent = currentTasksCache.length;
                console.log("viewTasks.js: Task count updated to:", currentTasksCache.length);
            }

            if (currentTasksCache.length > 0) {
                currentTasksCache.forEach(task => {
                    const li = document.createElement('li');
                    li.className = task.isCompleted ? 'task-item completed' : 'task-item';
                    li.dataset.taskId = task._id;
                    li.innerHTML = `
                        <div class="task-info">
                            <input type="checkbox" class="task-complete-checkbox" data-task-id="${task._id}" ${task.isCompleted ? 'checked' : ''}>
                            <div class="task-text">
                                <strong class="task-title">${escapeHtml(task.title)}</strong>
                                ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
                                <div class="task-meta">
                                    ${task.dueDate ? `<span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                                    <span>Priority: ${escapeHtml(task.priority)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="task-actions">
                            <button class="button-outline edit-btn" data-task-id="${task._id}">Edit</button>
                            <button class="button delete-btn" data-task-id="${task._id}">Delete</button>
                        </div>
                    `;
                    if (taskListUL) taskListUL.appendChild(li);
                });
                addDynamicTaskActionListeners();
            } else {
                if (taskListUL) taskListUL.innerHTML = '<li class="tasks-feedback-message">No tasks found.</li>';
            }
        } catch (error) {
            console.error('viewTasks.js: Failed to fetch tasks:', error);
            if (loadingMessage) loadingMessage.style.display = 'none';
            if (messageArea) displayMessage('viewTasksMessageArea', error.message || 'Could not load tasks.', 'error');
            if (taskCountSpan) taskCountSpan.textContent = '0';
        }
    }

    function escapeHtml(unsafe) { // Basic HTML escaping
        if (typeof unsafe !== 'string') return '';
        return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function addDynamicTaskActionListeners() {
        document.querySelectorAll('.task-complete-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => toggleCompleteTask(e.target.dataset.taskId, e.target.checked));
        });
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const taskToEdit = currentTasksCache.find(t => t._id === button.dataset.taskId);
                if (taskToEdit) openEditModal(taskToEdit);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => deleteTask(button.dataset.taskId));
        });
    }

    async function toggleCompleteTask(taskId, newCompletedStatus) {
        console.log(`viewTasks.js: Toggling complete for task ${taskId} to ${newCompletedStatus}`);
        if (messageArea) clearMessage('viewTasksMessageArea');
        try {
            await makeApiRequest(`/tasks/${taskId}`, 'PUT', { isCompleted: newCompletedStatus });
            if (messageArea) displayMessage('viewTasksMessageArea', `Task status updated!`, 'success');
            fetchAndDisplayTasks(); // Refresh list
        } catch (error) {
            console.error('viewTasks.js: Failed to update task status:', error);
            if (messageArea) displayMessage('viewTasksMessageArea', error.data?.error || error.message || 'Could not update task status.', 'error');
        }
    }

    async function deleteTask(taskId) {
        console.log(`viewTasks.js: Deleting task ${taskId}`);
        if (messageArea) clearMessage('viewTasksMessageArea');
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await makeApiRequest(`/tasks/${taskId}`, 'DELETE');
            if (messageArea) displayMessage('viewTasksMessageArea', 'Task deleted successfully!', 'success');
            fetchAndDisplayTasks(); // Refresh list
        } catch (error) {
            console.error('viewTasks.js: Failed to delete task:', error);
            if (messageArea) displayMessage('viewTasksMessageArea', error.data?.error || error.message || 'Could not delete task.', 'error');
        }
    }

    // Edit Modal Logic
    function openEditModal(task) {
        if (!editModal || !editTaskForm || !editTaskIdInput || !editTaskTitleInput || !editTaskDescriptionInput || !editTaskDueDateInput || !editTaskPrioritySelect || !editTaskCompletedCheckbox) {
            console.error("viewTasks.js: Edit modal elements missing!"); return;
        }
        console.log("viewTasks.js: Opening edit modal for task:", task);
        editTaskForm.reset();
        editTaskIdInput.value = task._id;
        editTaskTitleInput.value = task.title;
        editTaskDescriptionInput.value = task.description || '';
        editTaskDueDateInput.value = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
        editTaskPrioritySelect.value = task.priority || 'medium';
        editTaskCompletedCheckbox.checked = task.isCompleted;
        editModal.classList.add('active');
        editTaskTitleInput.focus();
    }

    function closeEditModal() {
        if (editModal) {
            console.log("viewTasks.js: Closing edit modal.");
            editModal.classList.remove('active');
        }
    }

    if (closeEditModalButton) closeEditModalButton.addEventListener('click', closeEditModal);
    if (editModal) {
        editModal.addEventListener('click', function(event) {
            if (event.target === editModal) closeEditModal();
        });
    }

    if (editTaskForm) {
        editTaskForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            console.log("viewTasks.js: Edit task form submitted.");
            if (messageArea) clearMessage('viewTasksMessageArea');

            const id = editTaskIdInput.value;
            const title = editTaskTitleInput.value;
            const description = editTaskDescriptionInput.value;
            const dueDateValue = editTaskDueDateInput.value;
            const priority = editTaskPrioritySelect.value;
            const isCompleted = editTaskCompletedCheckbox.checked;

            if (!title.trim()) {
                alert('Task title is required.'); return;
            }

            const updateData = {
                title: title.trim(),
                description: description.trim(),
                priority: priority,
                isCompleted: isCompleted
            };
            if (dueDateValue) updateData.dueDate = dueDateValue;
            else updateData.dueDate = null; // Explicitly set to null if cleared
            
            console.log(`viewTasks.js: Submitting update for task ${id} with data:`, updateData);
            try {
                await makeApiRequest(`/tasks/${id}`, 'PUT', updateData);
                if (messageArea) displayMessage('viewTasksMessageArea', 'Task updated successfully!', 'success');
                closeEditModal();
                fetchAndDisplayTasks();
            } catch (error) {
                console.error('viewTasks.js: Failed to update task:', error);
                alert(error.data?.error || error.message || 'Could not update task.');
            }
        });
    }

    // Event listener for applying filters and sort
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', fetchAndDisplayTasks);
    }
    
    // Initial fetch of tasks
    console.log("viewTasks.js: Initial fetch of tasks on page load.");
    fetchAndDisplayTasks();
});
console.log("viewTasks.js script finished loading.");
