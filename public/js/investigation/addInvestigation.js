var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtResearchTitle = document.querySelector("#txtResearchTitle");
const txtAreaofInterest = document.querySelector("#txtAreaofInterest");
const txtStudentID = document.querySelector("#txtStudentID");
const txtSchoolGrade = document.querySelector("#txtSchoolGrade");
const txtTopicDescription = document.querySelector("#txtTopicDescription");
const txtPdfFile = document.querySelector("#txtPdfFile");
const txtImages = document.querySelector("#txtImages");
const txtConclusions = document.querySelector("#txtConclusions");
const txtRecommendations = document.querySelector("#txtRecommendations");
const btnSaveProject = document.querySelector("#btnSaveProject");

const form = document.querySelector("#researchForm");

btnSaveProject.addEventListener("click", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const progressContainer = document.getElementById("progress-container");
  progressContainer.style.display = "block";

  const pdfFile = txtPdfFile.files[0];
  const imageFiles = txtImages.files;

  if (!pdfFile) {
    alert("You must select a PDF file");
  } else {
    const pdfMetadata = {
      contentType: pdfFile.type,
    };

    const pdfUpload = container
      .child("pdfs/" + pdfFile.name)
      .put(pdfFile, pdfMetadata);

    pdfUpload.on(
      "state_changed",
      function progress(snapshot) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        progressBar.value = progress;
        progressText.textContent = `Uploading PDF... ${Math.round(progress)}%`;
      },
      function error(error) {
        alert("Error uploading PDF: " + error.message);
      },
      function complete() {
        const imagePromises = Array.from(imageFiles).map((imageFile, index) => {
          const imageMetadata = {
            contentType: imageFile.type,
          };

          const imageUpload = container
            .child(`images/${index}_${imageFile.name}`)
            .put(imageFile, imageMetadata);

          imageUpload.on(
            "state_changed",
            function progress(snapshot) {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              const progressBar = document.getElementById("progress-bar");
              const progressText = document.getElementById("progress-text");
              progressBar.value = progress;
              progressText.textContent = `Uploading Images... ${Math.round(
                progress
              )}%`;
            },
            function error(error) {
              alert("Error uploading images: " + error.message);
            }
          );

          return imageUpload.then((imageSnapshot) =>
            imageSnapshot.ref.getDownloadURL()
          );
        });

        Promise.all(imagePromises)
          .then((imageUrls) => {
            const studentID = txtStudentID.value;
            db.collection("students")
              .where("studentID", "==", studentID)
              .get()
              .then((querySnapshot) => {
                if (!querySnapshot.empty) {
                  const projectID = db.collection("researchProjects").doc().id;

                  pdfUpload.snapshot.ref
                    .getDownloadURL()
                    .then((pdfUrl) => {
                      db.collection("researchProjects")
                        .doc(projectID)
                        .set({
                          projectID: projectID,
                          researchTitle: txtResearchTitle.value,
                          areaOfInterest: txtAreaofInterest.value,
                          studentID: studentID,
                          schoolGrade: txtSchoolGrade.value,
                          topicDescription: txtTopicDescription.value,
                          pdfUrl: pdfUrl,
                          images: imageUrls,
                          conclusions: txtConclusions.value,
                          finalRecommendations: txtRecommendations.value,
                        })
                        .then(function () {
                          alert("Project Added Successfully: " + projectID);
                          clearFormFields();
                        })
                        .catch(function (error) {
                          alert(
                            "Error adding the document to Firestore: " +
                              error.message
                          );
                        });
                    })
                    .catch((pdfError) => {
                      alert(
                        "Error getting PDF download URL: " + pdfError.message
                      );
                    });
                } else {
                  alert(
                    "The student with the specified studentID does not exist."
                  );
                }
              })
              .catch((error) => {
                alert("Error checking if student exists: " + error.message);
              });
          })
          .catch((error) => {
            alert("Error uploading images: " + error.message);
          });
      }
    );
  }
});

function clearFormFields() {
  txtResearchTitle.value = "";
  txtAreaofInterest.value = "";
  txtStudentID.value = "";
  txtSchoolGrade.value = "";
  txtTopicDescription.value = "";
  txtPdfFile.value = "";
  txtImages.value = "";
  txtConclusions.value = "";
  txtRecommendations.value = "";

  if (form) {
    form.reset();
  } else {
    console.error("Form element is null. Unable to reset.");
  }

  txtResearchTitle.focus();

  const progressContainer = document.getElementById("progress-container");
  progressContainer.style.display = "none";
}

function validateForm() {
  const researchTitle = txtResearchTitle.value.trim();
  if (!researchTitle || typeof researchTitle !== "string") {
    alert("Please enter a valid Research Title.");
    return false;
  }

  const areaOfInterest = txtAreaofInterest.value.trim();
  if (!areaOfInterest || typeof areaOfInterest !== "string") {
    alert("Please enter a valid Area of Interest.");
    return false;
  }

  const studentID = txtStudentID.value.trim();
  if (!/^\d{9}$/.test(studentID)) {
    alert("Please enter a valid 9-digit Student ID.");
    return false;
  }

  const schoolGrade = txtSchoolGrade.value.trim();
  if (!schoolGrade || typeof schoolGrade !== "string") {
    alert("Please enter a valid School Grade.");
    return false;
  }

  const topicDescription = txtTopicDescription.value.trim();
  if (topicDescription.length > 500 || typeof topicDescription !== "string") {
    alert(
      "Topic Description should be a string with a maximum of 500 characters."
    );
    return false;
  }

  const pdfFiles = txtPdfFile.files;
  if (!pdfFiles || pdfFiles.length !== 1) {
    alert("Please select exactly one PDF file.");
    return false;
  }

  const imageFiles = txtImages.files;
  if (!imageFiles || imageFiles.length < 4 || imageFiles.length > 6) {
    alert("Please select between 4 and 6 image files.");
    return false;
  }

  const conclusions = txtConclusions.value.trim();
  if (conclusions.length > 500 || typeof conclusions !== "string") {
    alert("Conclusions should be a string with a maximum of 500 characters.");
    return false;
  }

  const finalRecommendations = txtRecommendations.value.trim();
  if (
    finalRecommendations.length > 500 ||
    typeof finalRecommendations !== "string"
  ) {
    alert(
      "Final Recommendations should be a string with a maximum of 500 characters."
    );
    return false;
  }

  return true;
}
