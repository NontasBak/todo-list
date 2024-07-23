import "./reset.css";
import "./style.css";
import Todo from "./todo.js";
import Project from "./project.js";
import Storage from "./storage.js";
import Display from "./display.js";
// import date from "date-fns";

if (!localStorage.getItem("projectList")) {
    let todo1 = new Todo("Title1", "Desc1", new Date(1999, 1, 10), "LOW");
    let todo2 = new Todo("Title2", "Desc2", new Date(1999, 0, 12), "MEDIUM");
    let todo3 = new Todo("Title3", "Desc3", new Date(2003, 5, 27), "HIGH");
    let project = new Project("House Chores", [todo1]);

    Storage.populate([project], [todo1, todo2, todo3]);
} else {
    let projectList = Storage.projectList();
    let todos = Storage.todos();

    // console.log(todos);
}

const display = new Display();
display.updateSidebarProjects();
display.updateMainScreen();

const sidebarButtons = document.querySelectorAll(".button-sidebar");
sidebarButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        display.updateActiveProject(e);
        display.updateMainScreen(e.target.textContent);
    });
});

const todos = document.querySelectorAll(".todo");
todos.forEach((todo) => {
    todo.addEventListener("click", display.todoInputHandler);
});

// console.log(JSON.stringify(todo1));
