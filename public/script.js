// script.js
// The behavior of the web page

// Get some elements from index.html by their ids
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-button");
const recordsSection = document.getElementById("records");
const recordsTable = document.getElementById("records-table");
const recordModal = document.getElementById("record-modal");
const recordModalContent = document.getElementById("record-modal-content");
const recordModalClose = document.getElementById("record-modal-close");
const recordModalTitle = document.getElementById("record-modal-title");
const recordModalData = document.getElementById("record-modal-data");
const recordModalForm = document.getElementById("record-modal-form");
const recordModalRequest = document.getElementById("record-modal-request");
const recordModalButton = document.getElementById("record-modal-button");

// Define a function to show an alert message
function showAlert(message) {
  // Use the built-in alert function to show the message
  alert(message);
}

// Define a function to show the records section and hide the login section
function showRecords() {
  // Set the display style of the records section to block
  recordsSection.style.display = "block";

  // Set the display style of the login section to none
  loginSection.style.display = "none";
}

// Define a function to show the record modal and fill it with data
function showRecordModal(recordId, recordHash, recordDate, recordData) {
  // Set the display style of the record modal to block
  recordModal.style.display = "block";

  // Set the text content of the record modal title to the record id and hash
  recordModalTitle.textContent = `Record Details: ID: ${recordId}, Hash: ${recordHash}`;

  // Set the text content of the record modal data to the record date and data
  recordModalData.textContent = `Date: ${recordDate}, Data: ${JSON.stringify(recordData)}`;

  // Set the value of the record modal request to an empty string
  recordModalRequest.value = "";

  // Add an event listener to the record modal form for submit event
  recordModalForm.addEventListener("submit", (event) => {
    // Prevent the default behavior of the form submission
    event.preventDefault();

    // Get the value of the record modal request and parse it as JSON
    const verificationRequest = JSON.parse(recordModalRequest.value);

    // Call the verifyRecord function with the record id and verification request
    verifyRecord(recordId, verificationRequest);
  });
}

// Define a function to hide the record modal and clear it
function hideRecordModal() {
  // Set the display style of the record modal to none
  recordModal.style.display = "none";

  // Set the text content of the record modal title to an empty string
  recordModalTitle.textContent = "";

  // Set the text content of the record modal data to an empty string
  recordModalData.textContent = "";

  // Remove any event listeners from the record modal form
  recordModalForm.removeEventListener("submit", verifyRecord);
}

// Define a function to login with a role, id, and password
async function login(role, id, password) {
  try {
    // Define the login data
    const loginData = {
      role,
      id,
      password
    };

    // Post the login data to the login endpoint and get the response
    const response = await axios.post("/login", loginData);

    // Get the status code from the response
    const statusCode = response.status;

    // Check if the status code is 200 (OK)
    if (statusCode === 200) {
      // Get the message from the response data
      const message = response.data.message;

      // Show an alert with the message
      showAlert(message);

      // Call the showRecords function to display the records section
      showRecords();

      // Call the getRecords function with the role and id to fetch and display the records
      getRecords(role, id);
    } else {
      // Throw an error with the status code
      throw new Error(`Status code: ${statusCode}`);
    }
  } catch (error) {
    // Handle any errors and show an alert with an error message
    console.error(error);
    showAlert("Login failed");
  }
}

// Define a function to get records with a role and id
async function getRecords(role, id) {
  try {
    // Get the records from the records endpoint by role and id and get the response
    const response = await axios.get(`/records?role=${role}&id=${id}`);

    // Get the status code from the response
    const statusCode = response.status;

    // Check if the status code is 200 (OK)
    if (statusCode === 200) {
      // Get the records array from the response data
      const records = response.data.records;

      // Check if there are any records in the array
      if (records.length > 0) {
        // Clear any existing rows in the records table body
        recordsTable.tBodies[0].innerHTML = "";

        // Loop through each record in the array
        for (const record of records) {
          // Get the id, hash, date, and data from each record object
          const { id, hash, date, data } = record;

          // Create a new row element for each record object 
          const row = document.createElement("tr");

          // Create a cell element for each record attribute and append it to the row element
          const idCell = document.createElement("td");
          idCell.textContent = id;
          row.appendChild(idCell);

          const hashCell = document.createElement("td");
          hashCell.textContent = hash;
          row.appendChild(hashCell);

          const dateCell = document.createElement("td");
          dateCell.textContent = date;
          row.appendChild(dateCell);

          // Create a cell element with a button element for the action and append it to the row element
          const actionCell = document.createElement("td");
          const actionButton = document.createElement("button");
          actionButton.textContent = "View";
          actionButton.className = "action-button";
          
          // Add an event listener to the button element for click event
          actionButton.addEventListener("click", () => {
            // Call the showRecordModal function with the record attributes
            showRecordModal(id, hash, date, data);
          });

          actionCell.appendChild(actionButton);
          row.appendChild(actionCell);

          // Append the row element to the records table body
          recordsTable.tBodies[0].appendChild(row);
        }
      } else {
        // If there are no records in the array, show a message in the records table body
        recordsTable.tBodies[0].innerHTML = "<tr><td colspan='4'>No records found</td></tr>";
      }
    } else {
      // Throw an error with the status code
      throw new Error(`Status code: ${statusCode}`);
    }
  } catch (error) {
    // Handle any errors and show an alert with an error message
    console.error(error);
    showAlert("Get records failed");
  }
}

// Define a function to verify a record with an id and a verification request
async function verifyRecord(recordId, verificationRequest) {
  try {
    // Post the verification request to the verify endpoint by record id and get the response
    const response = await axios.post(`/verify/${recordId}`, verificationRequest);

    // Get the status code from the response
    const statusCode = response.status;

    // Check if the status code is 200 (OK)
    if (statusCode === 200) {
      // Get the verification result from the response data
      const verificationResult = response.data.result;

      // Show an alert with the verification result
      showAlert(`Verification result: ${verificationResult}`);

      // Call the hideRecordModal function to close the modal
      hideRecordModal();
    } else {
      // Throw an error with the status code
      throw new Error(`Status code: ${statusCode}`);
    }
  } catch (error) {
    // Handle any errors and show an alert with an error message
    console.error(error);
    showAlert("Verification failed");
  }
}

// Add an event listener to the login form for submit event
loginForm.addEventListener("submit", (event) => {
  // Prevent the default behavior of the form submission
  event.preventDefault();

  // Get the values of the role, id, and password from the login form
  const role = loginForm.role.value;
  const id = loginForm.id.value;
  const password = loginForm.password.value;

  // Call the login function with the role, id, and password
  login(role, id, password);
});

// Add an event listener to the record modal close button for click event
recordModalClose.addEventListener("click", () => {
  // Call the hideRecordModal function to close the modal
  hideRecordModal();
});

// Theme toggle functionality
const themeToggleCheckbox = document.getElementById("theme-toggle-checkbox");
const toggleHandle = document.querySelector(".toggle-handle");
const body = document.body;

themeToggleCheckbox.addEventListener("change", () => {
  body.classList.toggle("dark-theme"); // Toggle dark theme class on body
  if (body.classList.contains("dark-theme")) {
    // If dark theme is active, move the toggle handle to the right
    toggleHandle.style.transform = "translateX(20px)";
  } else {
    // If light theme is active, move the toggle handle to the left
    toggleHandle.style.transform = "translateX(0)";
  }
});
