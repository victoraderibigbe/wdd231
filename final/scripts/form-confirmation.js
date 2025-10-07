// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", initFormConfirmationPage);

function initFormConfirmationPage() {
  setupNavigation();
  displayFormData();
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

function displayFormData() {
  const urlParams = new URLSearchParams(window.location.search);
  const formDataContainer = document.getElementById("form-data");

  if (!formDataContainer || urlParams.toString() === "") {
    // If no form data, redirect to contact page
    window.location.href = "contact.html";
    return;
  }

  const formData = {};
  for (const [key, value] of urlParams.entries()) {
    formData[key] = value;
  }

  // Create display HTML
  const dataHTML = createFormDataHTML(formData);
  formDataContainer.innerHTML = `
        <h2>Message Summary</h2>
        ${dataHTML}
    `;
}

function createFormDataHTML(data) {
  const fieldLabels = {
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    subject: "Subject",
    medium: "Art Medium",
    message: "Message",
    newsletter: "Newsletter Subscription",
    privacy: "Privacy Policy Agreement",
    timestamp: "Submitted At",
  };

  const subjectLabels = {
    "artist-submission": "Artist Submission",
    collaboration: "Collaboration Inquiry",
    "purchase-inquiry": "Purchase Inquiry",
    "gallery-inquiry": "Gallery Inquiry",
    general: "General Question",
    other: "Other",
  };

  const mediumLabels = {
    digital: "Digital Art",
    painting: "Acrylic Painting",
    photography: "Photography",
    sculpture: "Sculpture",
    "mixed-media": "Mixed Media",
    other: "Other",
  };

  let html = "";

  for (const [key, value] of Object.entries(data)) {
    if (key === "privacy" && value !== "on") continue; // Skip unchecked privacy
    if (!value || value.trim() === "") continue; // Skip empty values

    let displayValue = value;
    const displayLabel = fieldLabels[key] || key;

    // Format specific fields
    switch (key) {
      case "subject":
        displayValue = subjectLabels[value] || value;
        break;
      case "medium":
        displayValue = mediumLabels[value] || value;
        break;
      case "newsletter":
        displayValue = value === "yes" ? "Yes, subscribed" : "No";
        break;
      case "privacy":
        displayValue = "Agreed";
        break;
      case "timestamp":
        displayValue = formatTimestamp(value);
        break;
      case "message":
        displayValue = formatMessage(value);
        break;
    }

    html += `
            <div class="data-item">
                <span class="data-label">${displayLabel}:</span>
                <span class="data-value">${displayValue}</span>
            </div>
        `;
  }

  return html;
}

function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch (error) {
    return timestamp;
  }
}

function formatMessage(message) {
  // Truncate very long messages for display
  if (message.length > 200) {
    return message.substring(0, 200) + "...";
  }
  return message;
}
