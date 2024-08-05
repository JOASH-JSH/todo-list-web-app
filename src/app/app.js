"use strict";

import { format } from 'date-fns';

import UI from "./ui/ui.js";
import TaskItemsStorageManager from "./data/taskItemsStorageManager.js";
import TaskItemsContainer from "./data/taskItemsContainer.js";
import TaskItem from "./data/taskItem.js";

export default class App {
    constructor() {
        this.ui = new UI();
        this.taskItemsStorageManager = new TaskItemsStorageManager();
    }

    // Run application
    app() {
        // Retrieves the task items data from local storage.
        const data = this.taskItemsStorageManager.get();

        // If the "data" variable is null.
        if (data === null) {
            // Add default task items and task containers
            this.addDefaultTaskItemsContainer();
        }

        // Render the main layout of the app.
        this.ui.renderMainLayout();
        // Add new project form to the main layout.
        this.ui.addNewProjectForm();
        // Add new task item form to the main layout.
        this.ui.addNewTaskItemForm();

        // Setup hide/show sidebar event.
        this.setupHideShowSidebarEvent();     
        // Setup delete all task items and task containers event. 
        this.setupTaskItemsContainerDeleteAllEvent();

        // Render task containers.
        // Setup task container select event.
        // Setup task container delete event.
        // Setup add project form containing dialog box open event.
        this.combineTaskContainerRendersAndEvents();

        // Setup add project form containing dialog box close event.
        this.setupDialogBoxEvent(
            "close-new-project-form-dialog-btn", 
            "new-project-form-dialog",
            "close",
            "new-project-form"
        );

        // Setup add project form submit event
        this.setupProjectFormSubmitEvent();
        // Setup add task item form submit event
        this.setupTaskItemFormSubmitEvent();
    }

    // Sets default task items and task containers to the local storage.
    addDefaultTaskItemsContainer() {
        // Save the default task items containers into local storage.
        this.taskItemsStorageManager.save({
            taskItemsContainers: [
                new TaskItemsContainer("Today", "default", [
                    new TaskItem(
                        "Check email",
                        "Review and respond to important emails in my inbox.",
                        format(new Date(), 'yyyy-MM-dd'),
                        "medium"
                    )
                ]),
                new TaskItemsContainer("Upcoming", "default", []),
                new TaskItemsContainer("Build password manager app", "project", [
                    new TaskItem(
                        "Planning",
                        "Design ui, plan features, decide suitable tech stack.",
                        format(new Date(), 'yyyy-MM-dd'),
                        "high"
                    )
                ]),
            ],
        });
    }

    // Combines rendering task containers
    // Setup task container select event.
    // Setup task container delete event.
    // Setup add project form containing dialog box open event.
    combineTaskContainerRendersAndEvents() {
        // Retrieve tasks data from local storage. 
        const data = this.taskItemsStorageManager.get();

        // Render the hero image
        this.ui.renderHeroImage();

        // Render task containers.
        this.ui.renderTaskItemsContainers(data.taskItemsContainers);

        // Setup select task container event.
        this.setupTaskItemsContainerSelectEvent();

        // Setup delete task container event.
        this.setupTaskItemsContainerDeleteEvent();

        // Setup project form containing dialog box open event. 
        this.setupDialogBoxEvent(
            "open-new-project-form-dialog-btn", 
            "new-project-form-dialog",
            "open",
            ""
        );
    }

    // Combines rendering task items.
    // Setup add task items form containing dialog box open/close event.
    // Setup task container select event.
    // Setup mark task item complete event.
    combineTaskItemRendersAndEvents(index) {
        // Retrieve task items data from local storage.
        const data = this.taskItemsStorageManager.get();
            
        // Render container's task items.
        this.ui.renderTaskItemsContainerTaskItems(data.taskItemsContainers[index]);
        
        // Setup open task item form event.
        this.setupDialogBoxEvent(
            "open-new-task-item-form-dialog-btn", 
            "new-task-item-form-dialog",
            "open",
            ""
        )
            
        // Setup close task item form event.
        this.setupDialogBoxEvent(
            "close-add-task-item-dialog-btn", 
            "new-task-item-form-dialog",
            "close",
            "new-task-item-form"
        )

        // Setup mark complete task item event.
        this.setupTaskItemCompleteEvent();
    }

    // Add click event to hide/show sidebar button to hide/show sidebar. 
    setupHideShowSidebarEvent() {
        const button = document.querySelector(".hide-show-sidebar-btn");
        const aside = document.querySelector("#aside");
        button.addEventListener("click", (event) => (aside.classList.toggle("hide")));
    }

    // Add click event to every task container to select the task container.
    // Render task items of selected task container.
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

                // Add "selected" class to current selected container.
                container.classList.add("selected");

                // Get the container index number from container's dataset.
                const index = parseInt(container.dataset["taskItemsContainerIndex"]);

