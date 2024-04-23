var db = firebase.apps[0].firestore();
var auth = firebase.apps[0].auth();

const txtNombre = document.querySelector("#txtNombre");
const txtEmail = document.querySelector("#txtEmail");
const txtContra = document.querySelector("#txtContra");

const btnInsUser = document.querySelector("#btnInsUser");

btnInsUser.addEventListener("click", function () {
  auth
    .createUserWithEmailAndPassword(txtEmail.value, txtContra.value)
    .then((userCredential) => {
      const user = userCredential.user;

      db.collection("datosUsuarios")
        .add({
          idemp: user.uid,
          usuario: txtNombre.value,
          email: user.email,
        })
        .then(function (docRef) {
          alert("User added successfully");
          document.location.href = "login.html";
        })
        .catch(function (FirebaseError) {
          alert("Error adding user data: " + FirebaseError);
        });
    })
    .catch((error) => {
      alert("Error adding new user: " + error.message);
    });
});
