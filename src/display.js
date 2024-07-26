import Storage from "./storage.js";
import Arrow from "./icons/arrow-down.svg";
import Trash from "./icons/trash.svg";
import Plus from "./icons/plus.svg";
import Todo from "./todo.js";
import Project from "./project.js";
import { isThisWeek, isToday } from "date-fns";

class Display {
    updateSidebarProjects = (activeProjectName = null) => {
        let projectList = Storage.projectList();
        const sidebarProjects = document.querySelector(".projectList");
        sidebarProjects.innerHTML = "";

        // console.log(projectList);
        projectList.forEach((project) => {
            let projectElement = document.createElement("li");
            projectElement.classList.add("button-sidebar", "project");
            projectElement.addEventListener("click", this.projectInputHandler);

            const projectName = document.createElement("p");
            projectName.classList.add("project-name");
            projectName.textContent = project.name;

            const deleteButton = document.createElement("img");
            deleteButton.classList.add("trash");
            deleteButton.setAttribute("src", Trash);

            projectElement.append(projectName, deleteButton);

            sidebarProjects.appendChild(projectElement);

            //In case there was already an active project that we want to keep
            if (activeProjectName === project.name) {
                this.updateActiveProject(projectElement);
            }
        });

        const defaultSidebarButtons = document.querySelectorAll(
            ".container .button-sidebar"
        );
        defaultSidebarButtons.forEach((button) => {
            button.addEventListener("click", (e) => {
                this.updateTodoList(e.target.textContent);
                this.deselectActiveProject();
                this.updateDefaultActiveProject(e.target);
                this.showAddTodoButton();
            });
        });
    };

