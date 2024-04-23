var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const txtfullName = document.querySelector("#txtfullName");
const txtschoolGrade = document.querySelector("#txtschoolGrade");
const txtaboutMe = document.querySelector("#txtaboutMe");
const txtprofilePictureURL = document.querySelector("#txtprofilePictureURL");
const txtStudentID = document.querySelector("#txtStudentID");
const btnSaveData = document.querySelector("#btnSaveData");
const form = document.querySelector("#studentForm");

btnSaveData.addEventListener("click", function (event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const archivo = txtprofilePictureURL.files[0];

  if (!archivo) {
    alert("You must select an image");
  } else {
    const metadata = {
      contentType: archivo.type,
    };

    const subir = container
      .child("students/" + archivo.name)
      .put(archivo, metadata);
    subir
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((url) => {
        const studentID = db.collection("students").doc().id;

        db.collection("students")
          .doc(studentID)
          .set({
            studentID: txtStudentID.value,
            fullName: txtfullName.value,
            schoolGrade: txtschoolGrade.value,
            aboutMe: txtaboutMe.value,
            profilePictureURL: url,
          })
          .then(function () {
            alert("Student Added Successfully: " + studentID);
            clearFormFields();
          })
          .catch(function (FirebaseError) {
            alert("Error adding the document: " + FirebaseError.message);
          });
      })
      .catch(function (FirebaseError) {
        alert("Error getting the URL of the image: " + FirebaseError.message);
      });
  }
});

function clearFormFields() {
  txtStudentID.value = "";
  txtfullName.value = "";
  txtschoolGrade.value = "";
  txtaboutMe.value = "";
  txtprofilePictureURL.value = "";

  if (form) {
    form.reset();
  } else {
    console.error("Form element is null. Unable to reset.");
  }

  txtfullName.focus();
}

function validateForm() {
  const studentID = txtStudentID.value.trim();
  if (!/^\d{9}$/.test(studentID)) {
    alert("Please enter a valid 9-digit Student ID.");
    return false;
  }

  const fullName = txtfullName.value.trim();
  if (!fullName) {
    alert("Please enter a valid Full Name.");
    return false;
  }

  const schoolGrade = txtschoolGrade.value.trim();
  if (!schoolGrade) {
    alert("Please enter a valid School Grade.");
    return false;
  }

  const aboutMe = txtaboutMe.value.trim();
  if (!aboutMe) {
    alert("Please enter a valid About Me.");
    return false;
  }

  const profilePictureFiles = txtprofilePictureURL.files;
  if (!profilePictureFiles || profilePictureFiles.length !== 1) {
    alert("Please select exactly one profile picture.");
    return false;
  }

  return true;
}
