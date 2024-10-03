// Selectors

const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');
const deadlineInput = document.querySelector('.deadline-input');
var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

const apitoken = '76e66990-0128-4c26-a8bb-6c84c033188c';
const collection = 'todo';
async function postData(data) {
    try {
        const response = await fetch(`https://knightly-dolphin-6e73.codehooks.io/${collection}`, {
            method: 'POST',
            headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function getData() {
    try {
        const response = await fetch(`https://knightly-dolphin-6e73.codehooks.io/${collection}`, {
            headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function deleteData(id) {
    try {
        const response = await fetch(`https://knightly-dolphin-6e73.codehooks.io/${collection}/${id}`, {
            method: 'DELETE',
            headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }

}

async function editData(id, data) {
    try {
        const response = await fetch(`https://knightly-dolphin-6e73.codehooks.io/${collection}/${id}`, {
            method: 'PUT',
            headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' }, body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}


// let taskobj = {
//     "id": "1",
//     "taskname": "task1",
//     "starttime": "2019-12-10",
//     "deadline": "2019-12-20",
//     "donetime": "2019-12-31",
//     "description": "this is task1",
//     "notes": "this is notes",
//     "status": "done",
//     "timeline": [
//         {
//             "id": "1",
//             "time": "2023-10-05T14:48:00",
//             "note": "Initial timeline entry",
//             "subtaskname": "subtask1"
//         },
//         {
//             "id": "2",
//             "time": "2023-10-06T09:30:00",
//             "note": "Second timeline entry",
//             "subtaskname": "subtask2"
//         }
//     ]
// }

const emptyTaskObj = {
    taskname: "",
    starttime: "",
    deadline: "",
    description: "",
    notes: "",
    status: "",
    timeline: []
};

function createTask(taskname, deadline, description, notes, status, timeline) {
    return {
        taskname: taskname,
        starttime: new Date().toISOString(),
        deadline: deadline,
        donetime: null,
        description: description,
        notes: notes,
        status: status,
        timeline: timeline
    };
}

function createTimelineEntry(subtaskname, note) {
    return {
        id: null,
        time: null,
        note: note,
        subtaskname: subtaskname
    };
}


toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', eventCheck);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Functions;
async function addToDo(event) {
    // Prevents form from submitting / Prevents form from relaoding;
    event.preventDefault();

    // toDo DIV;
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);

    // Create LI
    if (toDoInput.value === '' || deadlineInput.value === '') {
        alert("KOSONG??");
    }
    else {
        // Adding to local storage;
        let timerInterval;
        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait while the data is being uploaded.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        let result = await postData(createTask(toDoInput.value, deadlineInput.value, "", "", "", [])).then(responseData => {
            Swal.fire({
                icon: 'success',
                title: 'Upload Successful',
                text: 'Your data has been uploaded!'
            }).then(() => {
                // Reload the window after success alert is confirmed
                window.location.reload();
            });
            console.log('Response data:', responseData);
            return responseData;
        }).catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An unexpected error occurred.'
            }).then(() => {
                // Reload the window after success alert is confirmed
                window.location.reload();
            });
        });
    }
}


async function getTodos() {
    //Check: if item/s are there;
    let todos = await getData();

    todos.reverse().forEach(function (todo) {
        // toDo DIV;
        const toDoDiv = document.createElement("div");
        toDoDiv.classList.add("todo", `${savedTheme}-todo`);

        // Create LI
        const newToDo = document.createElement('li');

        newToDo.innerText = todo.taskname;
        newToDo.classList.add('todo-item');
        toDoDiv.setAttribute('id', todo._id);
        toDoDiv.appendChild(newToDo);

        // detail btn;
        const detail = document.createElement('button');
        detail.innerHTML = '<i class="fas fa-info"></i>';
        detail.classList.add("detail-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(detail);

        // check btn;
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add("check-btn", `${savedTheme}-button`);
        todo.status === "Completed" ? toDoDiv.classList.add("completed") : null;
        toDoDiv.appendChild(checked);

        // delete btn;
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add("delete-btn", `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);

        // Append to list;
        toDoList.appendChild(toDoDiv);
        if (toDoDiv.classList.contains("completed")) {
            // Disable all input elements within the parent element
            const inputs = toDoDiv.querySelectorAll('button');
            inputs.forEach(input => {
                input.disabled = true;
            });
        }
    });
}


async function eventCheck(event) {
    const item = event.target;
    // Ensure the event target is a button or an element inside the button
    const button = event.target.closest('button');
    if (!button) {
        console.log('Button not found:', item);
        return;
    }

    // Get the parent element of the clicked button
    const parentElement = button.closest('.todo');
    if (!parentElement) {
        console.log('Parent element not found:', button);
        return;
    }

    // Get the id attribute of the parent element
    const parentId = parentElement.getAttribute('id');
    if (!parentId) {
        console.log('ID not found on parent element:', parentElement);
        return;
    }


    // delete
    if (button.classList.contains('delete-btn')) {
        // Confirmation dialog
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Show loading spinner
                const originalContent = button.innerHTML;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                button.disabled = true;

                try {
                    // Animation
                    item.parentElement.classList.add("fall");

                    // Wait for deleteData to complete
                    await deleteData(parentId);

                    // Remove local todos
                    removeLocalTodos(item.parentElement);

                    // Show success message
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your task has been deleted.",
                        icon: "success"
                    });

                    // Remove item after animation ends
                    item.parentElement.addEventListener('transitionend', function () {
                        item.parentElement.remove();
                    });
                } catch (error) {
                    // Handle any error during deletion
                    console.error('Error deleting task:', error);
                    Swal.fire({
                        title: "Error!",
                        text: "Something went wrong while deleting the task.",
                        icon: "error"
                    });
                } finally {
                    // Restore the original button content after the API call
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }
            }
        });
    }

    // check
    else if (button.classList.contains('check-btn')) {
        // Update status to "Completed"
        const updatedTask = {
            status: "Completed"
        };
        // Fetch the current task data
        let currentTask = await getData();
        let taskToUpdate = currentTask.find(task => task._id === parentId);

        // Update the status to "Completed"
        taskToUpdate.status = "Completed";
        taskToUpdate.donetime = new Date().toISOString();

        // Change button to loading state (spinner)
        const originalContent = button.innerHTML; // Save the original button content
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; // Set loading spinner
        button.disabled = true; // Disable the button to prevent multiple clicks

        try {
            // Save the updated task
            await editData(parentId, taskToUpdate);

            // Toggle completed class
            item.parentElement.classList.toggle("completed");
        } catch (error) {
            console.error('Error updating task:', error);
            // Optionally handle the error (e.g., show a message to the user)
        } finally {
            // Restore the button's original content after the API call is complete
            button.innerHTML = originalContent;
            button.disabled = false; // Re-enable the button
        }
    } else if (button.classList.contains('detail-btn')) {
        window.location.href = `pendingtaskTL.html?id=${parentId}`;
    }
}

// Get the modal


// Get the <span> element that closes the modal


// Function to open the modal
function openModal() {
    modal.style.display = "block";
}

// Close the modal when the user clicks anywhere outside of it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Optional: open modal on a button click (add a button in the body)
// <button onclick="openModal()">Open Modal</button>


// Saving to local storage:
function saveData(todo) {
    //Check: if item/s are there;
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}



function removeLocalTodos(todo) {
    //Check: if item/s are there;
    let todos;
    if (localStorage.getItem('todos') === null) {
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem('todos'));
    }

    const todoIndex = todos.indexOf(todo.children[0].innerText);
    // console.log(todoIndex);
    todos.splice(todoIndex, 1);
    // console.log(todos);
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Change theme function:
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    // Change blinking cursor for darker theme:
    color === 'darker' ?
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    // Change todo color without changing their status (completed or not):
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ?
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Change buttons color according to their type (todo, check or delete):
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            } else if (item === 'detail-btn') {
                button.className = `detail-btn ${color}-button`;
            }

        });
    });
}
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get task and deadline input values
    const todoInput = document.querySelector(".todo-input").value;
    const deadlineInput = document.querySelector(".deadline-input").value;

    if (todoInput === "" || deadlineInput === "") return;  // Make sure both inputs are filled

    // Create new task element
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create list item for task
    const newTodo = document.createElement("li");
    newTodo.innerText = todoInput;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    // Create deadline display
    const deadline = document.createElement("span");
    deadline.innerText = `Deadline: ${deadlineInput}`;
    deadline.classList.add("deadline-item");
    todoDiv.appendChild(deadline);

    // // Detail Button
    const detailkButton = document.createElement("button");
    detailkButton.innerHTML = '<i class="fas fa-info"></i>';
    detailkButton.classList.add("detail-btn");
    todoDiv.appendChild(detailButton);

    // Check Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    // Trash Button
    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    // Append to list
    document.querySelector(".todo-list").appendChild(todoDiv);

    // Clear input
    document.querySelector(".todo-input").value = "";
    document.querySelector(".deadline-input").value = "";
});
