async function getWeather() {
  const city = document.getElementById('city').value;

  if (!city.trim()) {
    document.getElementById('weatherResult').innerText = '⚠️ Nie wpisano miasta.';
    return;
  }

  if (!navigator.onLine) {
    document.getElementById('weatherResult').innerText = '⚠️ Brak internetu. Pogoda nie może zostać pobrana.';
    return;
  }

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=8bc7141bc4cdfb119dd4651d5ef661fc&units=metric`);
    const data = await res.json();

    if (!data || !data.main) {
      document.getElementById('weatherResult').innerText = '❌ Nie znaleziono miasta.';
      return;
    }

    document.getElementById('weatherResult').innerText = `${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`;
  } catch (err) {
    document.getElementById('weatherResult').innerText = '❌ Błąd podczas pobierania danych pogodowych.';
    console.error(err);
  }
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
