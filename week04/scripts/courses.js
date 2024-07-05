// courses.js
const aCourse = {
  code: "CSE121b",
  name: "Javascript Language",
  section: [
    {
      sectionNum: 1,
      roomNum: "STC 353",
      enrolled: 26,
      days: "TTh",
      instructor: "Bro T",
    },
    {
      sectionNum: 2,
      roomNum: "STC 347",
      enrolled: 28,
      days: "TTh",
      instructor: "Sis A",
    },
  ],
  updateEnrollment: function (sectionNum, add = true) {
    const sectionIndex = this.sections.findIndex(
      (section) => section.sectionNum == sectionNum
    );
    if (sectionIndex !== -1) {
      if (add) {
        this.sections[sectionIndex].enrolled++;
      } else {
        this.sections[sectionIndex].enrolled--;
      }
      renderSections(this.sections);
    }
  },
};

function setNameAndNumber(course) {
  const courseName = document.getElementById("courseName");
  const courseCode = document.getElementById("courseCode");
  courseName.textContent = course.name;
  courseCode.textContent = course.code;
}

function renderSections(section) {
  const html = sections.map(
    (section) => `<tr>
    <td>${section.sectionNum}</td>
    <td>${section.roomNum}</td>
    <td>${section.enrolled}</td>
    <td>${section.days}</td>
    <td>${section.instructor}</td>
    </tr>`
  );
  document.querySelector("#sections").innerHTML = html.join("");
}

document.querySelector("#enrollStudent").addEventListener("click", (e) => {
  const sectionNumInput = document.getElementById("sectionNumber");
  const sectionNum = parseInt(sectionNumInput.value);
  aCourse.enrollStudent(sectionNum);
  sectionNumInput.value = "";
});

document.querySelector("#dropStudent").addEventListener("click", (e) => {
  const sectionNumInput = document.getElementById("sectionNumber");
  const sectionNum = parseInt(sectionNumInput.value);
  aCourse.dropStudent(sectionNum);
  sectionNumInput.value = "";
});

setCourseInfo(aCourse);
renderSections(aCourse.sections);
