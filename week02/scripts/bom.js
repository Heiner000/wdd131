const input = document.querySelector("#favchap");
const button = document.querySelector("button");
const list = document.querySelector("#list");

button.addEventListener("click", () => {
    // check if input is blank
    if (input.value.trim() !== "") {
        // do more
        const item = document.createElement("li");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";

        item.textContent = input.value;
        item.append(deleteBtn);

        list.append(item);

        deleteBtn.addEventListener("click", () => {
            list.removeChild(item);
            input.focus();
        });
        input.value = "";
        input.focus();
    } else {
        console.log("error with something");
        input.focus();
    }
    input.focus();
});
