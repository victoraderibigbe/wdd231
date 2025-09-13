const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const display = document.querySelector("article");

gridButton.addEventListener("click", () => {
  listButton.classList.remove("active");
  gridButton.classList.add("active");
  display.classList.add("grid");
  display.classList.remove("list");
  displayGrid();
});

listButton.addEventListener("click", () => {
  gridButton.classList.remove("active");
  listButton.classList.add("active");
  display.classList.add("list");
  display.classList.remove("grid");
  displayList();
});

window.addEventListener("load", () => {
  if (display.classList.contains("grid")) {
    displayGrid();
    return;
  }

  displayList();
});

const displayGrid = async () => {
  const members = await fetchMembers();

  display.innerHTML = "";
  members.forEach((member) => {
    const card = document.createElement("section");
    card.classList.add("card");

    const logoContainer = document.createElement("div");
    logoContainer.classList.add("logo-container");

    const logo = document.createElement("img");
    logo.src = member.image;
    logo.alt = `${member.name} logo`;
    logo.width = "100";
    logoContainer.appendChild(logo);
    card.appendChild(logoContainer);

    const name = document.createElement("h2");
    name.textContent = member.name;
    card.appendChild(name);

    const address = document.createElement("p");
    address.textContent = member.address;
    card.appendChild(address);

    const phone = document.createElement("p");
    phone.textContent = member.phone;
    card.appendChild(phone);

    const website = document.createElement("a");
    website.href = member.website;
    website.textContent = "Visit Website";
    website.target = "_blank";
    card.appendChild(website);

    display.appendChild(card);
  });
};

const displayList = async () => {
  const members = await fetchMembers();

  display.innerHTML = "";
  members.forEach((member) => {
    const card = document.createElement("section");
    card.classList.add("card");

    const name = document.createElement("h2");
    name.textContent = member.name;
    card.appendChild(name);

    const website = document.createElement("a");
    website.href = member.website;
    website.target = "_blank";
    const icon = document.createElement("img");
    icon.src = "images/external-link.png";
    icon.alt = "External link icon";
    icon.width = "20";
    website.appendChild(icon);
    card.appendChild(website);

    display.appendChild(card);
  });
};

const fetchMembers = async () => {
  try {
    const response = await fetch("data/members.json");
    if (!response.ok) {
      throw new Error("Error fetching members data");
    }
    const members = await response.json();
    return members;
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};
