import Storage from "./storage.js";

class Display {
    constructor() {
        this.projectList = localStorage.getItem("projectList");
    }

    static updateSidebarProjects() {
        let projectList = Storage.projectList();
        const sidebarProjects = document.querySelector(".projectList");
        sidebarProjects.innerHTML = "";

        // console.log(projectList);
        projectList.forEach((project) => {
            let projectElement = document.createElement("li");
            projectElement.textContent = project.name;

            sidebarProjects.appendChild(projectElement);
        });
    }

    static updateMainScreen(list = "All Projects") {
        let todos = Storage.todos();
        const todosDOM = document.querySelector(".todos");

        // console.log(todos);
        const listTitle = document.querySelector(".main > h3");
        listTitle.textContent = list;

        todos.forEach((todo) => {
            let todoElement = document.createElement("li");
            todoElement.classList.add("todo", "button-sidebar");
            

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("completed");
            checkbox.classList.add(`${todo.priority}`);

            let title = document.createElement("p");
            title.classList.add("title");
            title.textContent = todo.title;

            let dueDate = document.createElement("p");
            dueDate.classList.add("dueDate");
            dueDate.textContent = `${todo.dueDate.getDate()}/${todo.dueDate.getMonth() + 1}`;

            todoElement.appendChild(checkbox);
            todoElement.appendChild(title);
            todoElement.appendChild(dueDate);

            todosDOM.appendChild(todoElement);
        });
    }
}

export default Display;
