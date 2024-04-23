var db = firebase.firestore();

var urlParams = new URLSearchParams(window.location.search);
var projectID = urlParams.get("id");

const commentText = document.querySelector("#commentText");
const ratingSelect = document.querySelector("#ratingSelect");
const btnSaveComment = document.querySelector("#btnSaveComment");

btnSaveComment.addEventListener("click", function () {
  const selectedRating = ratingSelect.value;
  if (!selectedRating) {
    alert("Please select a rating.");
    return;
  }

  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("Please sign in to leave a comment.");
    return;
  }

  const commentData = {
    commentText: commentText.value,
    rating: parseInt(selectedRating),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    projectID: projectID,
    uid: currentUser.uid,
  };

  db.collection("comments")
    .where("uid", "==", currentUser.uid)
    .where("projectID", "==", projectID)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        alert("You have already commented on this project.");
      } else {
        db.collection("comments")
          .add(commentData)
          .then(function () {
            alert("Comment submitted successfully");
            clearForm();
            loadComments();
          })
          .catch(function (error) {
            console.error("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.log("Error checking previous comments:", error);
    });
});

function loadComments() {
  const commentsContainer = document.getElementById("commentsContainer");

  db.collection("comments")
    .where("projectID", "==", projectID)
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      commentsContainer.innerHTML = "";

      querySnapshot.forEach((doc) => {
        const commentData = doc.data();

        const commentDiv = document.createElement("div");
        commentDiv.classList.add("comment");

        const commentTextElement = document.createElement("div");
        commentTextElement.textContent = commentData.commentText;

        const ratingElement = document.createElement("div");
        ratingElement.textContent = "Rating: " + commentData.rating + " stars";

        const timestampElement = document.createElement("div");
        const timestamp = new Date(commentData.timestamp.seconds * 1000);
        timestampElement.textContent =
          "Posted on: " + timestamp.toLocaleString();

        commentDiv.appendChild(commentTextElement);
        commentDiv.appendChild(ratingElement);
        commentDiv.appendChild(timestampElement);
        commentsContainer.appendChild(commentDiv);
      });
    })
    .catch((error) => {
      console.log("Error getting comments:", error);
    });
}

function clearForm() {
  commentText.value = "";
  ratingSelect.value = "";
  commentText.focus();
}

loadComments();
