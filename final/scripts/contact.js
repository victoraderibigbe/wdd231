// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", initContactPage);

function initContactPage() {
  setupNavigation();
  setupContactForm();
  setupFAQ();
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

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Add real-time validation
  const inputs = form.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => clearFieldError(input));
  });

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleFormSubmission(form);
  });
}

function validateField(field) {
  const fieldName = field.name;
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = "";

  // Clear previous error
  clearFieldError(field);

  switch (fieldName) {
    case "name":
      if (!value) {
        errorMessage = "Name is required";
        isValid = false;
      } else if (value.length < 2) {
        errorMessage = "Name must be at least 2 characters";
        isValid = false;
      }
      break;

    case "email":
      if (!value) {
        errorMessage = "Email is required";
        isValid = false;
      } else if (!isValidEmail(value)) {
        errorMessage = "Please enter a valid email address";
        isValid = false;
      }
      break;

    case "phone":
      if (value && !isValidPhone(value)) {
        errorMessage = "Please enter a valid phone number";
        isValid = false;
      }
      break;

    case "subject":
      if (!value) {
        errorMessage = "Please select a subject";
        isValid = false;
      }
      break;

    case "message":
      if (!value) {
        errorMessage = "Message is required";
        isValid = false;
      } else if (value.length < 10) {
        errorMessage = "Message must be at least 10 characters";
        isValid = false;
      }
      break;

    case "privacy":
      if (!field.checked) {
        errorMessage = "You must agree to the privacy policy";
        isValid = false;
      }
      break;
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add("error");
  const errorElement = document.getElementById(`${field.name}-error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearFieldError(field) {
  field.classList.remove("error");
  const errorElement = document.getElementById(`${field.name}-error`);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

function handleFormSubmission(form) {
  let isFormValid = true;

  // Validate all required fields
  const requiredFields = form.querySelectorAll("[required]");
  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isFormValid = false;
    }
  });

  // Validate optional phone field if filled
  const phoneField = form.querySelector('[name="phone"]');
  if (phoneField && phoneField.value.trim()) {
    if (!validateField(phoneField)) {
      isFormValid = false;
    }
  }

  if (!isFormValid) {
    showError("Please correct the errors above and try again.");
    // Focus on first error field
    const firstError = form.querySelector(".error");
    if (firstError) {
      firstError.focus();
    }
    return;
  }

  // If form is valid, prepare data and submit
  const formData = new FormData(form);
  const params = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    params.append(key, value);
  }

  // Add timestamp
  params.append("timestamp", new Date().toISOString());

  // Redirect to confirmation page with form data
  window.location.href = `form-confirmation.html?${params.toString()}`;
}

function setupFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector("h3");
    if (question) {
      question.style.cursor = "pointer";
      question.addEventListener("click", () => {
        const answer = item.querySelector("p");
        if (answer) {
          const isVisible = answer.style.display !== "none";
          answer.style.display = isVisible ? "none" : "block";
          question.style.color = isVisible ? "#5E81AC" : "#D08770";
        }
      });
    }
  });
}

// Validation utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""));
}

function showError(message) {
  console.error(message);
  alert(message);
}
