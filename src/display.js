import Storage from "./storage.js";
import Arrow from "./icons/arrow-down.svg";
import Trash from "./icons/trash.svg";
import Plus from "./icons/plus.svg";

class Display {
    updateSidebarProjects = () => {
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
    };

    updateMainScreen = (list = "All Projects") => {
        this.showAddTodoButton();

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
            if (todo.complete === true) {
                checkbox.checked = true;
            }

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
    };

    updateActiveProject = (button) => {
        const previousActiveButton = document.querySelector(".sidebar .active");
        if (previousActiveButton)
            previousActiveButton.classList.remove("active");

        button.target.classList.add("active");
    };

    toggleTodoDetails = (todo) => {
        if (
            todo.classList.contains("checkbox") ||
            todo.classList.contains("trash")
        ) {
            return;
        }

        //Make sure the todo element is selected (and not the children)
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
            return td.title === todo.querySelector(".title").textContent;
        });

        const description = document.createElement("p");
        description.classList.add("description");
        description.textContent = selectedTodo.description;

        details.appendChild(description);
        todo.appendChild(details);
    };

    toggleComplete = (todoCheckbox) => {
        let todos = Storage.todos();
        let selectedTodo = todos.find((td) => {
            return (
                td.title ===
                todoCheckbox.parentElement.querySelector(".title").textContent
            );
        });

        selectedTodo.switchComplete();
        //Might need refactoring
        let projectList = Storage.projectList();
        Storage.populate(projectList, todos);
    };

    deleteTodo = (todo) => {
        let todos = Storage.todos();
        todos = todos.filter(
            (td) =>
                td.title !==
                todo.parentElement.querySelector(".title").textContent
        );

        //Might need refactoring
        let projectList = Storage.projectList();
        Storage.populate(projectList, todos);
        this.updateMainScreen();
    };

    todoInputHandler = (e) => {
        if (e.target.classList.contains("checkbox")) {
            this.toggleComplete(e.target);
        } else if (e.target.classList.contains("trash")) {
            this.deleteTodo(e.target);
        } else {
            this.toggleTodoDetails(e.target);
        }
    };

    showAddTodoButton = () => {
        const addTodoElement = document.querySelector(".add-todo");
        addTodoElement.innerHTML = "";
        addTodoElement.classList.remove("active");
        const addTodoH5 = document.createElement("h5");
        addTodoH5.textContent = "Add Todo";

        const plus = document.createElement("img");
        plus.classList.add("plus-sign");
        plus.setAttribute("src", Plus);

        addTodoElement.append(addTodoH5, plus);
        addTodoElement.addEventListener("click", this.addTodoHandler);
    }

    addTodoHandler = (e) => {
        const addTodoElement = document.querySelector(".add-todo");
        addTodoElement.classList.toggle("active");
        addTodoElement.removeEventListener("click", this.addTodoHandler);

        if (!addTodoElement.classList.contains("active")) {
            this.showAddTodoButton();
            return;
        }

        addTodoElement.innerHTML = "";

        const form = document.createElement("form");
        form.id = "new-todo-form";

        const titleInput = document.createElement("input");
        titleInput.id = "new-todo-title";
        titleInput.type = "text";
        const titleInputLabel = document.createElement("label");
        titleInputLabel.textContent = "Title";
        titleInputLabel.for = "new-todo-title";

        const descriptionInput = document.createElement("input");
        descriptionInput.id = "new-todo-description";
        descriptionInput.type = "text";
        const descriptionInputLabel = document.createElement("label");
        descriptionInputLabel.textContent = "Description";
        descriptionInputLabel.for = "new-todo-description";

        const dueDateInput = document.createElement("input");
        dueDateInput.type = "date";
        dueDateInput.id = "new-todo-due-date";
        function toDateInputValue(dateObject) {
            const local = new Date(dateObject);
            local.setMinutes(
                dateObject.getMinutes() - dateObject.getTimezoneOffset()
            );
            return local.toJSON().slice(0, 10);
        }
        dueDateInput.value = toDateInputValue(new Date());
        const dueDateInputLabel = document.createElement("label");
        dueDateInputLabel.textContent = "Due Date";
        dueDateInputLabel.for = "new-todo-due-date";

        const priorityRadioButtonsDiv = document.createElement("div");
        priorityRadioButtonsDiv.classList.add("priority-radio-buttons");
        const lowPriority = document.createElement("input");
        lowPriority.id = "low";
        lowPriority.type = "radio";
        lowPriority.name = "priority";
        lowPriority.value = "LOW";
        const mediumPriority = document.createElement("input");
        mediumPriority.id = "medium";
        mediumPriority.type = "radio";
        mediumPriority.name = "priority";
        mediumPriority.value = "MEDIUM";
        const highPriority = document.createElement("input");
        highPriority.id = "high";
        highPriority.type = "radio";
        highPriority.name = "priority";
        highPriority.value = "HIGH";

        const lowPriorityLabel = document.createElement("label");
        lowPriorityLabel.textContent = "Low";
        lowPriority.for = "low";
        const mediumPriorityLabel = document.createElement("label");
        mediumPriorityLabel.textContent = "Medium";
        mediumPriority.for = "medium";
        const highPriorityLabel = document.createElement("label");
        highPriorityLabel.textContent = "High";
        highPriority.for = "high";
        

        priorityRadioButtonsDiv.append(
            lowPriority,
            lowPriorityLabel,
            mediumPriority,
            mediumPriorityLabel,
            highPriority,
            highPriorityLabel
        );
        form.append(
            titleInputLabel,
            titleInput,
            descriptionInputLabel,
            descriptionInput,
            dueDateInputLabel,
            dueDateInput,
            priorityRadioButtonsDiv
        );
        addTodoElement.appendChild(form);
    };
}

export default Display;
