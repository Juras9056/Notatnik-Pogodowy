async function getWeather() {
  const city = document.getElementById('city').value;
  const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a98258fdf8dc948a49a8d91bf76dd690&units=metric`);
  const data = await res.json();
  document.getElementById('weatherResult').innerText = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
}

// IndexedDB
let db;
const request = indexedDB.open("notesDB", 1);
request.onerror = () => console.log("Błąd IndexedDB");
request.onsuccess = (e) => {
  db = e.target.result;
  loadNotes();
};
request.onupgradeneeded = (e) => {
  db = e.target.result;
  db.createObjectStore("notes", { autoIncrement: true });
};

function saveNote() {
  const note = document.getElementById('noteInput').value;
  const tx = db.transaction("notes", "readwrite");
  const store = tx.objectStore("notes");
  store.add(note);
  tx.oncomplete = () => {
    document.getElementById('noteInput').value = '';
    loadNotes();
  };
}

function loadNotes() {
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");
  const request = store.getAll();
  request.onsuccess = () => {
    const list = document.getElementById('notesList');
    if (list) {
      list.innerHTML = '';
      request.result.forEach(note => {
        const li = document.createElement('li');
        li.textContent = note;
        list.appendChild(li);
      });
    }
  };
}
