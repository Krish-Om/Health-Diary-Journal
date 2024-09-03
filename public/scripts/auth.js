import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

async function getFirebaseConfig() {
  const response = await fetch("/firebase-config");
  return response.json();
}

function clearInputFields() {
  document.getElementById("email-login-Inp").value = "";
  document.getElementById("password-login-Inp").value = "";
  document.getElementById("username-reg-Inp").value = "";
  document.getElementById("email-reg-Inp").value = "";
  document.getElementById("password-reg-Inp").value = "";
}


function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    return password.length >= 6;
}


getFirebaseConfig().then((firebaseConfig) => {
  // Initialize Firebase for Registration
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const auth = getAuth();

  const registerBtn = document.getElementById("register-btn");
  registerBtn.addEventListener("click", (e) => {
    let email = document.getElementById("email-reg-Inp").value;
    let username = document.getElementById("username-reg-Inp").value;
    let password = document.getElementById("password-reg-Inp").value;
    // alert('btn clicked');
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //signed in
        const user = userCredential.user;
        // console.log("adding user");
        set(ref(db, "users/" + user.uid), {
          username: username,
          email: email,
        });
        alert("user created");
      })
      .catch((e) => {
        //error not signed in
        alert(e.message);
      });
  });

  const loginBtn = document.getElementById("login-btn");
  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let email = document.getElementById("email-login-Inp").value;
    let password = document.getElementById("password-login-Inp").value;

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (!isValidPassword(password)) {
        alert("Password must be at least 6 characters long.");
        return;
    }


    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        const dt = new Date();

        update(ref(db, "users/" + user.uid), {
          last_login: dt,
        });
        alert("User logged in");
        setTimeout(clearInputFields,100);
      })
      .catch((error) => {
        // Error occurred
        //   alert(error.message);
        console.log(error);
      });
  });
});