                // Render selected container's task items 
                // Setup add task items form containing dialog box open/close event.
                // Setup task container select event.
                // Setup mark task item complete event.
                this.combineTaskItemRendersAndEvents(index)
            });
        });
    }

    // Add click event to every task container remove button to delete the task container.
    // Re-render remaining task container.
    setupTaskItemsContainerDeleteEvent() {
        // Get all the remove task items container buttons.
        const buttons = document.querySelectorAll(".remove-task-items-container-btn");

        // Loop through each remove task items container button.
        buttons.forEach((button) => {
            // Add event listener to each remove task items container button.
            button.addEventListener("click", (event) => {
                event.stopPropagation();

                // Get the index number of container.
                const index = parseInt(button.dataset["taskItemsContainerIndex"]);

                // Retrieve task items containers from local storage.
                const data = this.taskItemsStorageManager.get();
                
                // Remove the container from the containers array
                data.taskItemsContainers.splice(index, 1);

                // Save the updated containers array to the local storage.
                this.taskItemsStorageManager.save(data);

                // Render task items containers
                // Setup task container select event.
                // Setup task container delete event.
                // Setup add project form containing dialog box open event.
                this.combineTaskContainerRendersAndEvents();
            });
        });
    }

    // Add click even to clear all data button to clear the project containers and task items default containers.
    setupTaskItemsContainerDeleteAllEvent() {
        // Get clear all data button
        const button = document.getElementById("clear-all-data-btn");

        // Add event listener to the button
        button.addEventListener("click", (event) => {
            event.stopPropagation();

            // Retrieve task items containers from local storage.
            const data = this.taskItemsStorageManager.get();

            // Remove all the task items from the default containers.
            for (let i = 0; i < 2; i++) {
                data.taskItemsContainers[i].taskItems = [];
            }

            // Remove all the project containers from the containers array.
            while (data.taskItemsContainers.length > 2) {
                data.taskItemsContainers.pop();
            }

            // Save the updated containers array to the local storage.
            this.taskItemsStorageManager.save(data);

            // Render task items containers
            // Setup task container select event.
            // Setup task container delete event.
            // Setup add project form containing dialog box open event.
            this.combineTaskContainerRendersAndEvents();
        });
    }

    // Add click event to every task item complete button of selected task container to mark the task item complete (remove).
    setupTaskItemCompleteEvent() {
        // Get all the task item complete buttons
        const buttons = document.querySelectorAll(".task-item-complete-btn");

        // Loop through every button. 
        buttons.forEach((button) => {
            // Add click event to mark complete the task item.
            button.addEventListener("click", (event) => {
                // Get the index number of selected task container.
                const taskItemscontainerIndex = parseInt(document.querySelector(".task-items-container.selected").dataset['taskItemsContainerIndex']);

                // Get the index number of click task item.
                const taskItemIndex = parseInt(button.dataset["taskItemIndex"]);

                // Retrieve task data. 
                const data = this.taskItemsStorageManager.get();
                
                // Get selected task container.
                const taskItemsContainer = data.taskItemsContainers[taskItemscontainerIndex];
                
                // Remove task item.
                taskItemsContainer.taskItems.splice(taskItemIndex, 1);
                
                // Save updated task data.
                this.taskItemsStorageManager.save(data);

                // Re-render remaining task items.
                // Setup add task items form containing dialog box open/close event.
                // Setup task container select event.
                // Setup mark task item complete event.
                this.combineTaskItemRendersAndEvents(taskItemscontainerIndex);
            });
        });
    }

    // Add click event open/close dialog box.
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

    // Add submit event to add project form.
    setupProjectFormSubmitEvent() {
        // Get new project form. 
        const form = document.getElementById("new-project-form");
        // Get new project form containing dialog box.
        const dialog = document.getElementById("new-project-form-dialog");

        // Add event listener 
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            // Get form data.
            const formData = new FormData(form);

            // Get new project title.
            const projectTitle = formData.get("title");

            // Retrive tasks data.
            const data = this.taskItemsStorageManager.get();

            // Add new project container to tasks data.
            data.taskItemsContainers.push(new TaskItemsContainer(projectTitle.trim(), "project", []));

            // Save updated tasks data.
            this.taskItemsStorageManager.save(data);

            form.reset(); // reset form field
            dialog.close(); // close dialog box

            // Re-render task items containers
            // Setup task container select event.
            // Setup task container delete event.
            // Setup add project form containing dialog box open event.
            this.combineTaskContainerRendersAndEvents(data);
        });
    }

    // Add submit event to add task item form.
    setupTaskItemFormSubmitEvent() {
        // Get new task item form. 
        const form = document.getElementById("new-task-item-form");
        // Get new task item form containing dialog box.
        const dialog = document.getElementById("new-task-item-form-dialog");

        // Add event listener 
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            // Get form data
            const formData = new FormData(form);

            // Empty plain object.
            const newTaskItem = {};

            // Convert form data to plain object.
            formData.forEach((value, key) => (newTaskItem[key] = value));

            // Retrive tasks data.
            const data = this.taskItemsStorageManager.get();

            // Get seleted task container.
            const selectedContainer = document.querySelector(".task-items-container.selected");

            // Get selected container index number.
            const containerIndex = parseInt(selectedContainer.dataset["taskItemsContainerIndex"]);

            // Add new task item to tasks data.
            data.taskItemsContainers[containerIndex].taskItems.push(
                new TaskItem(
                    newTaskItem.title.trim(), 
                    newTaskItem.description.trim(), 
                    newTaskItem.dueDate, 
                    newTaskItem.priority
                )
            );

            // Save updated tasks data.
            this.taskItemsStorageManager.save(data);

            form.reset(); // reset form field
            dialog.close(); // close dialog box

            this.combineTaskItemRendersAndEvents(index);
        });
    }
}
