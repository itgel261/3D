const apitoken = '76e66990-0128-4c26-a8bb-6c84c033188c';
const collection = 'todo';
let dropdownToggle = document.querySelectorAll('.dropdown-toggle');
let dropdownMenu = document.querySelectorAll('.dropdown-menu');

const id = getQueryParam('id');
console.log(id);

async function getData(id) {
    try {
        const response = await fetch(`https://knightly-dolphin-6e73.codehooks.io/${collection}/${id}`, {
            method: 'GET',
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
            headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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

async function addData(data) {
    try {
        const response = await fetch(`https://knightly-dolphin-6e73.codehooks.io/${collection}`, {
            method: 'POST',
            headers: { 'x-apikey': apitoken, 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}


function selectOption(option, timelineId, dropdownId) {
    let confirm = Swal.mixin({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!"
    })
    getData(id).then(async data => {
        // Find the timeline entry by its id in the array
        const timelineEntry = data.timeline.find(timeline => timeline.id === timelineId.toString());
        function doUpdate() {
            // Send the updated data back to the server
            editData(id, data).then(updatedResponse => {
                console.log('Updated data:', updatedResponse);
            }).catch(err => console.error('Error updating data:', err)).finally(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Changes Successful',
                    text: 'Your data has been changed'
                }).then(() => {
                    // Reload the window after success alert is confirmed
                    window.location.reload();
                })
            })
        }
        if (timelineEntry) {
            console.log('Selected Option:', timelineEntry);
            // Update the status of the found timeline entry
            if (option === 'Complete') {
                confirm.fire().then((result) => {
                    if (result.isConfirmed) {
                        timelineEntry.donetime = toGMT7(new Date().toISOString());
                        timelineEntry.status = option;
                        doUpdate();
                    }
                })
            } else if (option === 'Hold') {
                const { value: text } = await Swal.fire({
                    input: "textarea",
                    inputLabel: "Reason Hold",
                    inputPlaceholder: "Type your message here...",
                    inputAttributes: {
                        "aria-label": "Type your message here"
                    },
                    showCancelButton: true
                });
                if (text) {
                    confirm.fire().then((result) => {
                        if (result.isConfirmed) {
                            timelineEntry.holdreason = text;
                            timelineEntry.status = option;
                            doUpdate();
                        }
                    })
                } else {
                    return;
                }
            } else if (option === 'Canceled') {
                const { value: text } = await Swal.fire({
                    input: "textarea",
                    inputLabel: "Reason Canceled",
                    inputPlaceholder: "Type your message here...",
                    inputAttributes: {
                        "aria-label": "Type your message here"
                    },
                    showCancelButton: true
                });
                if (text) {
                    confirm.fire().then((result) => {
                        if (result.isConfirmed) {
                            timelineEntry.cancelreason = text;
                            timelineEntry.status = option;
                            doUpdate();
                        }
                    })
                } else {
                    return;
                }
            } else {
                confirm.fire().then((result) => {
                    if (result.isConfirmed) {
                        timelineEntry.status = option;
                        doUpdate();
                    }
                })
            }         

        } else {
            console.error(`Timeline entry with id ${timelineId} not found`);
        }
    });

    // Fetch the full data object from the API

}

function toGMT7(dateString) {
    const date = new Date(dateString);
    const offset = 7 * 60; // GMT+7 in minutes
    const localTime = new Date(date.getTime() + offset * 60 * 1000);
    return localTime;
}

function removeTimelineEntryById(data, id) {
    // Filter out the entry with the specified ID
    data.timeline = data.timeline.filter(entry => entry.id !== id);
    return data;
}

function subActionItem(action, timelineId, dropdownId) {
    console.log('Action:', action, 'Timeline ID:', timelineId);
    // Edit and delete timeline item
    getData(id).then(data => {
        // Find the timeline entry by its id in the array
        const timelineEntry = data.timeline.find(timeline => timeline.id === timelineId.toString());
        if (timelineEntry) {
            if (action === 'edit') {
                // show modal with existing data
                const modal = document.getElementById("modal");
                modal.style.display = "block";
                // Set the modal title and button text for editing
                document.getElementById("modal-title").textContent = "Edit Timeline Entry";
                document.getElementById("submit-button").textContent = "Save Changes";
                document.getElementById('submit-button').onclick = function () {
                    addTimeline('edit', timelineEntry.id);
                }

                // Pre-fill the form with existing data
                document.getElementById("task-notes").value = timelineEntry.note;
                document.getElementById("target-date").value = toGMT7(timelineEntry.deadline).toISOString().split('T')[0];
                document.getElementById("start-date").value = toGMT7(timelineEntry.starttime).toISOString().split('T')[0];
                document.getElementById("start-time").value = toGMT7(timelineEntry.starttime).toISOString().split('T')[1].slice(0, 5);
            } else if (action === 'delete') {
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
                        data = removeTimelineEntryById(data, timelineId.toString());
                        editData(id, data).then(updatedResponse => {
                            console.log('Updated data:', updatedResponse);
                        }).catch(err => console.error('Error updating data:', err));
                        Swal.fire("Deleted!", "Your file has been deleted.", "success").then(() => {
                            location.reload();
                        })
                    }
                });
            }
        } else {
            console.error(`Timeline entry with id ${timelineId} not found`);
        }
    })
}

function toGMT72(dateString, timeString) {
    const date = new Date(`${dateString}T${timeString}:00`);
    const offset = 7 * 60; // GMT+7 in minutes
    const localTime = new Date(date.getTime() + offset * 60 * 1000);
    return localTime.toISOString().slice(0, -1); // Remove the 'Z' at the end
}

function addTimeline(action, timelineEntryId) {
    const taskNotes = document.getElementById("task-notes").value;
    const targetDate = document.getElementById("target-date").value;
    const startDate = document.getElementById("start-date").value;
    const starttime = document.getElementById("start-time").value;
    const indefinite = document.getElementById('indefinite-target-date').value;

    //console.log('Form Values:', { taskNotes, targetDate, startDate, starttime });

    // Fetch the current data object from the API
    getData(id).then(data => {
        // Create a new timeline entry
        const newTimelineEntry = {
            id: Date.now().toString(), // Generate a unique id based on the current timestamp
            note: taskNotes,
            starttime: toGMT72(startDate, starttime),
            deadline: indefinite ? null : toGMT72(targetDate, "00:00"),
            donetime: null,
            status: 'On Going',
            holdreason: null,
            cancelreason: null
        };

        console.log('New Timeline Entry:', newTimelineEntry);

        if (action === 'edit') {
            // Find the timeline entry by its id in the array
            const timelineEntry = data.timeline.find(timeline => timeline.id === timelineEntryId);
            if (timelineEntry) {
                // Update the existing timeline entry
                timelineEntry.note = newTimelineEntry.note;
                timelineEntry.starttime = newTimelineEntry.starttime;
                timelineEntry.deadline = indefinite ? null : newTimelineEntry.deadline;
            } else {
                console.error(`Timeline entry with id ${newTimelineEntry.id} not found`);
            }
        } else if (action === 'add') {
            // Add the new timeline entry to the timeline array
            data.timeline.push(newTimelineEntry);
            Swal.fire({
                title: 'Loading....',
                text: 'Uploading data, please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        // Send the updated data back to the server
        editData(id, data).then(updatedResponse => {
            console.log('Updated data with new timeline entry:', updatedResponse);
            //location.reload();
        }).catch(err => console.error('Error updating data:', err)).finally(() => {
            Swal.fire({
                icon: 'success',
                title: 'Upload Successful',
                text: 'Your data has been uploaded!'
            }).then(() => {
                // Reload the window after success alert is confirmed
                window.location.reload();
            })
        });
    }).catch(err => console.error('Error fetching data:', err));

    // You can handle the task data here, e.g., save it or update the UI

    // Close the modal
    modal.style.display = "none";
    // Clear form fields
    document.getElementById("task-form").reset();
}

// Function to sort the data object by date keys from newest to oldest
function sortDataByDate(data) {
    // Extract and sort the keys (dates)
    const sortedKeys = Object.keys(data).sort((a, b) => {
        const dateA = new Date(a.split('-').reverse().join('-'));
        const dateB = new Date(b.split('-').reverse().join('-'));
        return dateB - dateA; // Sort in descending order
    });

    // Reconstruct the sorted object
    const sortedData = {};
    sortedKeys.forEach(key => {
        sortedData[key] = data[key];
    });

    return sortedData;
}

function groupTimelineEntries(timelineData) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const grouped = {
        Today: [],
        Yesterday: [],
        ByDate: {}
    };

    timelineData.forEach(entry => {
        const entryDate = new Date(entry.starttime);
        if (entryDate.toDateString() === today.toDateString()) {
            grouped.Today.push(entry);
        } else if (entryDate.toDateString() === yesterday.toDateString()) {
            grouped.Yesterday.push(entry);
        } else {
            const dateKey = entryDate.toLocaleDateString('en-GB').split('/').join('-');
            
            if (!grouped.ByDate[dateKey]) {
                grouped.ByDate[dateKey] = [];
            }
            grouped.ByDate[dateKey].push(entry);
            // Sort the entries by date from newest to oldest
            
        }
    });

    const sortedData = sortDataByDate(grouped.ByDate);
    grouped.ByDate = sortedData;

    console.log('Grouped Entries:', grouped);

    return grouped;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('indefinite-target-date').addEventListener('change', function() {
        const targetDateInput = document.getElementById('target-date');
        if (this.checked) {
            targetDateInput.disabled = true;
            targetDateInput.style.backgroundColor = '#e0e0e0';
            targetDateInput.style.color = '#a0a0a0';
        } else {
            targetDateInput.disabled = false;
            targetDateInput.style.backgroundColor = '';
            targetDateInput.style.color = '';
        }
    });
    Swal.fire({
        title: 'Loading....',
        text: 'Loading all data, please wait...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    const title = document.getElementById('title-pendtask');
    const modal = document.getElementById("modal");
    const btn = document.getElementById("add-timeline-btn");
    const span = document.getElementById("close-modal");
    const taskdayContainer = document.getElementById('taskday-Container');
    document.getElementById('submit-button').onclick = function () {
        addTimeline('add');
    }

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    //get data from api by id
    getData(id).then(responseData => {

        const groupedEntries = groupTimelineEntries(responseData.timeline);
        title.innerText += ' ' + responseData.taskname;

        function createSection(title, entries) {
            console.log('title:', title, 'entries:', entries);
            const section = document.createElement('div');
            section.innerHTML = `<h2 class="text-[#111418] text-[25px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5" id="dday"><b>${title}</b></h2>   `;
            var tomorrow = new Date();
            tomorrow.setHours(0, 0, 0, 0);
            title.innerText += ' ' + responseData.taskname;

            entries.forEach(function (entry, i) {
                const entryDiv = document.createElement('div');
                const timeline = entry
                const time = new Date(timeline.starttime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const formattedStartTime = new Date(timeline.starttime).toLocaleDateString('en-GB', {
                    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
                });
                const formattedDeadline = new Date(timeline.deadline).toLocaleDateString('en-GB', {
                    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
                });
                const timeCompleted = timeline.donetime ? new Date(timeline.donetime).toLocaleString('en-GB', {
                    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : '';
                let taskday = `
                <div class="p-4 timelineitem" id=${timeline.id}>
                    <div
                        class="flex items-stretch justify-between gap-4 rounded-xl bg-white p-4" style="border: 1px solid #353535;">
                        <div class="flex flex-[2_2_0px] flex-col gap-4">
                            <i class="fas fa-check-circle self-center" style="display: ${timeline.status === 'Complete' ? 'block' : 'none'};"></i>
                            <div class="flex flex-col gap-1">
                                <p class="text-[#111418] text-base font-bold leading-tight" id="date">${time} - ${formattedStartTime}</p>
                                <p class="text-[#111418] text-base font-bold leading-tight" id="date" style="${tomorrow > new Date(timeline.deadline) && (!timeline.donetime || new Date(timeline.donetime) > new Date(timeline.deadline)) ? 'color: red;' : ''}">Target Date : ${timeline.deadline ? formattedDeadline : 'Indefinitely'}</p>
                                <p class="text-[#637588] text-lg font-normal leading-normal" id="notes" >${timeline.note}</p>
                            </div>
                            <div class="relative inline-block text-left flex">
                                <button
                                ${timeline.status === 'Complete' ? 'disabled' : ''}
                                    class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#f0f2f4] text-[#111418] pr-2 gap-1 text-sm font-medium leading-normal w-fit dropdown-toggle">
                                    <div class="text-[#111418]" data-icon="Check" data-size="18px" data-weight="regular">
                                    </div>
                                    <span class="truncate">${timeline.status}</span>
                                </button>
                                <div class="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden dropdown-menu">
                                    <div class="py-1">
                                        <a href="#" class="flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="selectOption('Complete', ${timeline.id}, ${i})">
                                            Complete
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256" class="ml-auto">
                                                <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                            </svg>
                                        </a>
                                        <a href="#" class="flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="selectOption('On Going', ${timeline.id}, ${i})">
                                            On Going <i class="fas fa-running ml-auto"></i>
                                        </a>
                                        <a href="#" class="flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="selectOption('Canceled', ${timeline.id}, ${i})">
                                            Canceled
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 24 24" class="ml-auto">
                                                <path d="M19 6 6 19m0-13 13 13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
                                            </svg>
                                        </a>
                                        <a href="#" class="flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onclick="selectOption('Hold', ${timeline.id}, ${i})">
                                            Hold <i class="fas fa-hand-paper ml-auto"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="button-group ml-auto" style="display: flex;
                                        justify-content: flex-end; /* Menyusun tombol ke kanan */
                                        gap: 10px; /* Jarak antar tombol */">
                                    <button ${timeline.status === 'Complete' ? 'hidden' : ''} class="align-right" id="edit-tl" onclick='subActionItem("edit", ${timeline.id}, ${i})'>
                                        <i class="fas fa-pen"></i>
                                    </button>
                                    <button ${timeline.status === 'Complete' ? 'hidden' : ''} class="ml-auto" id="del-tl" style="color:red;" onclick="subActionItem('delete', ${timeline.id}, ${i})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="completed-text" style="display: ${timeline.status === 'Complete' ? 'block' : 'none'};">
                                <p class="text-green-500">This task is completed at : <b>${timeCompleted}</b></p>
                            </div>
                            <div class="hold-reason-text" style="display: ${timeline.status === 'Hold' ? 'block' : 'none'};">
                                <p class="text-yellow-500">This task is on hold. Reason: <b>${timeline.holdreason}</b></p>
                            </div>
                            <div class="canceled-reason-text" style="display: ${timeline.status === 'Canceled' ? 'block' : 'none'};">
                                <p class="text-red-500">This task is canceled. Reason: <b>${timeline.cancelreason}</b></p>
                            </div>
                        </div>
                    </div>
                </div>`
                entryDiv.innerHTML = taskday
                section.appendChild(entryDiv);
            });

            return section;
        }

        // Append sections for Today, Yesterday, and other dates
        if (groupedEntries.Today.length > 0) {
            taskdayContainer.appendChild(createSection('Today', groupedEntries.Today));
        }

        if (groupedEntries.Yesterday.length > 0) {
            taskdayContainer.appendChild(createSection('Yesterday', groupedEntries.Yesterday));
        }

        Object.keys(groupedEntries.ByDate).forEach(date => {
            taskdayContainer.appendChild(createSection(date, groupedEntries.ByDate[date]));
        });

        dropdownToggle = document.querySelectorAll('.dropdown-toggle');
        dropdownMenu = document.querySelectorAll('.dropdown-menu');

        dropdownToggle.forEach((toggle, index) => {
            toggle.addEventListener('click', () => {
                dropdownMenu[index].classList.toggle('hidden');
            });
        });

        document.addEventListener('click', (event) => {
            dropdownToggle.forEach((toggle, index) => {
                if (!toggle.contains(event.target) && !dropdownMenu[index].contains(event.target)) {
                    dropdownMenu[index].classList.add('hidden');
                }
            });
        });
    }).finally(() => {
        Swal.close();
    });
});
