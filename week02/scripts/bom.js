const input = document.querySelector("#favchap");
const button = document.querySelector("button");
const list = document.querySelector("#list");

const item = document.createElement("li");

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "❌";

item.textContent = input.value;
item.append(deleteBtn);

list.append(item);
