import "./style.css";
import Todo from "./todo.js";
import Project from "./project.js";
// import date from "date-fns";

let todo1 = new Todo("title1", "desc1", new Date(1999, 1 , 10), "LOW");
let todo2 = new Todo("title2", "desc2", new Date(1999, 0 , 12), "MEDIUM");

let defaultProject = new Project("default", [todo1, todo2]);
