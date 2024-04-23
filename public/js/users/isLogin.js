var auth = firebase.apps[0].auth();
var inactivityTimeout;

function validar() {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resetInactivityTimer();
        resolve(user.uid);
      } else {
        reject(new Error("User not authenticated"));
      }
    });
  });
}

function salir() {
  clearTimeout(inactivityTimeout);

  auth
    .signOut()
    .then(() => {
      alert("Log out success");
      document.location.href = "index.html";
    })
    .catch((error) => {
      alert("Error logging out: " + error.message);
    });
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);

  inactivityTimeout = setTimeout(() => {
    salir();
  }, 60000);
}

document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);

validar()
  .then((uid) => {
    console.log("User UID:", uid);
  })
  .catch((error) => {
    console.error(error.message);
    document.location.href = "login.html";
  });
