// Global variables
let allArtists = [];
let filteredArtists = [];
let favorites = JSON.parse(
  localStorage.getItem("canvasnova-favorites") || "[]"
);
let currentFilter = "all";
let searchTerm = "";

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", initGalleryPage);

async function initGalleryPage() {
  try {
    setupNavigation();
    await loadAllArtists();
    setupFilters();
    setupSearch();
    setupViewToggle();
    setupModal();
    loadFavorites();
    handleURLParameters();
  } catch (error) {
    console.error("Error initializing gallery page:", error);
    showError("Failed to load gallery. Please refresh and try again.");
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

    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        navToggle.classList.remove("active");
      }
    });
  }
}

async function loadAllArtists() {
  try {
    showLoading(true);
    const response = await fetch("data/artists.json");
    const data = await response.json();
    allArtists = data.artists;
    filteredArtists = [...allArtists];
    displayArtists();
    updateResultsCount();
  } catch (error) {
    console.error("Error loading artists:", error);
    showError("Unable to load artists. Please try again later.");
  } finally {
    showLoading(false);
  }
}

function displayArtists() {
  const container = document.getElementById("artists-grid");
  if (!container) return;

  if (filteredArtists.length === 0) {
    showNoResults(true);
    container.innerHTML = "";
    return;
  }

  showNoResults(false);
  container.innerHTML = filteredArtists.map(createArtistCard).join("");
  setupArtistCardEvents(container);
}

function createArtistCard(artist) {
  const isFavorite = favorites.includes(artist.id);
  const mediumText = formatMedium(artist.medium);
  const shortBio = truncateText(artist.bio, 120);

  return `
        <div class="artist-card" data-artist-id="${artist.id}">
            <div class="artist-image">
                <img src="${artist.image}" alt="${artist.name}" loading="lazy">
            </div>
            <div class="artist-info">
                <h3>${artist.name}</h3>
                <p class="artist-medium">${mediumText}</p>
                <p class="artist-bio">${shortBio}</p>
                <div class="artist-details">
                    <p><strong>Experience:</strong> ${artist.experience}</p>
                    <p><strong>Location:</strong> ${artist.location}</p>
                    <p><strong>Specialties:</strong> ${artist.specialties
                      .slice(0, 2)
                      .join(", ")}</p>
                </div>
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
  loadFavorites(); // Refresh favorites section
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      // Update active state
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Apply filter
      currentFilter = button.dataset.filter;
      applyFilters();
    });
  });
}

function setupSearch() {
  const searchInput = document.getElementById("artist-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }
}

function setupViewToggle() {
  const gridViewBtn = document.getElementById("grid-view");
  const listViewBtn = document.getElementById("list-view");
  const artistsGrid = document.getElementById("artists-grid");

  if (gridViewBtn && listViewBtn && artistsGrid) {
    gridViewBtn.addEventListener("click", () => {
      gridViewBtn.classList.add("active");
      listViewBtn.classList.remove("active");
      artistsGrid.classList.remove("list-view");
    });

    listViewBtn.addEventListener("click", () => {
      listViewBtn.classList.add("active");
      gridViewBtn.classList.remove("active");
      artistsGrid.classList.add("list-view");
    });
  }
}

function applyFilters() {
  filteredArtists = allArtists.filter((artist) => {
    // Filter by medium
    const mediumMatch =
      currentFilter === "all" || artist.medium === currentFilter;

    // Filter by search term
    const searchMatch =
      searchTerm === "" ||
      artist.name.toLowerCase().includes(searchTerm) ||
      artist.bio.toLowerCase().includes(searchTerm) ||
      artist.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm)
      );

    return mediumMatch && searchMatch;
  });

  displayArtists();
  updateResultsCount();
}

function updateResultsCount() {
  const countElement = document.getElementById("results-count");
  if (countElement) {
    countElement.textContent = filteredArtists.length;
  }
}

function loadFavorites() {
  const favoritesGrid = document.getElementById("favorites-grid");
  if (!favoritesGrid) return;

  if (favorites.length === 0) {
    favoritesGrid.innerHTML =
      '<p class="no-favorites">You haven\'t added any favorite artists yet. Click the heart icon on any artist card to add them to your favorites!</p>';
    return;
  }

  const favoriteArtists = allArtists.filter((artist) =>
    favorites.includes(artist.id)
  );
  favoritesGrid.innerHTML = favoriteArtists.map(createArtistCard).join("");
  setupArtistCardEvents(favoritesGrid);
}

function handleURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const filter = urlParams.get("filter");

  if (
    filter &&
    ["digital", "painting", "photography", "sculpture"].includes(filter)
  ) {
    const filterButton = document.querySelector(`[data-filter="${filter}"]`);
    if (filterButton) {
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      filterButton.classList.add("active");
      currentFilter = filter;
      applyFilters();
    }
  }
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
function showLoading(show) {
  const loadingElement = document.getElementById("loading");
  if (loadingElement) {
    loadingElement.style.display = show ? "block" : "none";
  }
}

function showNoResults(show) {
  const noResultsElement = document.getElementById("no-results");
  if (noResultsElement) {
    noResultsElement.style.display = show ? "block" : "none";
  }
}

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
  alert(message);
}
