document.addEventListener("DOMContentLoaded", () => {
    // random fitness tip
    const tips = [
        "Stay hydrated during your workouts!",
        "Don't forget to warm up before exercises.",
        "Consistency is key to achieving your fitness goals.",
        "Rest and recovery are just as important as the workout itself.",
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const tipElement = document.createElement("p");
    tipElement.textContent = `Tip of the day: ${randomTip}`;
    tipElement.setAttribute("class", "tip");
    document.querySelector(".hero").appendChild(tipElement);

    // future user counter
    let userCount = localStorage.getItem("userCount") || 0;
    userCount = parseInt(userCount) + 1;
    localStorage.setItem("userCount", userCount);
    const countElement = document.createElement("p");
    countElement.textContent = `${userCount} users have created workout plans with FitForge!`;
    countElement.setAttribute("class", "tip");
    document.querySelector(".hero").appendChild(countElement);

    // Store last visited page
    localStorage.setItem("lastVisited", "home");

    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth",
            });
        });
    });
});
