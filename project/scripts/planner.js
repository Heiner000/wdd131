document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("planner-form");
    const generatedPlan = document.getElementById("generated-plan");
    const planContent = document.getElementById("plan-content");
    const saveButton = document.getElementById("save-plan");
    const printButton = document.getElementById("print-plan");

    // Populate form
    populateFormFields();

    // Form submission
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        generateWorkoutPlan()
            .then((plan) => {
                displayWorkoutPlan(plan);
                generatedPlan.style.display = "block";
            })
            .catch((err) => {
                console.error("Error generating workout plan: ", err);
            });
    });

    // save plan
    saveButton.addEventListener("click", () => {
        savePlan();
    });

    // print Plan
    printButton.addEventListener("click", () => {
        window.print();
    });
});

function populateFormFields() {
    const equipmentFieldset = document.querySelector(
        "#planner-form fieldset:nth-of-type(1)"
    );
    const muscleGroupFieldset = document.querySelector(
        "#planner-form fieldset:nth-of-type(4)"
    );

    fetch("data/exercises.json")
        .then((response) => response.json())
        .then((data) => {
            const uniqueEquipment = new Set();
            const uniqueMuscles = new Set();

            data.exercises.forEach((exercise) => {
                uniqueEquipment.add(exercise.equipment);
                exercise.primaryMuscles.forEach((muscle) =>
                    uniqueMuscles.add(muscle)
                );
                exercise.secondaryMuscles.forEach((muscle) =>
                    uniqueMuscles.add(muscle)
                );
            });

            populateCheckboxes(
                equipmentFieldset,
                [...uniqueEquipment].sort(),
                "equipment"
            );
            populateCheckboxes(
                muscleGroupFieldset,
                [...uniqueMuscles].sort(),
                "muscle"
            );
        })
        .catch((error) => {
            console.error("Error fetching exercise data:", error);
            equipmentFieldset.innerHTML =
                "<p>Error loading options. Please try again later.</p>";
            muscleGroupFieldset.innerHTML =
                "<p>Error loading options. Please try again later.</p>";
        });
}

function populateCheckboxes(fieldset, items, type) {
    items.forEach((item) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = type;
        checkbox.value = item;
        checkbox.id = `${type}-${item.toLowerCase().replace(/\s+/g, "-")}`;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));

        fieldset.appendChild(label);
    });
}

function generateWorkoutPlan() {
    const equipment = getSelectedValues("equipment");
    const fitnessLevel = document.getElementById("fitness-level").value;
    const duration = parseInt(
        document.getElementById("workout-duration").value
    );
    const targetMuscles = getSelectedValues("muscle");

    // fetch exercises
    return fetch("data/exercises.json")
        .then((response) => response.json())
        .then((data) => {
            const exercises = data.exercises;

            // filter exercises based on user input
            const filteredExercises = exercises.filter(
                (exercise) =>
                    equipment.includes(exercise.equipment) &&
                    exercise.level === fitnessLevel &&
                    targetMuscles.some(
                        (muscle) =>
                            exercise.primaryMuscles.includes(muscle) ||
                            exercise.secondaryMuscles.includes(muscle)
                    )
            );

            // ************* determine the number of exercises based on duration
            const exerciseCount = Math.floor(duration / 15); // Assuming each exercise takes about 15 minutes

            // select exercises
            const selectedExercises = selectExercises(
                filteredExercises,
                exerciseCount,
                targetMuscles
            );

            // generate plan w/ progressive overload
            const plan = generatePlanWithProgressiveOverload(
                selectedExercises,
                fitnessLevel
            );
            return plan;
        });
}

function getSelectedValues(name) {
    return Array.from(
        document.querySelectorAll(`input[name="${name}"]:checked`)
    ).map((input) => input.value);
}

