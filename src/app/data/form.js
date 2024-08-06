"use strict";

export default class Form {
    constructor(form) {
        this.form = form;
    }

    getFormData() {
        // Get the form data in the form of FormData object.
        const formData = new FormData(this.form);
        const data = {}; // Empty plain object to FormData converted into plain object.

        // Store formData key-value pair values into data variable.
        formData.forEach((value, key) => (data[key] = value)); 

        return data;
    }
}