document.addEventListener("DOMContentLoaded", () => {
    fetch('http://nathanael-spriet.fr:1111/stations')
        .then(response => response.json())
        .then(data => {
            populateStationSelect("from", data);
            populateStationSelect("to", data);
        })
        .catch(error => console.error('Error fetching stations:', error));

    populateTimeSelect("timeFrom");

    document.getElementById('logout').addEventListener('click', () => {
        const userId = sessionStorage.getItem('userId');
        fetch('http://nathanael-spriet.fr:1111/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId })
        }).then(() => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });
    });

    document.getElementById('ticket-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const fromSelect = document.getElementById('from');
        const toSelect = document.getElementById('to');
        const dateInput = document.getElementById('date');
        const timeFromSelect = document.getElementById('timeFrom');
        const errorMessage = document.getElementById('error-message');

        if (fromSelect.value === toSelect.value) {
            errorMessage.textContent = "La gare de départ et la gare d'arrivée doivent être différentes.";
            return;
        }

        const stationFrom = fromSelect.value;
        const stationTo = toSelect.value;
        const date = dateInput.value;
        const timeFrom = timeFromSelect.value;

        fetch(`http://nathanael-spriet.fr:1111/schedules?stationFrom=${stationFrom}&stationTo=${stationTo}&date=${date}&timeFrom=${timeFrom}`)
            .then(response => response.json())
            .then(schedules => {
                if (schedules.length === 0) {
                    errorMessage.textContent = "Aucun résultat trouvé.";
                } else {
                    displayResults(schedules);
                }
            })
            .catch(error => {
                console.error('Error fetching schedules:', error);
                errorMessage.textContent = "Erreur lors de la recherche des horaires.";
            });
    });
});

function populateStationSelect(selectId, stations) {
    const select = document.getElementById(selectId);
    stations.forEach(station => {
        const option = document.createElement("option");
        option.value = station.id;
        option.textContent = `${station.city} - ${station.name}`;
        select.appendChild(option);
    });
}

function populateTimeSelect(selectId) {
    const select = document.getElementById(selectId);
    for (let hour = 0; hour < 24; hour++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            select.appendChild(option);
        }
    }
}

function displayResults(schedules) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    schedules.forEach(schedule => {
        const result = document.createElement('div');
        result.className = 'result';
        result.innerHTML = `
            <p><strong>Départ :</strong> ${schedule.date} ${schedule.departureTime} (${schedule.travel.from.city} - ${schedule.travel.from.name})</p>
            <p><strong>Arrivée :</strong> ${schedule.travel.to.city} - ${schedule.travel.to.name}</p>
            <p><strong>Type :</strong> ${schedule.travel.type}</p>
            <p><strong>Durée :</strong> ${schedule.travel.duration} minutes</p>
            <p><strong>Prix :</strong> ${schedule.price} €</p>
            <button onclick="addToCart(${schedule.id})">Ajouter au Panier</button>
        `;
        resultsDiv.appendChild(result);
    });
}

function addToCart(scheduleId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    cart.push(scheduleId);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert("Billet ajouté au panier.");
}
