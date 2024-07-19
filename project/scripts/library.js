document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector("#exercise-search");
    const equipmentFilter = document.querySelector("#equipment-filter");
    const muscleFilter = document.querySelector("#muscle-filter");
    const exerciseList = document.querySelector("#exercise-list");
    const levelFilter = document.querySelector("#difficulty-filter");
    const modal = document.querySelector("#exercise-modal");
    const modalClose = document.querySelector(".close");

    let exercises = [];
    let currentPage = 1;
    const exercisesPerPage = 11;

    // Fetch exercises from JSON file
    fetch("./data/exercises.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `HTTP error! status: status: ${response.status}`
                );
            }
            return response.json();
        })
        .then((data) => {
            exercises = data.exercises;
            if (!Array.isArray(exercises)) {
                throw new Error("Exercises data is not in the expected format");
            }
            populateFilters();
            loadFromLocalStorage();
            displayExercises(exercises);
        })
        .catch((err) => {
            console.error("Error loading exercises: ", err);
            exerciseList.innerHTML = `<p>Error loading exercises. Please try refreshing the page. If the problem persists, contact the administrator.</p>`;
        });

    // populate filters
    function populateFilters() {
        const equipmentSet = new Set(exercises.map((ex) => ex.equipment));
        const muscleSet = new Set(
            exercises.flatMap((ex) => [
                ...ex.primaryMuscles,
                ...ex.secondaryMuscles,
            ])
        );
        const levelSet = new Set(exercises.map((ex) => ex.level));

        populateFilter(equipmentFilter, equipmentSet);
        populateFilter(muscleFilter, muscleSet);
        populateFilter(levelFilter, levelSet);
    }

    function populateFilter(selectElement, optionsSet) {
        optionsSet.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
        });
    }

    // Display exercises w/ lazy loading
    function displayExercises(filteredExercises) {
        exerciseList.innerHTML = "";
        const start = (currentPage - 1) * exercisesPerPage;
        const end = start + exercisesPerPage;
        const exercisesToShow = filteredExercises.slice(start, end);

        exercisesToShow.forEach((exercise) => {
            const exerciseItem = document.createElement("div");
            exerciseItem.classList.add("exercise-item");
            exerciseItem.innerHTML = `
                <h3>${exercise.name}</h3>
                <p>Equipment: ${exercise.equipment}</p>
                <p>Primary: ${exercise.primaryMuscles.join(", ")}</p>
                <p>Level: ${exercise.level}</p>`;

            exerciseItem.addEventListener("click", () =>
                showExerciseDetails(exercise)
            );
            exerciseList.appendChild(exerciseItem);
        });

        if (end < filteredExercises.length) {
            const loadMoreButton = document.createElement("button");
            loadMoreButton.textContent = "Load More";
            loadMoreButton.setAttribute("class", "button");
            loadMoreButton.addEventListener("click", () => {
                currentPage++;
                displayExercises(filteredExercises);
            });
            exerciseList.appendChild(loadMoreButton);
        }
    }

    // Filter exercises
    function filterExercises() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedEquipment = equipmentFilter.value;
        const selectedMuscle = muscleFilter.value;
        const selectedLevel = levelFilter.value;

        const filteredExercises = exercises.filter(
            (ex) =>
                ex.name.toLowerCase().includes(searchTerm) &&
                (selectedEquipment === "" ||
                    ex.equipment === selectedEquipment) &&
                (selectedMuscle === "" ||
                    ex.primaryMuscles.includes(selectedMuscle) ||
                    ex.secondaryMuscles.includes(selectedMuscle)) &&
                (selectedLevel === "" || ex.level === selectedLevel)
        );

        currentPage = 1;
        displayExercises(filteredExercises);
        saveToLocalStorage();
    }

    // show exercise details in modal
    function showExerciseDetails(exercise) {
        document.getElementById("modal-exercise-name").textContent =
            exercise.name;
        document.getElementById(
            "modal-level"
        ).textContent = `Level: ${exercise.level}`;
        document.getElementById(
            "modal-equipment"
        ).textContent = `Equipment: ${exercise.equipment}`;
        document.getElementById(
            "modal-primary-muscles"
        ).textContent = `Primary Muscles: ${exercise.primaryMuscles.join(
            ", "
        )}`;
        document.getElementById(
            "modal-secondary-muscles"
        ).textContent = `Secondary Muscles: ${exercise.secondaryMuscles.join(
            ", "
        )}`;

        const instructionsList = document.getElementById("modal-instructions");
        instructionsList.innerHTML = "";
        exercise.instructions.forEach((instruction) => {
            const li = document.createElement("li");
            li.textContent = instruction;
            instructionsList.appendChild(li);
        });

        modal.style.display = "block";
    }

    // Save filters to localStorage
    function saveToLocalStorage() {
        localStorage.setItem("exerciseSearch", searchInput.value);
        localStorage.setItem("equipmentFilter", equipmentFilter.value);
        localStorage.setItem("muscleFilter", muscleFilter.value);
        localStorage.setItem("levelFilter", levelFilter.value);
    }

    // Load filters from localStorage
    function loadFromLocalStorage() {
        searchInput.value = localStorage.getItem("exerciseSearch") || "";
        equipmentFilter.value = localStorage.getItem("equipmentFilter") || "";
        muscleFilter.value = localStorage.getItem("muscleFilter") || "";
        levelFilter.value = localStorage.getItem("levelFilter") || "";
    }

    // Event listeners
    searchInput.addEventListener("input", filterExercises);
    equipmentFilter.addEventListener("change", filterExercises);
    muscleFilter.addEventListener("change", filterExercises);
    levelFilter.addEventListener("change", filterExercises);

    modalClose.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
