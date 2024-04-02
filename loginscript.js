// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const  firebaseConfig = {
  apiKey: "AIzaSyB6-6vGAQcsuqMm172-IkMomesTy_Uk0Y8",
  authDomain: "weather-pi2app.firebaseapp.com",
  databaseURL: "https://weather-pi2app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "weather-pi2app",
  storageBucket: "weather-pi2app.appspot.com",
  messagingSenderId: "241617772757",
  appId: "1:241617772757:web:534f21ef8fbe302639425c",
  measurementId: "G-T7R1DMZGN1"
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

  
