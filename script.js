const modeBtn = document.getElementById('mode-btn');
const onOffBtn = document.getElementById('onoff-btn');
const username = localStorage.getItem("myString");
console.log(username); // Output: main username
document.getElementById("username").innerHTML = username+"&nbsp;";

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

modeBtn.addEventListener('click', () => {
  if (modeBtn.classList.contains('auto-mode')) {
    modeBtn.classList.remove('auto-mode');
    modeBtn.classList.add('manual-mode');
    modeBtn.textContent = 'Manual';
    onOffBtn.style.display = 'block';
    setAuto(0);
    setModeBtnState(0);
    database.ref(username+"/statuses/w_pump").once("value", snapshot => {
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
  var dataRef = database.ref(username+"/statuses");
  dataRef.update({
    auto: val
  });
}

function setW_pump(val) {
  var dataRef = database.ref(username+"/statuses");
  dataRef.update({
    w_pump: val
  });
}

//  Live Update
function loadData() {
  // Fetch temperature data from Firebase
  database.ref(username+"/info/temp").on("value", function(snapshot) {
    var temperature = snapshot.val();
    document.getElementById("temp").innerHTML = ("Temperature: " + temperature + " <sup>o</sup><em>C</em>");
  });

  database.ref(username+"/info/updated_time/date").on("value", function(snapshot){
    var date = snapshot.val();
    document.getElementById("updated-date").innerHTML = (date);
  });

  database.ref(username+"/info/updated_time/time").on("value", function(snapshot) {
    var time = snapshot.val();
    document.getElementById("updated-time").innerHTML = (time);
  });
  database.ref(username+"/field_geo_data/probability_list").on("value", function(snapshot) {
    const probability_list  = snapshot.val();
    var probability_js_list = [];
    for (var key in probability_list) {
      probability_js_list.push(probability_list[key]);
    }
  });
  
  database.ref(username+"/field_geo_data/rain_list").on("value",function(snapshot) {
    const rain_list  = snapshot.val();
    var rain_js_list = [];
    for (var key in rain_list) {
      rain_js_list.push(rain_list[key]);
    }
  });

  database.ref(username+"/field_geo_data/probability_list").on("value", function(snapshot){
    const probability_list = snapshot.val();
    const labels = Object.keys(probability_list);
    const data = Object.values(probability_list);
    probabilityChart.data.labels = labels;
    probabilityChart.data.datasets[0].data = data;
    probabilityChart.update();
  });

  database.ref(username+"/field_geo_data/rain_list").on("value", function(snapshot) {
    const rain_list = snapshot.val();
    const labels = Object.keys(rain_list);
    const data = Object.values(rain_list);
    rainChart.data.labels = labels;
    rainChart.data.datasets[0].data = data;
    rainChart.update();
  });
  database.ref(username+"/statuses/connection").once("value", function(snapshot) {
    check = snapshot.val();
    // console.log(check)
    if(check['b'] == check['f']){
      statuscheck.classList.remove('status_connected')
      statuscheck.classList.add('status_not_connected')
      statuscheck.textContent = "^  Disconnected"
    }
    else{
      statuscheck.classList.remove("status_not_connected")
      statuscheck.classList.add("status_connected")
      statuscheck.textContent = "^ Connected"
      if(check['b'] == 1){
          var fval = database.ref(username+"/statuses/connection/");
          fval.update({
            f: 0
          });
      }
      else{
          var fval = database.ref(username+"/statuses/connection/");
          fval.update({
            f: 1
          });
      }
    }
  });
  console.log("test")
  database.ref(username+"/statuses/auto").on("value", function(snapshot) {
    const autoState = snapshot.val();
    setModeBtnState(autoState);
    if(autoState == 0) document.getElementById("mod").innerHTML = "MANUAL MODE";
    else document.getElementById("mod").innerHTML = "AUTOMATIC MODE";
  });

  database.ref(username+"/statuses/w_pump").on("value", function(snapshot){
    const w_pumpState = snapshot.val();
    setW_pumpState(w_pumpState);
    if(w_pumpState == 0) document.getElementById("motor").innerHTML = "OFF";
    else document.getElementById("motor").innerHTML = "ON";
  });
  database.ref(username+"/statuses/weather").on("value", function(snapshot){
    const wea = snapshot.val();
    if(wea == 0) document.getElementById("weather_dec").innerHTML = "Automatic motore state OFF";
    else document.getElementById("weather_dec").innerHTML = "Automatic motore state ON";
  });
  database.ref(username+"/statuses/sensor").on("value", function(snapshot){
    const wea = snapshot.val();
    if(wea == 0) document.getElementById("sen").innerHTML = "0";
    else document.getElementById("sen").innerHTML = "1";
  });
  
  database.ref(username+"/statuses/override").on("value", function(snapshot) {
    const State = snapshot.val();
    if(State == 0){
      button1.disabled = true;
      button2.disabled = true;
    }
    else{
      button1.disabled = false;
      button2.disabled = false;
    }
  });
  
}
loadData();
setInterval(loadData, 2000);




const probabilityChart = new Chart(document.getElementById("probability_graph"), {
  type: "bar",
  data: {
    labels: [], // x-axis labels
    datasets: [{
      label: "Probability",
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




const rainChart = new Chart(document.getElementById("rain_graph"), {
  type: "line",
  data: {
    labels: [], // x-axis labels
    datasets: [{
      label: "Rain fall",
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


// /statuses/override
const button1 = document.getElementById("mode-btn");
const button2 = document.getElementById("onoff-btn");
const enable = document.getElementById("enable");
const disable = document.getElementById("disable");
// function to disable the buttons
const disableButtons = () => {
  button1.disabled = true;
  button2.disabled = true;
  var dataRef = database.ref(username+"/statuses");
  dataRef.update({
    override: 0
  });
};
const enableButtons = () => {
  button1.disabled = false;
  button2.disabled = false;
  var dataRef = database.ref(username+"/statuses");
  dataRef.update({
    override: 1
  });
};
// calling the disableButtons() function when the disable button is clicked
disable.addEventListener("click", disableButtons);
// calling the enableButtons() function when the enable button is clicked
enable.addEventListener("click", enableButtons);
