document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityFrom = urlParams.get('cityFrom');
    const stationFrom = urlParams.get('stationFrom');
    const cityTo = urlParams.get('cityTo');
    const stationTo = urlParams.get('stationTo');
    const date = urlParams.get('date');

    fetch(`http://nathanael-spriet.fr:1111/schedules?cityFrom=${cityFrom}&stationFrom=${stationFrom}&cityTo=${cityTo}&stationTo=${stationTo}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            displayResults(data);
        })
        .catch(error => console.error('Error fetching schedules:', error));
});

function displayResults(schedules) {
    const resultsDiv = document.getElementById('results');
    if (schedules.length === 0) {
        resultsDiv.textContent = "Aucun résultat trouvé.";
        return;
    }

    schedules.forEach(schedule => {
        const result = document.createElement('div');
        result.className = 'result';
        result.innerHTML = `
            <p><strong>Départ :</strong> ${schedule.travel.from.city} - ${schedule.travel.from.name} à ${schedule.departureTime}</p>
            <p><strong>Arrivée :</strong> ${schedule.travel.to.city} - ${schedule.travel.to.name} à ${schedule.arrivalTime}</p>
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
    if (!cart.includes(scheduleId)) {
        cart.push(scheduleId);
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    alert("Billet ajouté au panier.");
}

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
