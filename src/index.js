import "./reset.css";
import "./style.css";
import Todo from "./todo.js";
import Project from "./project.js";
import Storage from "./storage.js";
import Display from "./display.js";
import { add } from "date-fns";

if (!localStorage.getItem("projectList")) {
    let todo1 = new Todo(
        "Cleanup dust 🧹",
        "Make sure to clean all the edges!",
        add(new Date(), {
            days: 10,
        }),
        "LOW",
        "House Chores"
    );
    let todo2 = new Todo(
        "Email boss 💻",
        "Boss will be angry if you're too late",
        add(new Date(), {
            days: 3,
        }),
        "MEDIUM",
        "Work"
    );
    let todo3 = new Todo(
        "Laundry 👕",
        "Vacation soon so rush ASAP",
        new Date(),
        "HIGH",
        "House Chores"
    );
    let project1 = new Project("House Chores");
    let project2 = new Project("Work");

    Storage.populate([project1, project2], [todo1, todo2, todo3]);
} else {
    let projectList = Storage.projectList();
    let todos = Storage.todos();
}

const display = new Display();
display.updateSidebarProjects();
display.showAddProjectButton();
display.showAddTodoButton();
display.updateTodoList();
