// Set timestamp when page loads
const timestampInput = document.getElementById("timestamp");
if (timestampInput) {
  timestampInput.value = new Date().toISOString();
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "block";
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function (event) {
  const modals = document.getElementsByClassName("modal");
  for (let modal of modals) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }
};

// Form validation
const membershipForm = document.getElementById("membershipForm");
if (membershipForm) {
  membershipForm.addEventListener("submit", function (e) {
    let isValid = true;

    // Clear previous errors
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.textContent = ""));

    const inputs = document.querySelectorAll("input, select");
    inputs.forEach((input) => input.classList.remove("error"));

    // Validate required fields
    const requiredFields = [
      { id: "firstName", name: "First Name" },
      { id: "lastName", name: "Last Name" },
      { id: "email", name: "Email" },
      { id: "phone", name: "Phone" },
      { id: "businessName", name: "Business Name" },
    ];

    requiredFields.forEach((field) => {
      const input = document.getElementById(field.id);
      if (input && !input.value.trim()) {
        input.classList.add("error");
        const errorEl = document.getElementById(field.id + "Error");
        if (errorEl) errorEl.textContent = field.name + " is required";
        isValid = false;
      }
    });

    // Validate organizational title pattern
    const orgTitle = document.getElementById("orgTitle");
    if (
      orgTitle &&
      orgTitle.value &&
      !orgTitle.value.match(/^[A-Za-z\s\-]{7,}$/)
    ) {
      orgTitle.classList.add("error");
      const orgTitleError = document.getElementById("orgTitleError");
      if (orgTitleError)
        orgTitleError.textContent =
          "Title must be at least 7 characters and contain only letters, spaces, and hyphens";
      isValid = false;
    }

    // Validate email format
    const email = document.getElementById("email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && email.value && !emailPattern.test(email.value)) {
      email.classList.add("error");
      const emailError = document.getElementById("emailError");
      if (emailError)
        emailError.textContent = "Please enter a valid email address";
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault();
      // Scroll to first error
      const firstError = document.querySelector(".error");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
}

// Real-time validation
const orgTitleInput = document.getElementById("orgTitle");
if (orgTitleInput) {
  orgTitleInput.addEventListener("input", function () {
    const value = this.value;
    const errorEl = document.getElementById("orgTitleError");

    if (value && !value.match(/^[A-Za-z\s\-]{7,}$/)) {
      this.classList.add("error");
      if (errorEl)
        errorEl.textContent =
          "Title must be at least 7 characters and contain only letters, spaces, and hyphens";
    } else {
      this.classList.remove("error");
      if (errorEl) errorEl.textContent = "";
    }
  });
}

// Keyboard navigation for accessibility
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const openModal = document.querySelector('.modal[style*="block"]');
    if (openModal) {
      openModal.style.display = "none";
    }
  }
});

// Function to get URL parameters
function getURLParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name) || "Not provided";
}

// Function to format timestamp
function formatTimestamp(isoString) {
  if (!isoString || isoString === "Not provided") return "Not provided";
  const date = new Date(isoString);
  return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
}

// Function to format membership level
function formatMembershipLevel(level) {
  const levels = {
    np: "NP Membership (Non-Profit)",
    bronze: "Bronze Membership",
    silver: "Silver Membership",
    gold: "Gold Membership",
  };
  return levels[level] || "Not selected";
}

// Populate submission details
document.addEventListener("DOMContentLoaded", function () {
  const detailsContainer = document.getElementById("submissionDetails");
  if (!detailsContainer) return;

  const submissionData = [
    {
      label: "First Name",
      value: getURLParameter("firstName"),
    },
    {
      label: "Last Name",
      value: getURLParameter("lastName"),
    },
    {
      label: "Email Address",
      value: getURLParameter("email"),
    },
    {
      label: "Mobile Phone",
      value: getURLParameter("phone"),
    },
    {
      label: "Business/Organization",
      value: getURLParameter("businessName"),
    },
    {
      label: "Membership Level",
      value: formatMembershipLevel(getURLParameter("membershipLevel")),
    },
    {
      label: "Submission Date",
      value: formatTimestamp(getURLParameter("timestamp")),
    },
  ];

  submissionData.forEach((item) => {
    if (
      item.value !== "Not provided" ||
      item.label === "Submission Date" ||
      item.label === "Membership Level"
    ) {
      const detailItem = document.createElement("div");
      detailItem.className = "detail-item";

      detailItem.innerHTML = `
        <span class="detail-label">${item.label}:</span>
        <span class="detail-value">${item.value}</span>
      `;

      detailsContainer.appendChild(detailItem);
    }
  });

  // If no parameters are found, show a message
  if (detailsContainer.children.length === 0) {
    detailsContainer.innerHTML = `
      <div class="detail-item">
        <span class="detail-value" style="text-align: center; width: 100%;">
          No submission data found. Please ensure you submitted the form correctly.
        </span>
      </div>
    `;
  }
});
