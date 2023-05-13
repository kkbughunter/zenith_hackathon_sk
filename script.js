const modeBtn = document.getElementById('mode-btn');
const onOffBtn = document.getElementById('onoff-btn');
// Retrieve the string value from localStorage
const username = localStorage.getItem("myString");
console.log(username); // Output: main username
document.getElementById("username").innerHTML = username+"  .";

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
  if (autoState === 0) {
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
database.ref(username+"/"+"statuses/auto").once("value", snapshot => {
  const autoState = snapshot.val();
  setModeBtnState(autoState);
});

database.ref(username+"/"+"statuses/w_pump").once("value", snapshot => {
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
    setAuto(0);
    setModeBtnState(0);
    database.ref(username+"/"+"statuses/w_pump").once("value", snapshot => {
      const w_pumpState = snapshot.val();
      setW_pumpState(w_pumpState);
    });
  } else {
    modeBtn.classList.remove('manual-mode');
    modeBtn.classList.add('auto-mode');
    modeBtn.textContent = 'Auto';
    onOffBtn.style.display = 'none';
    setAuto(1);
    setModeBtnState(1);
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
  var dataRef = database.ref(username+"/"+"statuses");
  dataRef.update({
    auto: val
  });
}

function setW_pump(val) {
  var dataRef = database.ref(username+"/"+"statuses");
  dataRef.update({
    w_pump: val
  });
}

database.ref(username+"/"+"info/temp").once("value", snapshot =>{
  var temperature = snapshot.val();
  document.getElementById("temp").innerHTML = ("Temperature: "+temperature)+"*C";
});

database.ref(username+"/"+"info/updated_time/date").once("value", snapshot =>{
  var date = snapshot.val();
  document.getElementById("updated-date").innerHTML = (date);
});
database.ref(username+"/"+"info/updated_time/time").once("value", snapshot =>{
  var time = snapshot.val();
  document.getElementById("updated-time").innerHTML = (time);
});

database.ref(username+"/"+"field_geo_data/probability_list").once("value", snapshot => {
  const probability_list  = snapshot.val();
  var probability_js_list = [];
  for (var key in probability_list) {
    probability_js_list.push(probability_list[key]);
  }
});

database.ref(username+"/"+"field_geo_data/rain_list").once("value", snapshot => {
  const rain_list  = snapshot.val();
  var rain_js_list = [];
  for (var key in rain_list) {
    rain_js_list.push(rain_list[key]);
  }
});

const probabilityChart = new Chart(document.getElementById("probability_graph"), {
  type: "line",
  data: {
    labels: [], // x-axis labels
    datasets: [{
      label: "Probability",
      data: [], // y-axis data
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});


database.ref(username+"/"+"field_geo_data/probability_list").once("value", snapshot => {
  const probability_list = snapshot.val();
  const labels = Object.keys(probability_list);
  const data = Object.values(probability_list);
  probabilityChart.data.labels = labels;
  probabilityChart.data.datasets[0].data = data;
  probabilityChart.update();
});

const rainChart = new Chart(document.getElementById("rain_graph"), {
  type: "bar",
  data: {
    labels: [], // x-axis labels
    datasets: [{
      label: "Rain fall",
      data: [], // y-axis data
      backgroundColor: "rgba(0, 0, 255, 0.566)",
      borderColor: "rgba(0, 0, 255, 0.566)",
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});


database.ref(username+"/"+"field_geo_data/rain_list").once("value", snapshot => {
  const rain_list = snapshot.val();
  const labels = Object.keys(rain_list);
  const data = Object.values(rain_list);
  rainChart.data.labels = labels;
  rainChart.data.datasets[0].data = data;
  rainChart.update();
});
