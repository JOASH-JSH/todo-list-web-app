"use strict";

export default class TaskItemsContainer {
    constructor(title, type) {
        this.title = title;
        this.type = type;
        this.taskItems = [];
    }

    addTaskItem(taskItem) {
        this.taskItems.push(taskItem);
    }

    removeTaskItem(index) {
        this.taskItems.splice(index, 1);
    }

    getTaskItems() {
        return this.taskItems;
    }

    getTaskItemsCount() {
        return this.taskItems.length;
    }
}
