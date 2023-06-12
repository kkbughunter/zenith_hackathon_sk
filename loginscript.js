// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database instance
var database = firebase.database();



function login() {
    const emailInput = document.getElementById('logemail');
    const passwordInput = document.getElementById('logpass');
    const email = emailInput.value;
    const password = passwordInput.value;
    database.ref("user").once("value", snapshot => {
        const userdata = snapshot.val();
        const keys = Object.keys(userdata);
        const values = Object.values(userdata);

        for(let i = 0; i < keys.length; i++){
            if(keys[i] === email && values[i] === password){
                // Store the string value in localStorage
                localStorage.setItem("myString",email);
                window.location.replace("index1.html");
            }
        }
    });

}

  
