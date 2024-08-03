"use strict";

import sidebarSVG from "../../assets/icons/sidebar.svg";

export default class UI {
    constructor() {}

    renderMainLayout() {
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
                        <button class="add-project-btn btn">
                            <i class="fa-regular fa-plus"></i>
                        </button>
                    </div>
                    <div class="project-task-items-containers"></div>
                </div>
                <button class="clear-all-data-btn">Clear all data</button>
            </aside>
            <main id="main">
                <header id="header">
                    <button class="hide-show-sidebar-btn">
                        <img src="${sidebarSVG}" alt="sidebar-icon" />
                    </button>
                    <i class="fa-solid fa-ellipsis"></i>
                </header>
                <div class="task-items-container-task-items-area"></div>
            </main>
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
                    <p>${taskItemsContainers[0].title}</p>
                </div>
            </div>
            <div class="task-items-container" data-task-items-container-index="1">
                <div>
                    <i class="fa-solid fa-calendar-days"></i>
                    <p>${taskItemsContainers[1].title}</p>
                </div>
            </div>
        `;

        // Project task items containers
        if (taskItemsContainers.length > 2) {
            const htmlString = taskItemsContainers.map((taskItemsContainer, index) => {
                if (taskItemsContainer.type === "project") {
                    return `
                        <div class="task-items-container" data-task-items-container-index="${index}">
                            <div>
                                <i class="fa-solid fa-hashtag"></i>
                                <p>${taskItemsContainer.title}</p>
                            </div>
                            <div>                           
                                <button class="edit-task-item-btn">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button class="remove-task-item-container-btn">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            });

            projectTaskItemsContainers.innerHTML = htmlString.join("");
        }
    }

    renderTaskItemsContainerTaskItems(taskItemsContainer) {
        const taskItemsContainerTaskItemsArea = document.querySelector(".task-items-container-task-items-area");

        taskItemsContainerTaskItemsArea.innerHTML = `
            <div>
                <p>${taskItemsContainer.title}</p>
                <p>
                    <i class="fa-regular fa-circle-check"></i>
                    <span>${taskItemsContainer.taskItems.length}</span>
                    <span>tasks</span>
                </p>
            </div>
            <div class="task-items-grid"></div>
            <div>
                <button class="add-task-item-btn">
                    <i class="fa fa-plus"></i>
                    Add task
                </button>
            </div>
        `;
    }
}
