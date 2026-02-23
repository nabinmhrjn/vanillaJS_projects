const studentName = document.getElementById("student-name");
const studentMarks = document.getElementById("student-marks");
const addButton = document.getElementById("add-btn");
const totalStudents = document.getElementById("total-students");
const classAverage = document.getElementById("class-average");
const highestMarks = document.getElementById("highest-marks");
const lowestMarks = document.getElementById("lowest-marks");
const studentBody = document.getElementById("student-body");
const emptyMsg = document.getElementById("empty-msg");

//grade
function getGrade(marks) {
    if (marks >= 90) return { grade: "A", className: "grade-A" };
    if (marks >= 75) return { grade: "B", className: "grade-B" };
    if (marks >= 60) return { grade: "C", className: "grade-C" };
    if (marks >= 45) return { grade: "D", className: "grade-D" };
    return { grade: "F", className: "grade-F" };
}

//row number
function updateRowNumbers() {
    const rows = studentBody.querySelectorAll("tr");
    rows.forEach((row, index) => {
        row.children[0].textContent = index + 1;
    });
}

//update stats
function updateStats() {
    const rows = studentBody.querySelectorAll("tr");

    if (rows.length === 0) {
        totalStudents.textContent = 0;
        classAverage.textContent = 0;
        highestMarks.textContent = 0;
        lowestMarks.textContent = 0;
        emptyMsg.textContent.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

    let total = 0;
    let highest = -Infinity;
    let lowest = Infinity;

    rows.forEach((row) => {
        const marks = Number(row.children[2].textContent);
        total += marks;
        if (marks > highest) highest = marks;
        if (marks < lowest) lowest = marks;
    });

    totalStudents.textContent = rows.length;
    classAverage.textContent = (total / rows.length).toFixed(1);
    highestMarks.textContent = highest;
    lowestMarks.textContent = lowest;
}

//add students to dom
function addStudents(name, marks) {
    const { grade, className } = getGrade(marks);

    const tr = document.createElement("tr");
    tr.innerHTML = `
         <td>#</td>
        <td>${name}</td>
        <td>${marks}</td>
        <td><span class="grade-badge ${className}">${grade}</span></td>
        <td><button class="delete-btn">Delete</button></td>
    `;
    studentBody.appendChild(tr);

    updateRowNumbers();
    updateStats();
}

//save to local storage
function saveStudents() {
    const students = [];
    const rows = studentBody.querySelectorAll("tr");
    rows.forEach(row => {
        students.push({
            name: row.children[1].textContent,
            marks: Number(row.children[2].textContent)
        });
    });
    localStorage.setItem("students", JSON.stringify(students));
};

//load from local storage
function loadStudents() {
    const students = JSON.parse(localStorage.getItem("students")) || [];
    students.forEach(student => {
        addStudents(student.name, student.marks);
    });
}

//add button
addButton.addEventListener("click", function () {
    const name = studentName.value.trim();
    const marks = Number(studentMarks.value);

    if (name === "") {
        alert("Please enter a student name");
        return;
    }
    if (!isNaN(name)) {
        alert("Student name should not be a number");
        return;
    }
    if (studentMarks.value === "" || marks < 0 || marks > 100) {
        alert("Please enter valid marks between 0 and 100");
        return;
    }

    addStudents(name, marks);
    saveStudents();

    studentName.value = "";
    studentMarks.value = "";
});

//delete button
studentBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
        e.target.closest("tr").remove();
        updateRowNumbers();
        updateStats();
        saveStudents();
    }
});

loadStudents();