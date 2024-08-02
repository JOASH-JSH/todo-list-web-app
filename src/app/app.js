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
        // Render task containers.
        this.ui.renderTaskItemsContainers(data.taskItemsContainers);
        // Setup select task container event.
        this.setupTaskItemsContainerSelectEvent();
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
}
