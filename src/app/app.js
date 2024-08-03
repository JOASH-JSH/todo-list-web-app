"use strict";

import UI from "./ui/ui.js";
import TaskItemsStorageManager from "./data/taskItemsStorageManager.js";
import TaskItemsContainer from "./data/taskItemsContainer.js";

export default class App {
    constructor() {
        this.ui = new UI();
        this.taskItemsStorageManager = new TaskItemsStorageManager();
    }

    app() {
        // Retrieves the task items data from local storage.
        let data = this.taskItemsStorageManager.get();

        // If the "data" variable is null
        if (data === null) {
            // Save the default task items containers into local storage.
            this.taskItemsStorageManager.save({
                taskItemsContainers: [
                    new TaskItemsContainer("Today", "default"),
                    new TaskItemsContainer("Upcoming", "default"),
                    new TaskItemsContainer("New project 1", "project"),
                    new TaskItemsContainer("New project 2", "project"),
                    new TaskItemsContainer("New project 3", "project"),
                ],
            });
            // Re-retrieve the data from the local storage.
            data = this.taskItemsStorageManager.get();
        }

        // Render the main layout of the app.
        this.ui.renderMainLayout();
        // Add new project form to the layout.
        this.ui.addNewProjectForm();
        // Add new task item form to the layout.
        this.ui.addNewTaskItemForm();

        // Setup hide or show sidebar event.
        this.setupHideShowSidebarEvent();

        this.combineRendersAndEvents();

        this.setupProjectFormSubmitEvent();
    }

    combineRendersAndEvents() {
        // Retrieve tasks data from local storage. 
        const data = this.taskItemsStorageManager.get();

        // Render task containers.
        this.ui.renderTaskItemsContainers(data.taskItemsContainers);

        // Setup select task container event.
        this.setupTaskItemsContainerSelectEvent();

        // Setup delete task container event.
        this.setupTaskItemsContainerDeleteEvent();

        // Setup project form containing dialog box open event 
        this.setupDialogBoxEvent(
            "open-new-project-form-dialog-btn", 
            "new-project-form-dialog",
            "open",
            ""
        )

        // Setup project form containing dialog box close event 
        this.setupDialogBoxEvent(
            "close-new-project-form-dialog-btn", 
            "new-project-form-dialog",
            "close",
            "new-project-form"
        )
    }

    setupHideShowSidebarEvent() {
        const button = document.querySelector(".hide-show-sidebar-btn");
        const aside = document.querySelector("#aside");
        button.addEventListener("click", (event) => (aside.classList.toggle("hide")));
    }

    setupTaskItemsContainerSelectEvent() {
        // Get all the task items container elements.
        const containers = document.querySelectorAll(".task-items-container");

        // Loop each container element.
        containers.forEach((container) => {
            // add click event listner to the container.
            container.addEventListener("click", (event) => {
                // Get previously selected container.
                const prevSelectedContainer = document.querySelector(".task-items-container.selected");

                // If previously selected container exist. 
                if (prevSelectedContainer) {
                    // Remove "selected" class from the prevous selected container
                    prevSelectedContainer.classList.remove("selected");
                }

                // Add "selected" class to current selected container
                container.classList.add("selected");

                // Retrieve task items data from local storage.
                const data = this.taskItemsStorageManager.get();

                // Get the container index number from container's dataset.
                const index = parseInt(container.dataset["taskItemsContainerIndex"]);

                // Render container's task items
                this.ui.renderTaskItemsContainerTaskItems(data.taskItemsContainers[index]);
            });
        });
    }

    setupTaskItemsContainerDeleteEvent() {
        const buttons = document.querySelectorAll(".remove-task-items-container-btn");

        buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();

                const index = parseInt(button.dataset["taskItemsContainerIndex"]);

                const data = this.taskItemsStorageManager.get();
                
                data.taskItemsContainers.splice(index, 1);

                this.taskItemsStorageManager.save(data);

                this.combineRendersAndEvents();
            });
        });
    }

    setupDialogBoxEvent(buttonId, dialogId, action, formId) {
        const button = document.getElementById(buttonId);
        const dialog = document.getElementById(dialogId);
        const form = document.getElementById(formId);

        button.addEventListener("click", (event) => {
            event.stopPropagation();

            if (action === "open") {
                dialog.showModal();
            } else if (action === "close") {
                form.reset();
                dialog.close();
            }
        });
    }

    setupProjectFormSubmitEvent() {
        const form = document.getElementById("new-project-form");
        const dialog = document.getElementById("new-project-form-dialog");

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(form);

            const projectTitle = formData.get("title");

            const data = this.taskItemsStorageManager.get();

            data.taskItemsContainers.push(new TaskItemsContainer(projectTitle.trim(), "project"));

            this.taskItemsStorageManager.save(data);

            form.reset();
            dialog.close();

            this.combineRendersAndEvents();
        });
    }
}
