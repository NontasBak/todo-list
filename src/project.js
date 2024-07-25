class Project {
    constructor(name) {
        this.name = name;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }
}

export default Project;
