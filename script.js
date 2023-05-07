const modeBtn = document.getElementById('mode-btn');
const onOffBtn = document.getElementById('onoff-btn');


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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

// Function to set mode button state based on auto state in the database
function setModeBtnState(autoState) {
  if (autoState === 1) {
    modeBtn.classList.remove('auto-mode');
    modeBtn.classList.add('manual-mode');
    modeBtn.textContent = 'Manual';
    onOffBtn.style.display = 'block';
  } else {
    modeBtn.classList.remove('manual-mode');
    modeBtn.classList.add('auto-mode');
    modeBtn.textContent = 'Auto';
    onOffBtn.style.display = 'none';
  }
}

// Function to set on/off button state based on w_pump state in the database
function setW_pumpState(w_pumpState) {
  if (w_pumpState === 1) {
    onOffBtn.classList.remove('off-mode');
    onOffBtn.classList.add('on-mode');
    onOffBtn.textContent = 'On';
  } else {
    onOffBtn.classList.remove('on-mode');
    onOffBtn.classList.add('off-mode');
    onOffBtn.textContent = 'Off';
  }
}

// Retrieve auto state and w_pump state from database when page is initially loaded
database.ref("statuses/auto").once("value", snapshot => {
  const autoState = snapshot.val();
  setModeBtnState(autoState);
});

database.ref("statuses/w_pump").once("value", snapshot => {
  const w_pumpState = snapshot.val();
  setW_pumpState(w_pumpState);
});

// Set mode button state and update database when mode button is clicked
modeBtn.addEventListener('click', () => {
  if (modeBtn.classList.contains('auto-mode')) {
    modeBtn.classList.remove('auto-mode');
    modeBtn.classList.add('manual-mode');
    modeBtn.textContent = 'Manual';
    onOffBtn.style.display = 'block';
    setAuto(1);
    setModeBtnState(1);
  } else {
    modeBtn.classList.remove('manual-mode');
    modeBtn.classList.add('auto-mode');
    modeBtn.textContent = 'Auto';
    onOffBtn.style.display = 'none';
    setAuto(0);
    setModeBtnState(0);
    setW_pump(0);             // if auto set on / off to off and change the button to off
    setW_pumpState(0);
  }
});

// Set on/off button state and update database when on/off button is clicked
onOffBtn.addEventListener('click', () => {
  if (onOffBtn.classList.contains('off-mode')) {
    onOffBtn.classList.remove('off-mode');
    onOffBtn.classList.add('on-mode');
    onOffBtn.textContent = 'On';
    setW_pump(1);
    setW_pumpState(1);
  } else {
    onOffBtn.classList.remove('on-mode');
    onOffBtn.classList.add('off-mode');
    onOffBtn.textContent = 'Off';
    setW_pump(0);
    setW_pumpState(0);
  }
});

function setAuto(val) {
  var dataRef = database.ref("statuses");
  dataRef.update({
    auto: val
  });
}

function setW_pump(val) {
  var dataRef = database.ref("statuses");
  dataRef.update({
    w_pump: val
  });
}
