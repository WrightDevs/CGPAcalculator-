document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements (same as before)
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  const addCourseBtn = document.getElementById("add-course");
  const coursesList = document.getElementById("courses-list");
  const calculateGpaBtn = document.getElementById("calculate-gpa");
  const resetGpaBtn = document.getElementById("reset-gpa");
  const gpaResult = document.getElementById("gpa-result");
  const totalCredits = document.getElementById("total-credits");
  
  const addSemesterBtn = document.getElementById("add-semester");
  const semestersList = document.getElementById("semesters-list");
  const calculateCgpaBtn = document.getElementById("calculate-cgpa");
  const resetCgpaBtn = document.getElementById("reset-cgpa");
  const cgpaResult = document.getElementById("cgpa-result");
  const totalCgpaCredits = document.getElementById("total-cgpa-credits");
  
  // FUTO Grading System (5-point scale)
  const futoGradeMap = {
    "A": 5.0,
    "B": 4.0,
    "C": 3.0,
    "D": 2.0,
    "E": 1.0,
    "F": 0.0,
  };
  
  // Class of Degree Classification
  const classOfDegree = (cgpa) => {
    if (cgpa >= 4.5) return "First Class (1st)";
    if (cgpa >= 3.5) return "Second Class Upper (2:1)";
    if (cgpa >= 2.4) return "Second Class Lower (2:2)";
    if (cgpa >= 1.5) return "Third Class (3rd)";
    if (cgpa >= 1.0) return "Pass";
    return "Fail";
  };
  
  // Tab switching (same as before)
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`${tabId}-tab`).classList.add("active");
    });
  });
  
  // Add course row (updated for FUTO grades)
  addCourseBtn.addEventListener("click", () => {
    const courseRow = document.createElement("div");
    courseRow.className = "course-row";
    courseRow.innerHTML = `
      <input type="text" class="course-name" placeholder="Course name">
      <input type="number" class="course-credits" placeholder="Units" min="0" step="1">
      <select class="course-grade">
        ${Object.keys(futoGradeMap)
          .map((grade) => `<option value="${grade}">${grade} (${futoGradeMap[grade]})</option>`)
          .join("")}
      </select>
      <button class="btn-remove" title="Remove course">×</button>
    `;
    coursesList.appendChild(courseRow);
    courseRow.querySelector(".btn-remove").addEventListener("click", () => courseRow.remove());
  });
  
  // Add semester row (same as before)
  addSemesterBtn.addEventListener("click", () => {
    const semesterRow = document.createElement("div");
    semesterRow.className = "semester-row";
    semesterRow.innerHTML = `
      <input type="text" class="semester-name" placeholder="Semester name">
      <input type="number" class="semester-credits" placeholder="Credits" min="0" step="1">
      <input type="number" class="semester-gpa" placeholder="GPA" min="0" max="5.0" step="0.01">
      <button class="btn-remove" title="Remove semester">×</button>
    `;
    semestersList.appendChild(semesterRow);
    semesterRow.querySelector(".btn-remove").addEventListener("click", () => semesterRow.remove());
  });
  
  // Calculate GPA (updated for FUTO)
  calculateGpaBtn.addEventListener("click", () => {
    const courseRows = document.querySelectorAll(".course-row");
    let totalPoints = 0;
    let credits = 0;
    
    courseRows.forEach((row) => {
      const courseCredits = Number(row.querySelector(".course-credits").value) || 0;
      const courseGrade = row.querySelector(".course-grade").value;
      if (courseCredits > 0 && courseGrade) {
        totalPoints += courseCredits * futoGradeMap[courseGrade];
        credits += courseCredits;
      }
    });
    
    if (credits > 0) {
      const gpa = totalPoints / credits;
      gpaResult.textContent = gpa.toFixed(2);
      totalCredits.textContent = credits;
      animateResult(gpaResult);
    } else {
      alert("Add courses with valid units and grades.");
    }
  });
  
  // Calculate CGPA (updated for FUTO)
  calculateCgpaBtn.addEventListener("click", () => {
    const semesterRows = document.querySelectorAll(".semester-row");
    let totalPoints = 0;
    let totalCredits = 0;
    
    semesterRows.forEach((row) => {
      const semesterCredits = Number(row.querySelector(".semester-credits").value) || 0;
      const semesterGpa = Number(row.querySelector(".semester-gpa").value) || 0;
      if (semesterCredits > 0 && semesterGpa > 0) {
        totalPoints += semesterCredits * semesterGpa;
        totalCredits += semesterCredits;
      }
    });
    
    if (totalCredits > 0) {
      const cgpa = totalPoints / totalCredits;
      cgpaResult.textContent = `${cgpa.toFixed(2)} (${classOfDegree(cgpa)})`;
      totalCgpaCredits.textContent = totalCredits;
      animateResult(cgpaResult);
    } else {
      alert("Add semesters with valid credits and GPA.");
    }
  });
  
  // Reset buttons (same as before)
  resetGpaBtn.addEventListener("click", () => {
    coursesList.innerHTML = "";
    gpaResult.textContent = "0.00";
    totalCredits.textContent = "0";
  });
  resetCgpaBtn.addEventListener("click", () => {
    semestersList.innerHTML = "";
    cgpaResult.textContent = "0.00";
    totalCgpaCredits.textContent = "0";
  });
  
  // Helper: Animation
  function animateResult(element) {
    element.classList.add("highlight");
    setTimeout(() => element.classList.remove("highlight"), 1000);
  }
  
  // Initialize with one course and semester
  addCourseBtn.click();
  addSemesterBtn.click();
});