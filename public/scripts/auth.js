import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {getDatabase,set,ref,update} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

async function getFirebaseConfig() {
    const response = await fetch('/firebase-config');
    return response.json();
};

getFirebaseConfig().then(firebaseConfig=> {

    // Initialize Firebase for Registration
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth();
    // const dbRef = ref(db);

    const registerBtn = document.getElementById('register-btn');

    registerBtn.addEventListener('click', (e) => {
        let email = document.getElementById('email-reg-Inp').value;
        let username = document.getElementById('username-reg-Inp').value;
        let password = document.getElementById('password-reg-Inp').value;
        // alert('btn clicked');
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //signed in
                const user = userCredential.user;
                // console.log("adding user");
                set(ref(db, 'users/' + user.uid), {
                    username: username,
                    email: email,
                })
                alert('user created');
            })
            .catch((e) => {
                //error not signed in
                alert(e.message)
            })

    });
    //intialization firabase for Login

    const loginBtn= document.getElementById('login-btn');
    //
    loginBtn.addEventListener('click',(e)=>{
        let email = document.getElementById('email-login-Inp').value;
        let password = document.getElementById('password-login-Inp').value;

        signInWithEmailAndPassword(auth,email,password).
            then((userCredential)=>{
                const user = userCredential.user;
                const dt = new Date();
                update(ref(db, 'users/' + user.uid), {
                    last_login : dt,
                })
                alert('User logged in');
        })
        .catch((error)=>{
            alert(error.message);
            console.error(error.message, error.code);
        })




    })

});