    updateTodoList = (projectName = "All Projects") => {
        if (projectName.includes("→ ")) return; //Already selected

        let todos = Storage.todos();
        const todosDOM = document.querySelector(".todos");
        todosDOM.innerHTML = "";

        const listTitle = document.querySelector(".main h3");
        listTitle.textContent = projectName;

        let todosToDisplay = null;
        switch (projectName) {
            case "All Projects":
                todosToDisplay = todos;
                break;
            case "Today":
                todosToDisplay = todos.filter((todo) => isToday(todo.dueDate));
                break;
            case "This Week":
                todosToDisplay = todos.filter((todo) =>
                    isThisWeek(todo.dueDate)
                );
                break;
            default:
                todosToDisplay = todos.filter((todo) => {
                    return todo.projectName === projectName;
                });
        }

        todosToDisplay.forEach((todo, index) => {
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

        const todoElements = document.querySelectorAll(".todo");
        todoElements.forEach((todo) => {
            todo.addEventListener("click", this.todoInputHandler);
        });
    };

    deselectActiveProject = () => {
        const previousActiveButton = document.querySelector(".sidebar .active");
        previousActiveButton.classList.remove("active");

        if (previousActiveButton.classList.contains("default")) {
            previousActiveButton.textContent =
                previousActiveButton.textContent.slice(2); //Remove "→ "
        } else {
            previousActiveButton.querySelector(".project-name").textContent =
                previousActiveButton
                    .querySelector(".project-name")
                    .textContent.slice(2);
        }
    };

    updateDefaultActiveProject = (project) => {
        project.textContent = "→ " + project.textContent;
        project.classList.add("active");
    };

    updateActiveProject = (project) => {
        let projectName = project
            .closest(".button-sidebar")
            .querySelector(".project-name");

        projectName.textContent = "→ " + projectName.textContent;

        project.closest(".button-sidebar").classList.add("active");
    };

    toggleTodoDetails = (todo) => {
        // if (
        //     todo.classList.contains("checkbox") ||
        //     todo.classList.contains("trash")
        // ) {
        //     return;
        // }

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
    };

    todoInputHandler = (e) => {
        if (e.target.classList.contains("checkbox")) {
            this.toggleComplete(e.target);
        } else if (e.target.classList.contains("trash")) {
            this.deleteTodo(e.target);
            this.updateTodoList(this.getActiveProjectName());
        } else {
            this.toggleTodoDetails(e.target);
        }
    };

    projectInputHandler = (e) => {
        if (e.target.classList.contains("trash")) {
            this.deleteProject(e);
        } else {
            this.updateTodoList(e.target.textContent);
            this.deselectActiveProject();
            this.updateActiveProject(e.target);
            this.showAddTodoButton();
        }
    };

    showAddTodoButton = (event) => {
        if (event) event.stopPropagation();

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
    };

    addTodoHandler = (e) => {
        //Weird bug
        // if (e.target.id === "submit-todo" || e.target.id === "cancel-todo")
        //     return;

        const addTodoElement = document.querySelector(".add-todo");
        addTodoElement.classList.add("active");
        addTodoElement.removeEventListener("click", this.addTodoHandler);

        addTodoElement.innerHTML = "";

        const form = document.createElement("form");
        form.id = "new-todo-form";
        form.addEventListener("submit", (event) => {
            event.preventDefault();
        });

        const titleInput = document.createElement("input");
        titleInput.id = "new-todo-title";
        titleInput.type = "text";
        const titleInputLabel = document.createElement("label");
        titleInputLabel.textContent = "Title:";
        titleInputLabel.for = "new-todo-title";

        const descriptionInput = document.createElement("input");
        descriptionInput.id = "new-todo-description";
        descriptionInput.type = "text";
        const descriptionInputLabel = document.createElement("label");
        descriptionInputLabel.textContent = "Description:";
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
        dueDateInputLabel.textContent = "Due Date:";
        dueDateInputLabel.for = "new-todo-due-date";

        const priorityRadioButtonsDiv = document.createElement("div");
        priorityRadioButtonsDiv.classList.add("priority-radio-buttons");

        const priorityLabel = document.createElement("label");
        priorityLabel.textContent = "Priority:";

        const lowPriority = document.createElement("input");
        lowPriority.id = "low";
        lowPriority.type = "radio";
        lowPriority.name = "priority";
        lowPriority.value = "LOW";
        lowPriority.checked = true;
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

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.id = "submit-todo";
        submitButton.textContent = "Add Todo";
        submitButton.addEventListener("click", this.submitAddTodoForm);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.id = "cancel-todo";
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", this.showAddTodoButton);

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
            priorityLabel,
            priorityRadioButtonsDiv,
            submitButton,
            cancelButton
        );
        addTodoElement.appendChild(form);
    };

    submitAddTodoForm = (event) => {
        event.preventDefault();
        let title = document.querySelector("#new-todo-title").value;
        let description = document.querySelector("#new-todo-description").value;
        let dueDate = new Date(
            document.querySelector("#new-todo-due-date").value
        );
        let priority = document.querySelector(
            'input[name="priority"]:checked'
        ).value;

        let newTodo;
        let activeProjectName = this.getActiveProjectName();
        if (
            activeProjectName === "All Projects" ||
            activeProjectName === "Today" ||
            activeProjectName === "This Week"
        ) {
            newTodo = new Todo(title, description, dueDate, priority);
        } else {
            newTodo = new Todo(
                title,
                description,
                dueDate,
                priority,
                activeProjectName
            );
        }

        let todos = Storage.todos();
        todos.push(newTodo);

        let projectList = Storage.projectList();
        Storage.populate(projectList, todos);

        this.showAddTodoButton(event);
        this.updateTodoList(activeProjectName);
    };

    showAddProjectButton = (event) => {
        if (event) event.stopPropagation();

        const createProjectDiv = document.querySelector(".create-project");
        createProjectDiv.innerHTML = "";
        createProjectDiv.classList.remove("active");

        const createProjectH5 = document.createElement("h5");
        createProjectH5.textContent = "Create Project";

        const plus = document.createElement("img");
        plus.classList.add("plus-sign");
        plus.setAttribute("src", Plus);

        createProjectDiv.append(createProjectH5, plus);

        createProjectDiv.addEventListener("click", this.addProjectHandler);
    };

    addProjectHandler = (event) => {
        const createProjectDiv = document.querySelector(".create-project");
        createProjectDiv.classList.add("active");
        createProjectDiv.removeEventListener("click", this.addProjectHandler);

        createProjectDiv.innerHTML = "";

        const form = document.createElement("form");
        form.id = "new-project-form";
        form.addEventListener("submit", (event) => {
            event.preventDefault();
        });

        const nameInput = document.createElement("input");
        nameInput.id = "new-project-name";
        nameInput.type = "text";
        const nameInputLabel = document.createElement("label");
        nameInputLabel.textContent = "Name:";
        nameInputLabel.for = "new-project-name";

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.id = "submit-project";
        submitButton.textContent = "Create Project";
        submitButton.addEventListener("click", this.submitAddProjectForm);

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.id = "cancel-project";
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", this.showAddProjectButton);

        form.append(nameInputLabel, nameInput, submitButton, cancelButton);
        createProjectDiv.appendChild(form);
    };

    submitAddProjectForm = (event) => {
        event.preventDefault();

        let name = document.querySelector("#new-project-name").value;

        let project = Storage.projectList();
        project.push(new Project(name));

        let todos = Storage.todos();
        Storage.populate(project, todos);

        this.showAddProjectButton(event);
        this.updateSidebarProjects(this.getActiveProjectName());
    };

    deleteProject = (e) => {
        let projectName;
        let isProjectSelected = e.target
            .closest(".button-sidebar")
            .classList.contains("active");

        if (isProjectSelected) {
            projectName = e.target
                .closest(".button-sidebar")
                .querySelector(".project-name")
                .textContent.slice(2);
        } else {
            projectName = e.target
                .closest(".button-sidebar")
                .querySelector(".project-name").textContent;
        }

        let projectList = Storage.projectList();
        projectList = projectList.filter((project) => {
            return project.name !== projectName;
        });

        let todos = Storage.todos();
        todos = todos.filter((todo) => {
            return todo.projectName !== projectName;
        });

        Storage.populate(projectList, todos);

        if (isProjectSelected) {
            this.updateTodoList("All Projects");
            this.updateDefaultActiveProject(document.querySelector(".default"));
        }

        this.updateSidebarProjects(this.getActiveProjectName());
    };

    getActiveProjectName = () => {
        if (document.querySelector(".button-sidebar.active .project-name"))
            return document
                .querySelector(".button-sidebar.active .project-name")
                .textContent.slice(2);
        else
            return document.querySelector(".button-sidebar.active").textContent;
    };
}

export default Display;
