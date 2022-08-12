const addTaskForm = document.querySelector('#addTaskFrm');

// All Button
const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');
const deleteButton = document.querySelector('#deleteProfile');
const deleteTaskButton = document.querySelector('#deleteTask');

// URL of Task Backend
const url = '/task/tasks';

// Task List
const taskList = document.querySelector('#taskList');
const taskFilterSelect = document.querySelector('#taskFilterSelect');

// Function for rendering tasks for different lists
const renderTasks = (list, tasks, completed) => {
    if(tasks.length === 0 && (completed === true || completed === false)){
        if(completed === true){
            document.querySelector('#completedHeader').removeAttribute('hidden');
        }else{
            document.querySelector('#completedHeader').setAttribute('hidden', '');
        }

        if(completed === false){
            document.querySelector('#activeHeader').removeAttribute('hidden');
        }else{
            document.querySelector('#activeHeader').setAttribute('hidden', '');
        }
    }else if(tasks.length === 0){
        document.querySelector('#ex1-content').setAttribute('hidden', '');
        document.querySelector('#taskFilter').setAttribute('hidden', '');
        document.querySelector('#taskFilter').classList.remove('d-flex');
        document.querySelector('#noTasks').removeAttribute('hidden');
        return;
    }else{
        document.querySelector('#activeHeader').setAttribute('hidden', '');
        document.querySelector('#completedHeader').setAttribute('hidden', '');
        document.querySelector('#ex1-content').removeAttribute('hidden');
        document.querySelector('#taskFilter').removeAttribute('hidden');
        document.querySelector('#taskFilter').classList.add('d-flex');
        document.querySelector('#noTasks').setAttribute('hidden', '');
    }

    let output = '';
    tasks.forEach(task => {
        if(task.completed){
            output += `
            <li data-id=${task._id} class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
                <input id="taskCheck" class="form-check-input ml-1" style="transform: scale(1.25);" type="checkbox" onclick="updateTaskStatus(this);" value="" aria-label="..." checked/>
                <input id="taskInput${task._id}" type="text" class="ml-4 taskText" name="todo" style="text-decoration: line-through;" value="${task.description}" readonly>
                <button class="btn btn-dark ml-auto" onclick="updateTaskDesc(this)" id="editTask">Edit</button>
                <button class="btn btn-danger ml-2" onclick="deleteTask(this)" id="deleteTask">Delete</button>
            </li>
            `;
        }else{
            output += `
            <li data-id=${task._id} class="list-group-item d-flex align-items-center border-0 mb-2 rounded" style="background-color: #f4f6f7;">
                <input id="taskCheck" class="form-check-input ml-1" style="transform: scale(1.25);" type="checkbox" onclick="updateTaskStatus(this);" value="" aria-label="..."/>
                <input id="taskInput${task._id}" type="text" class="ml-4 taskText" name="todo" value="${task.description}" readonly>
                <button class="btn btn-dark ml-auto" onclick="updateTaskDesc(this)" id="editTask">Edit</button>
                <button class="btn btn-danger ml-2" onclick="deleteTask(this)" id="deleteTask">Delete</button>
            </li>
            `;
        }
    });
    list.innerHTML = output;
};

// function for fetching tasks from Backend
const getTasks = (list, completed) => {
    if(completed === true || completed === false){
        fetch(url + '?completed=' + completed, {
            method: 'GET'
        }).then((response) => {
            if(response.ok){
                response.json().then((data) => {
                    renderTasks(list, data, completed);
                });
            }else
                window.location.reload();
        });
    }else{
        fetch(url, {
            method: 'GET'
        }).then((response) => {
            if(response.ok){
                response.json().then((data) => {
                    renderTasks(list, data);
                });
            }else
                window.location.reload();
        });
    }
};

const filterTasks = () => {
    if(taskFilterSelect.value === 'all'){
        return getTasks(taskList);
    }

    if(taskFilterSelect.value === 'active'){
        return getTasks(taskList, false);
    }

    if(taskFilterSelect.value === 'completed'){
        return getTasks(taskList, true);
    }
};

filterTasks();

// Adding Task
addTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const description = document.querySelector('#taskDesc');
    const task = {
        description: description.value,
        completed: false
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => {
        if(response.ok){
            description.value = '';
            filterTasks();
        }else{
            window.location.reload();
        }
    });
});

// Function to update task is either completed or not
const updateTaskStatus = (cb) => {
    const taskId = cb.parentElement.dataset.id;
    const update = {
        completed: cb.checked
    };

    fetch(url + '/' + taskId, {
        method: 'PATCH', 
        body: JSON.stringify(update),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => {
        if(response.status === 200){
            filterTasks();
        }else{
            window.location.reload();
        }
    });
};

// Function to update task description
const updateTaskDesc = (btn) => {
    const taskId = btn.parentElement.dataset.id;
    if(btn.innerHTML === 'Edit'){
        btn.innerHTML = 'Save';
        const taskInput = document.querySelector('#taskInput'+ taskId);
        taskInput.removeAttribute('readonly');
        taskInput.focus();
        taskInput.setSelectionRange(taskInput.value.length, taskInput.value.length);
        taskInput.classList.remove('taskText');
        taskInput.classList.add('taskTextEdit');
    }else{
        btn.innerHTML = 'Edit';
        const taskInput = document.querySelector('#taskInput'+ taskId);
        taskInput.setAttribute('readonly', '');
        taskInput.classList.remove('taskTextEdit');
        taskInput.classList.add('taskText');
        const input = taskInput.value;

        fetch(url + '/' + taskId, {
            method: 'PATCH', 
            body: JSON.stringify({ description: input }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((response) => {
            if(response.status === 200){
                filterTasks();
            }else{
                window.location.reload();
            }
        });
    };
};

// Function to delete a task
const deleteTask = (btn) => {
    const taskId = btn.parentElement.dataset.id;
    
    fetch(url + '/' + taskId, {
        method: 'DELETE'
    }).then((response) => {
        if(response.status === 200){
            filterTasks();
        }else{
            window.location.reload();
        }
    });
}

// Logout function
logOutBtn.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/';
        else{
            window.location.reload();
        }
    });
});

// Logout from All Devices function
logOutAllBtn.addEventListener('click', () => {
    fetch('/logoutall', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/';
        else{
            window.location.reload();
        }
    });
});

// Delete Profile function
deleteButton.addEventListener('click', () => {
    fetch('/deletePro', {
        method: 'DELETE'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/success?task=Deleted';
        else{
            window.location.reload();
        }
    });
});