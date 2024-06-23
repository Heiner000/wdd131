const mainnav = document.querySelector(".navigation");
const hambutton = document.querySelector("#menu");

hambutton.addEventListener("click", (e) => {
  e.preventDefault();
  mainnav.classList.toggle("show");
  hambutton.classList.toggle("show");
});
