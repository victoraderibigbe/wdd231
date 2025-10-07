import { discoverData } from "../data/places.mjs";

// Function to handle visitor tracking
function handleVisitorTracking() {
  const lastVisit = localStorage.getItem("lastVisit");
  const currentTime = Date.now();
  const messageElement = document.getElementById("visitorMessage");

  if (!lastVisit) {
    // First visit
    messageElement.textContent =
      "Welcome! Let us know if you have any questions.";
  } else {
    const lastVisitTime = parseInt(lastVisit);
    const timeDifference = currentTime - lastVisitTime;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 1) {
      // Less than a day
      messageElement.textContent = "Back so soon! Awesome!";
    } else {
      // More than a day
      const dayText = daysDifference === 1 ? "day" : "days";
      messageElement.textContent = `You last visited ${daysDifference} ${dayText} ago.`;
    }
  }

  // Store current visit time
  localStorage.setItem("lastVisit", currentTime.toString());
}

// Function to create discover cards
function createDiscoverCards() {
  const gridContainer = document.getElementById("discoverGrid");

  discoverData.attractions.forEach((attraction) => {
    const card = document.createElement("div");
    card.className = "discover-card";

    card.innerHTML = `
                    <figure>
                        <img src="${attraction.image}" alt="${attraction.name}" loading="lazy">
                    </figure>
                    <div class="card-content">
                        <h2>${attraction.name}</h2>
                        <address>${attraction.address}</address>
                        <p>${attraction.description}</p>
                        <button class="learn-more-btn" onclick="learnMore('${attraction.name}')">Learn More</button>
                    </div>
                `;

    gridContainer.appendChild(card);
  });
}

// Function to handle learn more button clicks
function learnMore(attractionName) {
  alert(
    `Learn more about ${attractionName}! This would typically open a detailed page or modal with more information.`
  );
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  handleVisitorTracking();
  createDiscoverCards();
});
