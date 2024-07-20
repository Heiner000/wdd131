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
    return new Promise((resolve, reject) => {
        // retrieve user inputs
        const equipment = getSelectedEquipment();
        const fitnessLevel = document.getElementById("fitness-level").value;
        const duration = parseInt(
            document.getElementById("workout-duration").value
        );
        const targetMuscles = getSelectedMuscles();

        console.log("~~ USER INPUTS:", {
            equipment,
            fitnessLevel,
            duration,
            targetMuscles,
        });

        // fetch exercise data
        fetch("data/exercises.json")
            .then((response) => response.json())
            .then((data) => {
                console.log("~~ FETCHED EXERCISE DATA: ", data);

                // filter exercises based on user inputs
                let filteredExercises = filterExercises(
                    data.exercises,
                    equipment,
                    fitnessLevel,
                    targetMuscles
                );
                console.log("~~ FILTERED EXERCISES: ", filteredExercises);

                // group exercises by muscle
                let groupedExercises =
                    groupExercisesByMuscle(filteredExercises);
                console.log("~~ GROUPED EXERCISES: ", groupedExercises);

                // select exercises for the workout
                let selectedExercises = selectExercises(
                    groupedExercises,
                    duration,
                    fitnessLevel
                );
                console.log("~~ SELECTED EXERCISES: ", selectedExercises);

                // generate the workout plan
                let workoutPlan = createWorkoutPlan(
                    selectedExercises,
                    fitnessLevel
                );
                console.log("~~ GENERATED WORKOUT PLAN: ", workoutPlan);

                resolve(workoutPlan);
            })
            .catch((err) => reject(err));
    });
}

// get selected equipment from form
function getSelectedEquipment() {
    const equipmentCheckboxes = document.querySelectorAll(
        'input[name="equipment"]:checked'
    );
    const selectedEquipment = Array.from(equipmentCheckboxes).map(
        (checkbox) => checkbox.value
    );

    // if no equipment selected, default to bodyweight exercises
    if (selectedEquipment.length === 0) {
        selectedEquipment.push("bodyweight");
    }
    return selectedEquipment;
}

// get selected muscle groups from the form
function getSelectedMuscles() {
    const muscleCheckboxes = document.querySelectorAll(
        "input[name='muscle']:checked"
    );
    return Array.from(muscleCheckboxes).map((checkbox) => checkbox.value);
}

// filter exercises
function filterExercises(exercises, equipment, fitnessLevel, targetMuscles) {
    return exercises.filter(
        (exercise) =>
            equipment.includes(exercise.equipment) &&
            exercise.level === fitnessLevel &&
            targetMuscles.some(
                (muscle) =>
                    exercise.primaryMuscles.includes(muscle) ||
                    exercise.secondaryMuscles.includes(muscle)
            )
    );
}

// group exercises by primary muscle
function groupExercisesByMuscle(exercises) {
    return exercises.reduce((groups, exercise) => {
        const primaryMuscle = exercise.primaryMuscles[0];
        if (!groups[primaryMuscle]) {
            groups[primaryMuscle] = [];
        }
        groups[primaryMuscle].push(exercise);
        return groups;
    }, {});
}

// select exercises based on duration & fitness level
function selectExercises(groupedExercises, duration, fitnessLevel) {
    // target all selected muscle groups
    const exercisesPerMuscle = determineExercisesPerMuscle(
        duration,
        fitnessLevel
    );
    const selectedExercises = [];
    const muscleGroups = Object.keys(groupedExercises);

    // ensure at least 1 exercise per selected muscle group
    muscleGroups.forEach((muscle) => {
        const muscleExercises = groupedExercises[muscle];
        const exerciseCount = Math.min(
            exercisesPerMuscle,
            muscleExercises.length
        );

        for (let i = 0; i < exerciseCount; i++) {
            const randomIndex = Math.floor(
                Math.random() * muscleExercises.length
            );
            selectedExercises.push(muscleExercises[randomIndex]);
            muscleExercises.splice(randomIndex, 1);
        }
    });

    // if we have mroe time, add more exercises
    while (
        selectedExercises.length < duration / 5 &&
        muscleGroups.some((muscle) => groupedExercises[muscle].length > 0)
    ) {
        const availableMuscles = muscleGroups.filter(
            (muscle) => groupedExercises[muscle].length > 0
        );
        const randomMuscle =
            availableMuscles[
                Math.floor(Math.random() * availableMuscles.length)
            ];
        const randomIndex = Math.floor(
            Math.random() * groupedExercises[randomMuscle].length
        );

        selectExercises.push(groupedExercises[randomMuscle][randomIndex]);
        groupedExercises[randomMuscle].splice(randomIndex, 1);
    }
    return selectExercises;
}

function determineExercisesPerMuscle(duration, fitnessLevel) {
    // base number of exercises per muscle group
    let baseExercises;
    switch (fitnessLevel) {
        case "beginner":
            baseExercises = 1;
            break;
        case "intermediate":
            baseExercises = 2;
            break;
        case "advanced":
            baseExercises = 3;
            break;
        default:
            baseExercises = 1;
    }

    // adjust based on workout duration
    if (duration <= 30) {
        return Math.max(1, baseExercises - 1);
    } else if (duration >= 60) {
        return baseExercises + 1;
    } else {
        console.log("~~ BASE # EXERCISES PER MUSCLE: ", baseExercises);
        return baseExercises;
    }
}

// compile the workout plan
function createWorkoutPlan(selectedExercises, fitnessLevel) {
    // plan the exercises, sets, reps, rest, and progression
}

// determine the number of sets
function determineSets(fitnessLevel) {
    // base it on fitness level? category?
}

// determine the number of reps
function determineReps(fitnessLevel, category) {
    // reps based on fitness level & exercise category
}

// determine the rest periods
function determineRest(fitnessLevel, category) {
    // ****should maybe be based on reps & category?
}

// determine progression strat
function determineProgression(fitnessLevel) {
    // progression based on strategy
}

function savePlan() {
    // svae the current plan to localStorage
}
