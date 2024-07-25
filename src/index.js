import "./reset.css";
import "./style.css";
import Todo from "./todo.js";
import Project from "./project.js";
import Storage from "./storage.js";
import Display from "./display.js";
// import date from "date-fns";

if (!localStorage.getItem("projectList")) {
    let todo1 = new Todo("Title1", "Desc1", new Date(1999, 1, 10), "LOW", "House Chores");
    let todo2 = new Todo("Title2", "Desc2", new Date(1999, 0, 12), "MEDIUM", "Work");
    let todo3 = new Todo("Title3", "Desc3", new Date(2003, 5, 27), "HIGH", "House Chores");
    let project1 = new Project("House Chores");
    let project2 = new Project("Work");

    Storage.populate([project1, project2], [todo1, todo2, todo3]);
} else {
    let projectList = Storage.projectList();
    let todos = Storage.todos();

    // console.log(todos);
}

const display = new Display();
display.updateSidebarProjects();
display.showAddProjectButton();
display.showAddTodoButton();
display.updateTodoList();

// console.log(JSON.stringify(todo1));
