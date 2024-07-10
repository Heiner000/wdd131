const input = document.querySelector("#favchap");
const button = document.querySelector("button");
const list = document.querySelector("#list");

let chaptersArray = getChapterList() || [];

chaptersArray.forEach((chapter) => {
  displayList(chapter);
});

button.addEventListener("click", () => {
  // check if input is blank
  if (input.value != "") {
    // call display list w/ input.value arg
    displayList(input.value);
    // push value into array
    chaptersArray.push(input.value);
    // update localStorage w/ new array
    setChapterList();
    input.value = "";
    input.focus();
  }
});

function displayList(item) {
  const li = document.createElement("li");
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "❌";
  li.textContent = item;
  li.append(deleteBtn);
  list.append(li);

  deleteBtn.addEventListener("click", () => {
    list.removeChild(li);
    deleteChapter(li.textContent);
    input.focus();
  });
  //   sneaky console log
}

function setChapterList() {
  localStorage.setItem("top10BomList", JSON.stringify(chaptersArray));
}

function getChapterList() {
  return JSON.parse(localStorage.getItem("top10BomList"));
}

function deleteChapter(chapter) {
    chapter = chapter.slice(0, chapter.length - 1);
    chaptersArray = chaptersArray.filter((item) => item !== chapter);
    setChapterList();
}
