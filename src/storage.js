import Todo from "./todo.js";

class Storage {
    static populate = (projectList, todos) => {
        localStorage.setItem("projectList", JSON.stringify(projectList));
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    static projectList = () => {
        return JSON.parse(localStorage.getItem("projectList"));
    };

    static todos = () => {
        let todos = JSON.parse(localStorage.getItem("todos"));

        todos = todos.map((todo) => {
            return new Todo(
                todo.title,
                todo.description,
                new Date(todo._dueDate),
                todo._priority,
                todo.complete
            );
        });
        return todos;
    };
}

export default Storage;
