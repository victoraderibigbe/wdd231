const businessCards = document.querySelector(".business-cards");

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

const displayMembers = async () => {
  const members = await fetchMembers();

  //   Display the first three gold or silver members
  const featuredMembers = members.filter(
    (member, index) =>
      (member.membership_level === 2 || member.membership_level === 3) &&
      index <= 3
  );

  featuredMembers.forEach((member) => {
    const businessCard = document.createElement("div");
    businessCard.classList.add("business-card");

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("business-card-header");

    const businessName = document.createElement("p");
    businessName.textContent = member.name;
    cardHeader.appendChild(businessName);

    const businessLine = document.createElement("small");
    businessLine.textContent = member.address;
    cardHeader.appendChild(businessLine);

    businessCard.appendChild(cardHeader);

    const cardBody = document.createElement("div");
    cardBody.classList.add("business-card-body");

    const cardImage = document.createElement("div");
    cardImage.classList.add("card-image");

    const businessLogo = document.createElement("img");
    businessLogo.src = member.image;
    businessLogo.alt = member.name;
    businessLogo.width = 80;
    cardImage.appendChild(businessLogo);

    cardBody.appendChild(cardImage);

    const cardContent = document.createElement("div");
    cardContent.classList.add("card-content");

    const phone = document.createElement("p");
    phone.innerHTML = `<strong>Phone:</strong> ${member.phone}`;
    cardContent.appendChild(phone);

    const website = document.createElement("a");
    website.innerHTML = `<strong>Website:</strong> ${member.website}`;
    website.href = member.website;
    website.target = "_blank";
    cardContent.appendChild(website);

    const level = document.createElement("p");
    level.innerHTML = `<strong>Membership Level:</strong> ${member.membership_level}`;
    cardContent.appendChild(level);

    cardBody.appendChild(cardContent);
    businessCard.appendChild(cardBody);
    businessCards.appendChild(businessCard);
  });
};

displayMembers();
