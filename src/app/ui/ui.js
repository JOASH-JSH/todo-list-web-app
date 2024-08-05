"use strict";

import { format, parseISO } from 'date-fns';

export default class UI {
    renderMainLayout() {
        const iconSrc = require.context("../../assets/icons", false, /\.svg$/);             

        document.querySelector("#container").innerHTML = `
            <aside id="aside">
                <div class="aside-header">
                    <i class="fa-solid fa-fire-flame-curved"></i>
                    TaskFlow
                </div>
                <div class="default-task-items-containers"></div>
                <div class="projects-container">
                    <div class="projects-container-header">
                        <p>My Projects</p>
                        <button id="open-new-project-form-dialog-btn">
                            <i class="fa-regular fa-plus"></i>
                        </button>
                    </div>
                    <div class="project-task-items-containers"></div>
                </div>
                <button id="clear-all-data-btn">Clear all data</button>
            </aside>
            <main id="main">
                <header id="header">
                    <button class="hide-show-sidebar-btn">
                        <img src="${iconSrc("./sidebar.svg")}" alt="sidebar-icon" />
                    </button>
                    <button>
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                </header>
                <div id="task-items-container-task-items-area"></div>
            </main>
        `;

        this.renderHeroImage();
    }

    renderHeroImage() {
        const imageSrc = require.context("../../assets/images", false, /\.(webp|png)$/);
      
        const taskItemsArea = document.getElementById("task-items-container-task-items-area");

        taskItemsArea.innerHTML = `
            <div class="hero-image-container">
                <div>
                    <img src="${imageSrc("./woman_and_computer.webp")}" alt="Computer image" />
                    <p>Every journey starts with a single step.</p>
                    <p>Get Started.</p>
                </div>
            </div>
        `;
    }

    renderTaskItemsContainers(taskItemsContainers) {
        const defaultTaskItemsContainers = document.querySelector(".default-task-items-containers");
        const projectTaskItemsContainers = document.querySelector(".project-task-items-containers");

        // Default task items containers
        defaultTaskItemsContainers.innerHTML = `
            <div class="task-items-container" data-task-items-container-index="0">
                <div>
                    <i class="fa-solid fa-calendar-day"></i>
                    <p class="task-item-container-title">${taskItemsContainers[0].title}</p>
                </div>
            </div>
            <div class="task-items-container" data-task-items-container-index="1">
                <div>
                    <i class="fa-solid fa-calendar-days"></i>
                    <p class="task-item-container-title">${taskItemsContainers[1].title}</p>
                </div>
            </div>
        `;

        // Project task items containers
        let taskItemsContainersHtmlString = "";

        taskItemsContainers.forEach((taskItemsContainer, index) => {
            if (taskItemsContainer.type === "project") {
                taskItemsContainersHtmlString += `
                    <div class="task-items-container" data-task-items-container-index="${index}">
                        <div>
                            <i class="fa-solid fa-hashtag"></i>
                            <p class="task-item-container-title">${taskItemsContainer.title}</p>
                        </div>
                        <div>                           
                            <button class="remove-task-items-container-btn" data-task-items-container-index="${index}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }
        });
        
        projectTaskItemsContainers.innerHTML = taskItemsContainersHtmlString;
    }

    renderTaskItemsContainerTaskItems(taskItemsContainer) {
        const taskItemsContainerTaskItemsArea = document.querySelector("#task-items-container-task-items-area");

        taskItemsContainerTaskItemsArea.innerHTML = `
            <div class="task-items-area-header">
                <p>${taskItemsContainer.title}</p>
                <p>
                    <i class="fa-regular fa-circle-check"></i>
                    <span>${taskItemsContainer.taskItems.length}</span>
                    <span>tasks</span>
                </p>
            </div>
            <div class="task-items-area-main">
                <div class="task-items-grid"></div>
                <div>
                    <button id="open-new-task-item-form-dialog-btn">
                        <i class="fa fa-plus"></i>
                        Add task
                    </button>
                </div>
            </div>
        `;

        if (taskItemsContainer.taskItems.length > 0) {
            let taskItemsHTMLString = "";

            taskItemsContainer.taskItems.forEach((taskItem, index) => {
                taskItemsHTMLString += `
                    <div class="task-item-card">
                        <div class="task-item-complete-btn-container">
                            <button class="task-item-complete-btn" data-task-item-index="${index}">
                                <i class="fa-solid fa-check"></i>
                            </button>
                        </div>
                        <div class="task-item-info">
                            <div class="task-item-title-container">
                                <p class="task-item-title">${taskItem.title}</p>
                                <button>
                                    <i class="fa-solid fa-ellipsis"></i>
                                </button>
                            </div>
                            <div class="task-item-description-container">
                                <p class="task-item-decription">${taskItem.description}</p>
                            </div>
                            <div class="task-item-due-date-n-priority-container">
                                <p class="task-item-due-date">
                                    <i class="fa-solid fa-calendar"></i>
                                    <span>${format(parseISO(taskItem.dueDate), 'MMMM d, yyyy')}</span>
                                </p>
                                <p class="task-item-priority">
                                    <i class="fa-solid fa-flag"></i>
                                    <span>${taskItem.priority}</span>
                                </p>
                            </div> 
                        </div>
                    </div>
                `;
            });

            document.querySelector(".task-items-grid").innerHTML = taskItemsHTMLString; 
        }
    }

    addNewProjectForm() {
        const dialog = document.createElement("dialog");

        dialog.id = "new-project-form-dialog";
        dialog.classList.add("dialog");

        // dialog.setAttribute("open", "");

        dialog.innerHTML = `
            <div class="dialog-header">
                <p>Add project</p>
                <button>
                    <i class="fa-regular fa-circle-question"></i>
                </button>
            </div>
            <form id="new-project-form">
                <div class="form-input-field"> 
                    <label for="project-title">Name</label>
                    <input type="text" id="project-title" name="title" autocomplete="off" spellcheck="false" autofocus required />
                </div>
                <div class="form-buttons-container">
                    <button type="button" id="close-new-project-form-dialog-btn">Cancel</button> 
                    <button type="submit">Add</button> 
                </div>
            </form>
        `;

        document.body.append(dialog);
    }

    addNewTaskItemForm() {
        const dialog = document.createElement("dialog");

        dialog.id = "new-task-item-form-dialog";
        dialog.classList.add("dialog");

        // dialog.setAttribute("open", "");

        dialog.innerHTML = `
            <div class="dialog-header">
                <p>Add task</p>
                <i class="fa-regular fa-circle-question"></i>
            </div>
            <form id="new-task-item-form">
                <div class="form-input-field"> 
                    <label for="task-item-title">Name</label>
                    <input type="text" id="task-item-title" name="title" autocomplete="off" spellcheck="false" autofocus required />
                </div>
                <div class="form-input-field"> 
                    <label for="task-item-description">Description</label>
                    <textarea id="task-item-description" name="description" rows="4" autocomplete="off" spellcheck="false"></textarea>
                </div>
                <div class="form-input-field"> 
                    <label for="task-item-due-date">Due date</label>
                    <input type="date" id="task-item-due-date" name="dueDate" required />
                </div>
                <div class="form-input-field"> 
                    <label for="task-item-priority">Priority</label>
                    <select id="task-item-priority" name="priority">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div>
                    <button type="button" id="close-add-task-item-dialog-btn">Cancel</button> 
                    <button type="submit">Add</button> 
                </div>
            </form>
        `;

        document.body.append(dialog);
    }
}
