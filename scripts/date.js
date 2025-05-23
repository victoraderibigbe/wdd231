const currentYear = document.querySelector("#currentYear");
const lastModified = document.querySelector("#lastModified");

const today = new Date();

currentYear.innerText = today.getFullYear();

lastModified.innerText = document.lastModified;
