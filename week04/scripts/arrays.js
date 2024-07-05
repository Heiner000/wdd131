/*

let new_array = arr.map(function callback( currentValue[, index[, array]]) {
    // return element for new_array
}[, thisArg])

*/

//  arrays.js
const steps = ["one", "two", "three"];
const listTemplate = (step) => {
  return `<li>${step}</li>`;
};
const stepsHtml = steps.map(listTemplate);
// document.querySelector("#myList").innerHTML = stepsHtml.join();

let grades = ["A", "B", "A"];

function convertGradeToPoints(grade) {
  let points = 0;
  if (grade === "A") {
    points = 4;
  } else if (grade === "B") {
    points = 3;
  } else if (grade === "C") {
    points = 2;
  } else if (grade === "D") {
    points = 1;
  } else {
    return "oops";
  }
  return points;
}
const gpaPoints = grades.map(convertGradeToPoints);

const pointsTotal = gpaPoints.reduce((total, item) => total + item);

const gpa = pointsTotal / gpaPoints.length;

const fruits = ["watermelon", "peach", "apple", "tomato", "grape"];

const longFruits = fruits.filter((fruit) => fruit.length > 6);

let nums = [12, 34, 21, 54];
const luckyNumber = 21;
let luckyIndex = nums.indexOf(luckyNumber);
console.log(luckyIndex);
