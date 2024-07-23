import "./reset.css";
import "./style.css";
import Todo from "./todo.js";
import Project from "./project.js";
import Storage from "./storage.js";
import Display from "./display.js";
// import date from "date-fns";

if (!localStorage.getItem("projectList")) {
    let todo1 = new Todo("title1", "desc1", new Date(1999, 1, 10), "LOW");
    let todo2 = new Todo("title2", "desc2", new Date(1999, 0, 12), "MEDIUM");
    let project = new Project("House Chores", [todo1]);

    Storage.populate([project], [todo1, todo2]);
} else {
    let projectList = Storage.projectList();
    let todos = Storage.todos();

    // console.log(todos);
}



Display.updateSidebarProjects();
Display.updateMainScreen();
// console.log(JSON.stringify(todo1));
