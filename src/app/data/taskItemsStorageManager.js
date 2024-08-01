"use strict";

export default class TaskItemsStorageManager {
    constructor() {
        this._storageKey = "todo-web-app-task-items";
    }

    save(data) {
        this.localStorage.setItem(this._storageKey, JSON.stringify(data));
    }

    get() {
        return JSON.parse(this.localStorage.getItem(this._storageKey));
    }
}
