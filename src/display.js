import Storage from "./storage.js";
import Arrow from "./icons/arrow-down.svg";
import Trash from "./icons/trash.svg";

class Display {
    updateSidebarProjects() {
        let projectList = Storage.projectList();
        const sidebarProjects = document.querySelector(".projectList");
        sidebarProjects.innerHTML = "";

        // console.log(projectList);
        projectList.forEach((project) => {
            let projectElement = document.createElement("li");
            projectElement.classList.add("button-sidebar");
            projectElement.textContent = project.name;

            sidebarProjects.appendChild(projectElement);
        });
    }

    updateMainScreen(list = "All Projects") {
        let todos = Storage.todos();
        const todosDOM = document.querySelector(".todos");
        todosDOM.innerHTML = "";

        // console.log(todos);
        const listTitle = document.querySelector(".main h3");
        listTitle.textContent = list;

        todos.forEach((todo, index) => {
            let todoElement = document.createElement("li");
            todoElement.classList.add("todo");
            todoElement.dataset.index = index;

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("checkbox");
            checkbox.classList.add(`${todo.priority.toLowerCase()}`);

            let title = document.createElement("p");
            title.classList.add("title");
            title.textContent = todo.title;

            let dueDate = document.createElement("p");
            dueDate.classList.add("dueDate");
            dueDate.textContent = `${todo.dueDate.getDate()}/${todo.dueDate.getMonth() + 1}`;

            let arrowDown = document.createElement("img");
            arrowDown.classList.add("arrow");
            arrowDown.setAttribute("src", Arrow);

            let trash = document.createElement("img");
            trash.classList.add("trash");
            trash.setAttribute("src", Trash);

            todoElement.appendChild(checkbox);
            todoElement.appendChild(title);
            todoElement.appendChild(dueDate);
            todoElement.appendChild(arrowDown);
            todoElement.appendChild(trash);

            todosDOM.appendChild(todoElement);
        });
    }

    updateActiveButton(button) {
        const previousActiveButton = document.querySelector(".sidebar .active");
        if (previousActiveButton)
            previousActiveButton.classList.remove("active");

        button.target.classList.add("active");
    }

    toggleTodoDetails(todo) {
        if(todo.classList.contains("checkbox") || todo.classList.contains("trash")) {
            return;
        }

        //Make sure the todo element is selected (and not the children)
        console.log(todo);
        if (!todo.classList.contains("todo")) {
            todo = todo.closest(".todo");
        }

        let details = document.querySelector(
            `[data-index="${todo.dataset.index}"] .details`
        );

        if (details) {
            details.remove();
            return;
        }

        details = document.createElement("div");
        details.classList.add("details");

        //Might need to refactor this
        let todos = Storage.todos();
        let selectedTodo = todos.find((td) => {
            console.log(todo);
            return td.title === todo.querySelector(".title").textContent;
        });

        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = selectedTodo.description;

        details.appendChild(description);
        todo.appendChild(details);
    }
}

export default Display;
