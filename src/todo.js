class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.complete = false;
    }

    switchComplete() {
        this.complete = !this.complete;
    }

    set priority(priority) {
        // if (
        //     priority !== "LOW" &&
        //     priority !== "MEDIUM" &&
        //     priority !== "HIGH"
        // ) {
        //     console.error("Invalid priority");
        //     return;
        // }

        this._priority = priority;
    }

    get priority() {
        return this._priority;
    }

    set dueDate(dueDate) {
        if (!(dueDate instanceof Date)) {
            console.error("Invalid due date");
            return;
        }

        this._dueDate = dueDate;
    }

    get dueDate() {
        return this._dueDate;
    }
}

export default Todo;
