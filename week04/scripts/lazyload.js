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
        lastModifiedP.textContent = `Last Modified: ${lastModified}`;
    }
});
