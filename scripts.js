/* ===== North Star Bakery JavaScript ===== */
/* Products page: filter products by category and build a pre-order list.   */
/* Contact page: validate the pre-order form and fill in the saved list.    */
/* The pre-order list is saved in localStorage so it survives a refresh.    */

/* ---------- Data ---------- */

// Array of objects: every product the bakery sells
const products = [
  { id: "sourdough",  name: "Country sourdough",        category: "bread",  price: 8,  description: "Slow fermented, crackly crust." },
  { id: "signature",  name: "Signature dark rye loaf",  category: "bread",  price: 9,  description: "Our most requested bread." },
  { id: "wheat",      name: "Whole wheat sandwich loaf", category: "bread", price: 7,  description: "Soft slices for the family." },
  { id: "croissant",  name: "Butter croissant",          category: "pastry", price: 4,  description: "Flaky and baked every morning." },
  { id: "cinnamon",   name: "Cinnamon roll",             category: "pastry", price: 4,  description: "Glazed and still warm at 7 AM." },
  { id: "cookies",    name: "Cookie dozen",              category: "pastry", price: 20, description: "Chocolate chip, oatmeal, and sugar." },
  { id: "cake6",      name: "6 inch celebration cake",   category: "cake",   price: 38, description: "Serves 6 to 8. Order 3 days ahead." },
  { id: "cake9",      name: "9 inch celebration cake",   category: "cake",   price: 58, description: "Serves 12 to 16. Order 3 days ahead." }
];

// Object: the filter buttons and the label shown for each category
const categoryLabels = {
  all: "All items",
  bread: "Breads",
  pastry: "Pastries",
  cake: "Cakes"
};

// The name used to save the pre-order list in localStorage
const STORAGE_KEY = "northStarOrderList";


/* ---------- Saving and loading the pre-order list ---------- */

// Returns the saved list, or an empty array if nothing is saved yet
function loadOrderList() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

// localStorage only stores text, so the array is turned into a JSON string
function saveOrderList(orderList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderList));
}

function findProduct(productId) {
  return products.find(function (product) {
    return product.id === productId;
  });
}

function formatPrice(amount) {
  return "$" + amount.toFixed(2);
}


/* ---------- Products page: filter and pre-order list ---------- */

// Shows product cards for one category ("all" shows everything)
function renderProducts(category) {
  const productList = document.getElementById("product-list");
  const status = document.getElementById("filter-status");
  productList.innerHTML = "";

  const matches = products.filter(function (product) {
    return category === "all" || product.category === category;
  });

  matches.forEach(function (product) {
    const card = document.createElement("li");
    card.className = "product-card";
    card.innerHTML =
      "<h3>" + product.name + "</h3>" +
      "<p>" + product.description + "</p>" +
      "<p class=\"price\">" + formatPrice(product.price) + "</p>" +
      "<button type=\"button\" class=\"add-button\" data-id=\"" + product.id + "\">Add to my list</button>";
    productList.appendChild(card);
  });

  status.textContent = "Showing " + matches.length + " " + categoryLabels[category].toLowerCase() + ".";
}

// Marks the clicked filter button as the active one
function setActiveFilter(clickedButton) {
  const buttons = document.querySelectorAll(".filter-button");
  buttons.forEach(function (button) {
    button.setAttribute("aria-pressed", "false");
  });
  clickedButton.setAttribute("aria-pressed", "true");
}

// Shows the saved pre-order list and the estimated total
function renderOrderList() {
  const orderList = loadOrderList();
  const listElement = document.getElementById("order-items");
  const totalElement = document.getElementById("order-total");
  const emptyMessage = document.getElementById("order-empty");
  const actions = document.getElementById("order-actions");
  listElement.innerHTML = "";

  let total = 0;
  orderList.forEach(function (item) {
    const product = findProduct(item.id);
    if (!product) {
      return;
    }
    total += product.price * item.quantity;

    const row = document.createElement("li");
    row.innerHTML =
      "<span>" + item.quantity + " x " + product.name + "</span> " +
      "<button type=\"button\" class=\"remove-button\" data-id=\"" + product.id + "\" " +
      "aria-label=\"Remove one " + product.name + "\">Remove</button>";
    listElement.appendChild(row);
  });

  totalElement.textContent = "Estimated total: " + formatPrice(total);
  emptyMessage.hidden = orderList.length > 0;
  actions.hidden = orderList.length === 0;
}

function addToOrder(productId) {
  const orderList = loadOrderList();
  const existing = orderList.find(function (item) {
    return item.id === productId;
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    orderList.push({ id: productId, quantity: 1 });
  }

  saveOrderList(orderList);
  renderOrderList();
}

function removeFromOrder(productId) {
  let orderList = loadOrderList();
  orderList.forEach(function (item) {
    if (item.id === productId) {
      item.quantity -= 1;
    }
  });
  orderList = orderList.filter(function (item) {
    return item.quantity > 0;
  });

  saveOrderList(orderList);
  renderOrderList();
}

function clearOrder() {
  localStorage.removeItem(STORAGE_KEY);
  renderOrderList();
}

function initProductsPage() {
  // Filter buttons
  document.querySelectorAll(".filter-button").forEach(function (button) {
    button.addEventListener("click", function () {
      setActiveFilter(button);
      renderProducts(button.dataset.category);
    });
  });

  // One listener on the list handles every "Add" button, even new ones
  document.getElementById("product-list").addEventListener("click", function (event) {
    if (event.target.classList.contains("add-button")) {
      addToOrder(event.target.dataset.id);
    }
  });

  document.getElementById("order-items").addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
      removeFromOrder(event.target.dataset.id);
    }
  });

  document.getElementById("clear-order").addEventListener("click", clearOrder);

  renderProducts("all");
  renderOrderList(); // loads the saved list when the page opens
}