function selectExercises(exercises, count, targetMuscles) {
    let selected = [];
    let remainingMuscles = [...targetMuscles];

    while (selected.length < count && exercises.length > 0) {
        // prioritize exercises for remaining muscles
        let priorityExercises = exercises.filter((ex) =>
            ex.primaryMuscles.some((muscle) =>
                remainingMuscles.includes(muscle)
            )
        );

        if (priorityExercises.length === 0) {
            priorityExercises = exercises;
        }

        const randomIndex = Math.floor(
            Math.random() * priorityExercises.length
        );
        const exercise = priorityExercises[randomIndex];

        selected.push(exercise);
        exercises = exercises.filter((ex) => ex !== exercise);

        // update remaining muscles
        remainingMuscles = remainingMuscles.filter(
            (muscle) => !exercise.primaryMuscles.includes(muscle)
        );

        if (remainingMuscles.length === 0) {
            remainingMuscles = [...targetMuscles];
        }
    }
    return selected;
}

function generatePlanWithProgressiveOverload(exercises, fitnessLevel) {
    return exercises.map((exercise) => {
        let sets, reps;
        switch (fitnessLevel) {
            case "beginner":
                sets = 3;
                reps = "8 - 12";
                break;
            case "intermediate":
                sets = 4;
                reps = "6 - 10";
                break;
            case "advanced":
                sets = 5;
                reps = "4 - 8";
                break;
        }

        return {
            name: exercise.name,
            equipment: exercise.equipment,
            sets: sets,
            reps: reps,
            progressionStrategy: getProgressionStrategy(exercise, fitnessLevel),
        };
    });
}

function getProgressionStrategy(exercise, fitnessLevel) {
    // ********* simple strategy, may need to improve
    switch (fitnessLevel) {
        case "beginner":
            return "Increase weight by 2.5-5% or 1-2 reps each week.";
        case "intermediate":
            return "Increase weight by 5-7.5% or 2-3 reps every 1-2 weeks.";
        case "advanced":
            return "Increase weight by 2.5-5% or 1-2 reps every 2-3 weeks";
    }
}

function displayWorkoutPlan(plan) {
    if (!Array.isArray(plan)) {
        console.error("Invalid plan format: ", plan);
        console.log("Error in the displayWorkoutPlan function");
        return;
    }
    const planContent = document.getElementById("plan-content");
    planContent.innerHTML = ""; // clear previous content

    // create a title for the plan
    const title = document.createElement("h3");
    title.textContent = "Your Personalized Generated Workout Plan";
    planContent.appendChild(title);

    // create a table for the exercises
    const table = document.createElement("table");
    table.innerHTML = `
    <thead>
        <tr>
            <th>Exercise</th>
            <th>Equipment</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Progression Strategy</th>
        </tr>
    </thead>
    <tbody>
    </tbody>`;

    // populate the table with exercises
    const tbody = table.querySelector("tbody");
    plan.forEach((exercise) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td data-label="Exercise">${exercise.name}</td>
            <td data-label="Equipment">${exercise.equipment}</td>
            <td data-label="Sets">${exercise.sets}</td>
            <td data-label="Reps">${exercise.reps}</td>
            <td data-label="Progression">${exercise.progressionStrategy}</td>
            `;
        tbody.appendChild(row);
    });

    planContent.appendChild(table);

    // add general workout advice
    const advice = document.createElement("div");
    advice.classList.add("workout-advice");
    advice.innerHTML = `
        <h4>General Workout Advice:</h4>
        <ul>
            <li>Warm up properly before starting your workout.</li>
            <li>Stay hydrated throughout your session.</li>
            <li>Focus on proper form to prevent injuries and maximize results.</li>
            <li>Cool down and stretch after your workout.</li>
            <li>Rest adequately between workouts to allow for recovery.</li>
        </ul>
    `;
    planContent.appendChild(advice);

    // add a note about progressive overload
    const overloadNote = document.createElement("p");
    overloadNote.classList.add("overload-note");
    overloadNote.textContent =
        "Remember to apply the progression strategy to each session.";
    planContent.appendChild(overloadNote);
}

function savePlan() {
    // svae the current plan to localStorage
}
