import Todo from "./todo.js";
import Project from "./project.js";

class Storage {
    static populate = (projectList, todos) => {
        localStorage.setItem("projectList", JSON.stringify(projectList));
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    static projectList = () => {
        let projects = JSON.parse(localStorage.getItem("projectList"));

        projects = projects.map((project) => {
            return new Project(project.name, project.todos);
        });
        return projects;
    };

    static todos = () => {
        let todos = JSON.parse(localStorage.getItem("todos"));

        todos = todos.map((todo) => {
            return new Todo(
                todo.title,
                todo.description,
                new Date(todo._dueDate),
                todo._priority,
                todo.projectName,
                todo.complete
            );
        });
        return todos;
    };
}

export default Storage;
