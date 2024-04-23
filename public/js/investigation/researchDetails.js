var db = firebase.firestore();

var urlParams = new URLSearchParams(window.location.search);
var projectID = urlParams.get("id");
var currentUserID;

function loadInvestigationDetails() {
  var projectDetailsContainer = document.getElementById("projectDetails");

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      currentUserID = user.uid;
    } else {
      currentUserID = null;
      continueLoadInvestigationDetails();
    }

    continueLoadInvestigationDetails();
  });
}

function continueLoadInvestigationDetails() {
  var projectDetailsContainer = document.getElementById("projectDetails");

  db.collection("researchProjects")
    .doc(projectID)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        var projectData = doc.data();

        var projectTitleElement = document.getElementById("projectTitle");
        projectTitleElement.textContent = projectData.researchTitle;

        var projectAreaOfInterestElement = document.getElementById(
          "projectAreaOfInterest"
        );
        projectAreaOfInterestElement.innerHTML =
          "<strong>Area de interes:</strong> " + projectData.areaOfInterest;

        var projectSchoolGradeElement =
          document.getElementById("projectSchoolGrade");
        projectSchoolGradeElement.innerHTML =
          "<strong>Grado de la Estudiante:</strong> " + projectData.schoolGrade;

        var projectTopicDescriptionElement = document.getElementById(
          "projectTopicDescription"
        );
        projectTopicDescriptionElement.innerHTML =
          "<strong>Descrición del tema:</strong> " +
          projectData.topicDescription;

        var studentID = projectData.studentID;
        if (studentID) {
          db.collection("students")
            .where("studentID", "==", studentID)
            .get()
            .then(function (querySnapshot) {
              if (!querySnapshot.empty) {
                var studentDoc = querySnapshot.docs[0];
                var studentData = studentDoc.data();

                var authorNameElement = document.getElementById("authorName");
                authorNameElement.innerHTML =
                  "<strong>Nombre del Autor:</strong> " + studentData.fullName;

                var authorProfilePictureElement = document.getElementById(
                  "authorProfilePicture"
                );
                authorProfilePictureElement.innerHTML =
                  "<strong>Foto de Perfil:</strong> " +
                  '<img src="' +
                  studentData.profilePictureURL +
                  '" alt="Author Profile Picture" />';

                var authorSchoolGradeElement =
                  document.getElementById("authorSchoolGrade");
                authorSchoolGradeElement.innerHTML =
                  "<strong>Grado de Colegio del Autor:</strong> " +
                  studentData.schoolGrade;

                var authorAboutMeElement =
                  document.getElementById("authorAboutMe");
                authorAboutMeElement.innerHTML =
                  "<strong>Sobre mi:</strong> " + studentData.aboutMe;
              } else {
                console.log(
                  "No student document found for studentID:",
                  studentID
                );
              }
            })
            .catch(function (error) {
              console.error(
                "Error getting student data for studentID",
                studentID,
                ":",
                error
              );
            });
        }

        var projectPdfUrlElement = document.getElementById("projectPdfUrl");
        projectPdfUrlElement.innerHTML =
          '<a href="' +
          projectData.pdfUrl +
          '" target="_blank"><strong>Presiona para ver el pdf</strong></a>';

        var projectImagesElement = document.getElementById("projectImages");
        var carouselInner = document.createElement("div");
        carouselInner.classList.add("carousel-inner");

        projectData.images.forEach(function (imageUrl, index) {
          var carouselItem = document.createElement("div");
          carouselItem.classList.add("carousel-item");

          if (index === 0) {
            carouselItem.classList.add("active");
          }

          var imageElement = document.createElement("img");
          imageElement.src = imageUrl;
          imageElement.classList.add("d-block", "w-100");

          carouselItem.appendChild(imageElement);
          carouselInner.appendChild(carouselItem);
        });

        var prevButton = document.createElement("button");
        prevButton.classList.add("carousel-control-prev");
        prevButton.type = "button";
        prevButton.setAttribute("data-bs-target", "#projectImages");
        prevButton.setAttribute("data-bs-slide", "prev");
        prevButton.innerHTML =
          '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>';

        var nextButton = document.createElement("button");
        nextButton.classList.add("carousel-control-next");
        nextButton.type = "button";
        nextButton.setAttribute("data-bs-target", "#projectImages");
        nextButton.setAttribute("data-bs-slide", "next");
        nextButton.innerHTML =
          '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>';

        projectImagesElement.innerHTML = "";
        projectImagesElement.appendChild(carouselInner);
        projectImagesElement.appendChild(prevButton);
        projectImagesElement.appendChild(nextButton);

        var projectConclusionsElement =
          document.getElementById("projectConclusions");
        projectConclusionsElement.innerHTML =
          "<strong>Concluciones:</strong> " + projectData.conclusions;

        var projectFinalRecommendationsElement = document.getElementById(
          "projectFinalRecommendations"
        );
        projectFinalRecommendationsElement.innerHTML =
          "<strong>Recomendaciones Finales:</strong> " +
          projectData.finalRecommendations;

        loadSpecificComments();
      } else {
        console.log("No such document!");
      }
    })
    .catch(function (error) {
      console.log("Error getting document:", error);
    });
}

function loadSpecificComments() {
  var commentsContainer = document.getElementById("commentsContainer");

  db.collection("comments")
    .where("projectID", "==", projectID)
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
        ratingElement.textContent =
          "Valoracion: " + commentData.rating + " Estrellas";

        const timestampElement = document.createElement("div");
        const timestamp = new Date(commentData.timestamp.seconds * 1000);
        timestampElement.textContent =
          "Subido en: " + timestamp.toLocaleString();

        loadUserName(commentData.uid, commentDiv);

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

function loadUserName(userID, commentDiv) {
  db.collection("userDetails")
    .doc(userID)
    .get()
    .then(function (userDoc) {
      const userData = userDoc.data();
      const userName = userData ? userData.username : "Anonymous";
      const userElement = document.createElement("div");
      userElement.textContent = "User: " + userName;
      commentDiv.appendChild(userElement);
    })
    .catch(function (error) {
      console.log("Error getting user data:", error);
    });
}

loadInvestigationDetails();
