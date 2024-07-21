const mainnav = document.querySelector(".navigation");
const hambutton = document.querySelector("#menu");

hambutton.addEventListener("click", (e) => {
    e.preventDefault();
    mainnav.classList.toggle("show");
    hambutton.classList.toggle("show");
});

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();

    const currentYear = today.getFullYear();

    const lastModified = new Date(document.lastModified);

    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    const lastModifiedP = document.getElementById("lastModified");
    if (lastModifiedP) {
        const formattedLastModified = `${lastModified.getFullYear()} - ${(
            lastModified.getMonth() + 1
        )
            .toString()
            .padStart(2, "0")} - ${lastModified
            .getDate()
            .toString()
            .padStart(2, "0")}`;
        lastModifiedP.textContent = `Last Modified: ${formattedLastModified}`;
    }
});
