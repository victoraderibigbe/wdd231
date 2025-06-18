const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
    technology: ["HTML", "CSS"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
    technology: ["Python"],
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
    technology: ["C#"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

const displayCourses = document.querySelector("#displayCourses");
const courseDetails = document.querySelector("#course-details");

const getTotal = (total, credit) => {
  return total + credit;
};

if (courses.length <= 0) {
  const textElement = document.createElement("p");
  textElement.textContent = "No courses found";
  displayCourses.appendChild(textElement);
} else {
  window.addEventListener("load", () => {
    displayCourses.innerText = "";

    const textElement = document.createElement("p");
    const credits = courses.map((course) => course.credits);
    totalCredit = credits.reduce(getTotal, 0);
    textElement.textContent = `The total credits of course listed below is ${totalCredit}`;
    displayCourses.append(textElement);

    const courseCardsContainer = document.createElement("div");
    courseCardsContainer.classList.add("courseCardsContainer");

    courses.map((course) => {
      const buttonElement = document.createElement("button");
      buttonElement.textContent = `${course.subject} ${course.number}`;

      if (course.completed) {
        buttonElement.classList.add("complete");
      } else {
        buttonElement.classList.add("incomplete");
      }

      buttonElement.addEventListener("click", () => {
        displayCourseDetails(course);
      });

      courseCardsContainer.appendChild(buttonElement);
    });

    displayCourses.appendChild(courseCardsContainer);
  });

  document.getElementById("allButton").addEventListener("click", () => {
    displayCourses.innerText = "";

    const textElement = document.createElement("p");
    const credits = courses.map((course) => course.credits);
    totalCredit = credits.reduce(getTotal, 0);
    textElement.textContent = `The total credits of course listed below is ${totalCredit}`;
    displayCourses.append(textElement);

    const courseCardsContainer = document.createElement("div");
    courseCardsContainer.classList.add("courseCardsContainer");

    courses.map((course) => {
      const buttonElement = document.createElement("button");
      buttonElement.textContent = `${course.subject} ${course.number}`;

      if (course.completed) {
        buttonElement.classList.add("complete");
      } else {
        buttonElement.classList.add("incomplete");
      }

      buttonElement.addEventListener("click", () => {
        displayCourseDetails(course);
      });

      courseCardsContainer.appendChild(buttonElement);
    });

    displayCourses.appendChild(courseCardsContainer);
  });

  document.getElementById("cseButton").addEventListener("click", () => {
    displayCourses.innerText = "";

    const cseCourses = courses.filter(
      (course) => course.subject.toLowerCase() === "cse"
    );

    const textElement = document.createElement("p");
    const credits = cseCourses.map((course) => course.credits);
    totalCredit = credits.reduce(getTotal, 0);
    textElement.textContent = `The total credits of course listed below is ${totalCredit}`;
    displayCourses.append(textElement);

    const courseCardsContainer = document.createElement("div");
    courseCardsContainer.classList.add("courseCardsContainer");

    cseCourses.map((course) => {
      const buttonElement = document.createElement("button");
      buttonElement.textContent = `${course.subject} ${course.number}`;

      if (course.completed) {
        buttonElement.classList.add("complete");
      } else {
        buttonElement.classList.add("incomplete");
      }

      buttonElement.addEventListener("click", () => {
        displayCourseDetails(course);
      });

      courseCardsContainer.appendChild(buttonElement);
    });

    displayCourses.appendChild(courseCardsContainer);
  });

  document.getElementById("wddButton").addEventListener("click", () => {
    displayCourses.innerText = "";

    const wddCourses = courses.filter(
      (course) => course.subject.toLowerCase() === "wdd"
    );

    const textElement = document.createElement("p");
    const credits = wddCourses.map((course) => course.credits);
    totalCredit = credits.reduce(getTotal, 0);
    textElement.textContent = `The total credits of course listed below is ${totalCredit}`;
    displayCourses.append(textElement);

    const courseCardsContainer = document.createElement("div");
    courseCardsContainer.classList.add("courseCardsContainer");

    wddCourses.map((course) => {
      const buttonElement = document.createElement("button");
      buttonElement.textContent = `${course.subject} ${course.number}`;

      if (course.completed) {
        buttonElement.classList.add("complete");
      } else {
        buttonElement.classList.add("incomplete");
      }

      buttonElement.addEventListener("click", () => {
        displayCourseDetails(course);
      });

      courseCardsContainer.appendChild(buttonElement);
    });

    displayCourses.appendChild(courseCardsContainer);
  });
}

const displayCourseDetails = (course) => {
  courseDetails.innerHTML = "";
  courseDetails.innerHTML = `
    <button id="closeModal">❌</button>
    <h2>${course.subject} ${course.number}</h2>
    <h3>${course.title}</h3>
    <p><strong>Credits</strong>: ${course.credits}</p>
    <p><strong>Certificate</strong>: ${course.certificate}</p>
    <p>${course.description}</p>
    <p><strong>Technologies</strong>: ${course.technology.join(", ")}</p>
  `;
  courseDetails.showModal();

  document.getElementById("closeModal").addEventListener("click", () => {
    courseDetails.close();
  });
};
