console.log("connected");

const apiUrl =
  window.location.protocol === "file:"
    ? "http://localhost:8080" // Local API server during development
    : ""; //Production API

let reviewsWrapper = document.querySelector("section");

function addHikeReview(data) {
  let newCard = document.createElement("div");
  newCard.classList.add("card");

  let hikeName = document.createElement("h2");
  hikeName.textContent = data.name;

  let hikeLocation = document.createElement("h3");
  hikeLocation.textContent = data.location;

  let hikeMiles = document.createElement("p");
  hikeMiles.textContent = `${data.miles} miles`;

  let starsContainer = document.createElement("div");
  for (let i = 0; i < parseInt(data.rating); i++) {
    let hikeRating = document.createElement("ion-icon");
    hikeRating.setAttribute("name", "star");
    starsContainer.appendChild(hikeRating);
  }

  let hikeReview = document.createElement("p");
  hikeReview.textContent = data.review;

  let hikePicture = document.createElement("img");
  hikePicture.src = data.picture;
  hikePicture.alt = "Picture of " + data.name;
  hikePicture.classList.add("thumbnail");

  let editButton = document.createElement("button");
  editButton.textContent = "Edit";

  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  reviewsWrapper.appendChild(newCard);
  newCard.appendChild(hikePicture);
  newCard.appendChild(hikeName);
  newCard.appendChild(hikeLocation);
  newCard.appendChild(hikeMiles);
  newCard.appendChild(starsContainer);
  newCard.appendChild(hikeReview);
  newCard.appendChild(editButton);
  newCard.appendChild(deleteButton);

  // Edit functionality
  editButton.onclick = function () {
    console.log("hike id:", data.id);

    let editHikeName = document.querySelector("#edit-hike-name");
    let editHikeLocation = document.querySelector("#edit-hike-location");
    let editHikeMiles = document.querySelector("#edit-hike-miles");
    let editHikeRating = document.querySelector("#edit-hike-rating");
    let editHikeReview = document.querySelector("#edit-hike-review");
    let editHikePicture = document.querySelector("#edit-hike-picture");

    console.log(editHikeName.value);
    console.log(editHikeLocation.value);
    console.log(editHikeMiles.value);
    console.log(editHikeRating.value);
    console.log(editHikeReview.value);
    console.log(editHikePicture.value);
    //prep data to sent to server
    let editData = "name=" + encodeURIComponent(editHikeName.value);
    editData += "&location=" + encodeURIComponent(editHikeLocation.value);
    editData += "&miles=" + encodeURIComponent(editHikeMiles.value);
    editData += "&rating=" + encodeURIComponent(editHikeRating.value);
    editData += "&review=" + encodeURIComponent(editHikeReview.value);
    editData += "&picture=" + encodeURIComponent(editHikePicture.value);

    fetch(apiUrl + "/hikes/" + data.id, {
      method: "PUT",
      body: editData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then(function (response) {
      console.log("Updated Review", response);
      reviewsWrapper.textContent = "";
      loadReviewsFromServer();

      editHikeName.value = "";
      editHikeLocation.value = "";
      editHikeMiles.value = "";
      editHikeRating.value = "";
      editHikeReview.value = "";
      editHikePicture.value = "";
    });
  };

  // Delete functionality
  deleteButton.onclick = function () {
    if (confirm("Do you actually wanna delete this?") == true) {
      fetch(apiUrl + "/hikes/" + data.id, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Deleted hike with ID:", data.id);
            newCard.remove(); // Remove the card element from the DOM
          } else {
            console.error("Failed to delete the hike review.");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  };
}

function loadReviewsFromServer() {
  fetch(apiUrl + "/hikes")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      reviewsWrapper.innerHTML = ""; // Clear the reviewsWrapper
      data.forEach((review) => {
        addHikeReview(review); // Create a new review card for each review
      });
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
    });
}

// Call to load reviews when the page loads
loadReviewsFromServer();

// Add new review functionality
let addReviewButton = document.querySelector("#add-review-button");

function addNewReview() {
  console.log("Add Review button clicked");
  let inputHikeName = document.querySelector("#input-hike-name");
  let inputHikeLocation = document.querySelector("#input-hike-location");
  let inputHikeMiles = document.querySelector("#input-hike-miles");
  let inputHikeRating = document.querySelector("#input-hike-rating");
  let inputHikeReview = document.querySelector("#input-hike-review");
  let inputHikePicture = document.querySelector("#input-hike-picture");

  let data =
    "name=" +
    encodeURIComponent(inputHikeName.value) +
    "&location=" +
    encodeURIComponent(inputHikeLocation.value) +
    "&miles=" +
    encodeURIComponent(inputHikeMiles.value) +
    "&rating=" +
    encodeURIComponent(inputHikeRating.value) +
    "&review=" +
    encodeURIComponent(inputHikeReview.value) +
    "&picture=" +
    encodeURIComponent(inputHikePicture.value);

  fetch(apiUrl + "/hikes", {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then(function (response) {
      if (response.ok) {
        console.log("New review created!");
        loadReviewsFromServer(); // Reload reviews after creating a new one
        // Clear input fields
        inputHikeName.value = "";
        inputHikeLocation.value = "";
        inputHikeMiles.value = "";
        inputHikeRating.value = "";
        inputHikeReview.value = "";
        inputHikePicture.value = "";
      } else {
        console.error("Failed to create new review.");
      }
    })
    .catch((error) => console.error("Error creating review:", error));
}

addReviewButton.onclick = addNewReview;

// Toggle visibility for the add review container
let addReviewBtn = document.getElementById("myBtn");
let addReviewContainer = document.getElementById("addReviewContainer");

addReviewBtn.onclick = function () {
  addReviewContainer.classList.toggle("hidden");
};
