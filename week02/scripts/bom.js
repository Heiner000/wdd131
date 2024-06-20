const input = document.querySelector("#favchap");
const button = document.querySelector("button");
const list = document.querySelector("#list");

// Create a li element that will hold each entries chapter title and an associated delete button.
const item = document.createElement("li");

// Create a delete button.
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌";

item.textContent = input.value;
item.append(deleteBtn);

list.append(item);
