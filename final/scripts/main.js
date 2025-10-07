// Global variables
let allArtists = [];
let favorites = JSON.parse(
  localStorage.getItem("canvasnova-favorites") || "[]"
);

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", initHomePage);

async function initHomePage() {
  try {
    setupNavigation();
    await loadFeaturedArtists();
    setupCategoryCards();
    setupStatsCounter();
    setupModal();
  } catch (error) {
    console.error("Error initializing home page:", error);
    showError("Failed to load page content. Please refresh and try again.");
  }
}

function setupNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });

    // Close menu when clicking on links
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }
}

async function loadFeaturedArtists() {
  try {
    const response = await fetch("data/artists.json");
    const data = await response.json();
    allArtists = data.artists;

    const featuredArtists = allArtists
      .filter((artist) => artist.featured)
      .slice(0, 4);
    displayArtists(featuredArtists, "featured-artists-grid");
  } catch (error) {
    console.error("Error loading artists:", error);
    showError("Unable to load featured artists.");
  }
}

function displayArtists(artists, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = artists.map(createArtistCard).join("");
  setupArtistCardEvents(container);
}

function createArtistCard(artist) {
  const isFavorite = favorites.includes(artist.id);
  const mediumText = formatMedium(artist.medium);
  const shortBio = truncateText(artist.bio, 100);

  return `
        <div class="artist-card" data-artist-id="${artist.id}">
            <div class="artist-image">
                <img src="${artist.image}" alt="${artist.name}" loading="lazy">
            </div>
            <div class="artist-info">
                <h3>${artist.name}</h3>
                <p class="artist-medium">${mediumText}</p>
                <p class="artist-bio">${shortBio}</p>
                <div class="artist-actions">
                    <button class="btn btn-outline btn-small view-artist" data-artist-id="${
                      artist.id
                    }">
                        View Details
                    </button>
                    <button class="favorite-btn ${isFavorite ? "active" : ""}" 
                            data-artist-id="${artist.id}">
                        ${isFavorite ? "❤️" : "🤍"}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function setupArtistCardEvents(container) {
  // View artist details
  container.querySelectorAll(".view-artist").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const artistId = Number.parseInt(button.dataset.artistId);
      showArtistModal(artistId);
    });
  });

  // Favorite buttons
  container.querySelectorAll(".favorite-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(button);
    });
  });

  // Card click to show modal
  container.querySelectorAll(".artist-card").forEach((card) => {
    card.addEventListener("click", () => {
      const artistId = Number.parseInt(card.dataset.artistId);
      showArtistModal(artistId);
    });
  });
}

function toggleFavorite(button) {
  const artistId = Number.parseInt(button.dataset.artistId);
  const isCurrentlyFavorite = button.classList.contains("active");

  if (isCurrentlyFavorite) {
    favorites = favorites.filter((id) => id !== artistId);
    button.classList.remove("active");
    button.innerHTML = "🤍";
  } else {
    favorites.push(artistId);
    button.classList.add("active");
    button.innerHTML = "❤️";
  }

  localStorage.setItem("canvasnova-favorites", JSON.stringify(favorites));
}

function setupCategoryCards() {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      if (category) {
        window.location.href = `gallery.html?filter=${category}`;
      }
    });
  });
}

function setupStatsCounter() {
  const stats = document.querySelectorAll(".stat-number");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => observer.observe(stat));
}

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.target);
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

function setupModal() {
  const modal = document.getElementById("artist-modal");
  const closeBtn = modal?.querySelector(".modal-close");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });
}

function showArtistModal(artistId) {
  const artist = allArtists.find((a) => a.id === artistId);
  if (!artist) return;

  const modal = document.getElementById("artist-modal");
  const modalBody = document.getElementById("modal-body");
  const modalTitle = document.getElementById("modal-title");

  if (modal && modalBody && modalTitle) {
    modalTitle.textContent = artist.name;
    modalBody.innerHTML = createModalContent(artist);
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function createModalContent(artist) {
  const mediumText = formatMedium(artist.medium);
  const artworksHtml = artist.artworks
    ? artist.artworks
        .map(
          (artwork) => `
            <div class="artwork-item">
                <img src="${artwork.image}" alt="${artwork.title}" loading="lazy">
                <h4>${artwork.title}</h4>
                <p>${artwork.description}</p>
            </div>
        `
        )
        .join("")
    : "";

  return `
        <div class="modal-artist-info">
            <img src="${artist.image}" alt="${
    artist.name
  }" class="modal-artist-image">
            <div class="modal-artist-details">
                <h3>${artist.name}</h3>
                <p class="modal-medium">${mediumText}</p>
                <p class="modal-bio">${artist.bio}</p>
                <div class="modal-contact">
                    <p><strong>Location:</strong> ${artist.location}</p>
                    <p><strong>Experience:</strong> ${artist.experience}</p>
                    <p><strong>Email:</strong> <a href="mailto:${
                      artist.email
                    }">${artist.email}</a></p>
                    ${
                      artist.website
                        ? `<p><strong>Website:</strong> <a href="${artist.website}" target="_blank">${artist.website}</a></p>`
                        : ""
                    }
                </div>
                <div class="modal-specialties">
                    <strong>Specialties:</strong>
                    ${artist.specialties
                      .map(
                        (specialty) =>
                          `<span class="specialty-tag">${specialty}</span>`
                      )
                      .join("")}
                </div>
            </div>
        </div>
        ${
          artworksHtml
            ? `<div class="modal-artworks"><h4>Artworks</h4><div class="artworks-grid">${artworksHtml}</div></div>`
            : ""
        }
    `;
}

function closeModal() {
  const modal = document.getElementById("artist-modal");
  if (modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// Utility functions
function formatMedium(medium) {
  const mediumMap = {
    digital: "Digital Art",
    painting: "Acrylic Painting",
    photography: "Photography",
    sculpture: "Sculpture",
  };
  return mediumMap[medium] || medium;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

function showError(message) {
  console.error(message);
  alert(message); // Simple error display
}