/* ---------- Contact page: form validation ---------- */

// Shows an error message right under the field
function showError(input, message) {
  const errorElement = document.getElementById(input.id + "-error");
  errorElement.textContent = message;
  input.classList.add("invalid");
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  const errorElement = document.getElementById(input.id + "-error");
  errorElement.textContent = "";
  input.classList.remove("invalid");
  input.removeAttribute("aria-invalid");
}

// Turns "2026-11-20" into a Date at midnight local time
function parseDate(value) {
  const parts = value.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function daysFromToday(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((date - today) / (1000 * 60 * 60 * 24));
}

// Each check returns an error message, or "" when the field is fine
function checkName(value) {
  if (value.trim().length < 2) {
    return "Please enter your full name (at least 2 letters).";
  }
  return "";
}

function checkEmail(value) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (value.trim() === "") {
    return "Please enter your email so we can confirm your order.";
  }
  if (!emailPattern.test(value.trim())) {
    return "Please enter a valid email, like name@example.com.";
  }
  return "";
}

function checkPhone(value) {
  const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
  if (value.trim() !== "" && !phonePattern.test(value.trim())) {
    return "Please use the format 703-555-1234, or leave this blank.";
  }
  return "";
}

function checkRequestType(value) {
  if (value === "") {
    return "Please choose a request type.";
  }
  return "";
}

function checkPickupDate(value) {
  if (value === "") {
    return "Please choose a pickup date.";
  }
  const date = parseDate(value);
  const daysAway = daysFromToday(date);
  const requestType = document.getElementById("request-type").value;

  if (daysAway < 0) {
    return "Pickup date cannot be in the past.";
  }
  if (date.getDay() === 1) {
    return "We are closed on Mondays. Please pick another day.";
  }
  if (requestType === "custom-cake" && daysAway < 3) {
    return "Custom cakes need at least 3 days. Please choose a later date.";
  }
  return "";
}

function checkItemDetails(value) {
  if (value.trim().length < 5) {
    return "Please tell us what you would like (at least 5 characters).";
  }
  return "";
}

// Array of objects: which field each check belongs to
const validationRules = [
  { fieldId: "name",         check: checkName },
  { fieldId: "email",        check: checkEmail },
  { fieldId: "phone",        check: checkPhone },
  { fieldId: "request-type", check: checkRequestType },
  { fieldId: "pickup-date",  check: checkPickupDate },
  { fieldId: "item-details", check: checkItemDetails }
];

function validateField(rule) {
  const input = document.getElementById(rule.fieldId);
  const message = rule.check(input.value);
  if (message) {
    showError(input, message);
    return false;
  }
  clearError(input);
  return true;
}

// Checks every field and returns true only if all of them pass
function validateForm() {
  let firstInvalid = null;
  validationRules.forEach(function (rule) {
    const isValid = validateField(rule);
    if (!isValid && firstInvalid === null) {
      firstInvalid = document.getElementById(rule.fieldId);
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function handleSubmit(event) {
  event.preventDefault(); // stop the form from sending until it passes

  const status = document.getElementById("form-status");
  if (!validateForm()) {
    status.textContent = "Please fix the highlighted fields. Everything you typed is still here.";
    status.className = "form-status error-summary";
    return;
  }

  const name = document.getElementById("name").value.trim();
  status.textContent = "Thank you, " + name + "! Your request was received. We will email you within one business day.";
  status.className = "form-status success";
  event.target.reset();
  localStorage.removeItem(STORAGE_KEY); // the saved list has been sent
}

// If the customer built a list on the Products page, put it in Item details
function fillItemDetailsFromOrder() {
  const orderList = loadOrderList();
  const itemDetails = document.getElementById("item-details");
  const note = document.getElementById("saved-list-note");

  if (orderList.length === 0 || itemDetails.value.trim() !== "") {
    return;
  }

  const lines = orderList.map(function (item) {
    const product = findProduct(item.id);
    return product ? item.quantity + " x " + product.name : "";
  }).filter(function (line) {
    return line !== "";
  });

  itemDetails.value = lines.join("\n");
  note.textContent = "We filled in the " + lines.length + " item(s) from your saved pre-order list. You can edit them.";
}

function initContactPage() {
  const form = document.getElementById("preorder-form");
  form.addEventListener("submit", handleSubmit);

  // Re-check a field as soon as the user leaves it, so errors clear while fixing
  validationRules.forEach(function (rule) {
    const input = document.getElementById(rule.fieldId);
    input.addEventListener("blur", function () {
      if (input.classList.contains("invalid")) {
        validateField(rule);
      }
    });
  });

  // Changing the request type can change the pickup date rule
  document.getElementById("request-type").addEventListener("change", function () {
    const dateInput = document.getElementById("pickup-date");
    if (dateInput.classList.contains("invalid")) {
      const dateRule = validationRules.find(function (rule) {
        return rule.fieldId === "pickup-date";
      });
      validateField(dateRule);
    }
  });

  fillItemDetailsFromOrder(); // loads the saved list when the page opens
}


/* ---------- Start the right code for the page that is open ---------- */
if (document.getElementById("product-list")) {
  initProductsPage();
}
if (document.getElementById("preorder-form")) {
  initContactPage();
}
