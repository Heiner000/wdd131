document.addEventListener("DOMContentLoaded", () => {
    // Dynamic Footer
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

    // Handle Review Count
    const reviewsDisplay = document.querySelector(".review-count");
    let numReviews = Number(window.localStorage.getItem("numReviews-ls")) || 0;

    // Increment the number of reviews
    numReviews++;

    // Save the updated number of reviews back to localStorage
    window.localStorage.setItem("numReviews-ls", numReviews);

    // Display the review count
    if (numReviews !== 1) {
        reviewsDisplay.textContent = `You have reviewed ${numReviews} product(s).`;
    } else {
        reviewsDisplay.textContent = `This is your first review. 🥳 Welcome!`;
    }
});

// Use JavaScript to populate the Product Name options where the array's name field is used for the select option display and the array's id is used for the value field.
const products = [
    {
        id: "fc - 1888",
        name: "flux capacitor",
        averagerating: 4.5,
    },
    {
        id: "fc - 2050",
        name: "power laces",
        averagerating: 4.7,
    },
    {
        id: "fs - 1987",
        name: "time circuits",
        averagerating: 3.5,
    },
    {
        id: "ac - 2000",
        name: "low voltage reactor",
        averagerating: 3.9,
    },
    {
        id: "jj - 1969",
        name: "warp equalizer",
        averagerating: 5.0,
    },
];

const productList = document.querySelector("#product-list");

function loadOption(product) {
    const option = document.createElement("option");

    option.textContent = product.name;
    option.value = product.id;
    productList.append(option);
}

products.forEach((product) => {
    loadOption(product);
});
