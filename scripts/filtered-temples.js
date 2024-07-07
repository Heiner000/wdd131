const mainnav = document.querySelector(".navigation");
const hambutton = document.querySelector("#menu");

hambutton.addEventListener("click", (e) => {
  e.preventDefault();
  mainnav.classList.toggle("show");
  hambutton.classList.toggle("show");
});

const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg",
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg",
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg",
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg",
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg",
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg",
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg",
  },
  {
    templeName: "São Paulo Brazil",
    location: "São Paulo, Brazil",
    dedicated: "1978, October, 30",
    area: 59246,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/sao-paulo-brazil/400x250/sao-paulo-brazil-temple-lds-246609-wallpaper.jpg",
  },
  {
    templeName: "Mesa Arizona",
    location: "Mesa, Arizona, United States",
    dedicated: "1927, October, 23",
    area: 113916,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mesa-arizona/400x250/mesa_arizona_temple_main.jpeg",
  },
  {
    templeName: "Star Valley Wyoming",
    location: "Afton, Wyoming, United States",
    dedicated: "2016, October, 30",
    area: 18609,
    imageUrl:
      "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/star-valley-wyoming/400x250/star-valley-wyoming-temple-1795141-wallpaper.jpg",
  },
];

const homeLink = document.querySelector("#home");
const oldLink = document.querySelector("#old");
const newLink = document.querySelector("#new");
const largeLink = document.querySelector("#large");
const smallLink = document.querySelector("#small");
const headerTitle = document.querySelector("main h2");

homeLink.addEventListener("click", () => {
  createTempleCard(temples);
  toggleActive(homeLink);
  updateHeader("Home");
});

oldLink.addEventListener("click", () => {
  createTempleCard(
    temples.filter(
      (temple) =>
        new Date(temple.dedicated.replace(/,/g, "")) < new Date("1900-01-01")
    )
  );
  toggleActive(oldLink);
  updateHeader("Old");
});

newLink.addEventListener("click", () => {
  createTempleCard(
    temples.filter(
      (temple) =>
        new Date(temple.dedicated.replace(/,/g, "")) > new Date("2000-01-01")
    )
  );
  toggleActive(newLink);
  updateHeader("New");
});

largeLink.addEventListener("click", () => {
  createTempleCard(temples.filter((temple) => temple.area > 90000));
  toggleActive(largeLink);
  updateHeader("Large");
});

smallLink.addEventListener("click", () => {
  createTempleCard(temples.filter((temple) => temple.area < 10000));
  toggleActive(smallLink);
  updateHeader("Small");
});

function createTempleCard(filteredTemples) {
  document.querySelector("#cards-container").innerHTML = "";
  filteredTemples.forEach((temple) => {
    let card = document.createElement("section");
    let name = document.createElement("h3");
    let location = document.createElement("p");
    let dedication = document.createElement("p");
    let area = document.createElement("p");
    let img = document.createElement("img");

    name.textContent = temple.templeName;
    location.innerHTML = `<span class="label">Location:</span> ${temple.location}`;
    dedication.innerHTML = `<span class="label">Dedicated:</span> ${temple.dedicated}`;
    area.innerHTML = `<span class="label">Size:</span> ${temple.area} sq ft`;
    img.setAttribute("src", temple.imageUrl);
    img.setAttribute("alt", `${temple.templeName} Temple`);
    img.setAttribute("loading", "lazy");

    card.className = "temple-card";
    card.appendChild(name);
    card.appendChild(location);
    card.appendChild(dedication);
    card.appendChild(area);
    card.appendChild(img);

    document.querySelector("#cards-container").appendChild(card);
  });
}

function toggleActive(element) {
  document.querySelectorAll(".navigation a").forEach((link) => {
    link.classList.remove("active");
  });
  element.classList.add("active");
}

function updateHeader(title) {
  document.querySelector("main h2").textContent = title;
}

createTempleCard(temples);
