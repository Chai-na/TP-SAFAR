document.addEventListener("DOMContentLoaded", () => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
        document.getElementById('future-reservations').textContent = "Vous devez être connecté pour voir vos réservations.";
        document.getElementById('past-reservations').textContent = "Vous devez être connecté pour voir vos réservations.";
        return;
    }

    fetch(`http://nathanael-spriet.fr:1111/users/history/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des réservations.');
            }
            return response.json();
        })
        .then(reservations => {
            const now = new Date();
            const futureReservations = reservations.filter(reservation => new Date(`${reservation.schedule.date}T${reservation.schedule.departureTime}`) >= now);
            const pastReservations = reservations.filter(reservation => new Date(`${reservation.schedule.date}T${reservation.schedule.departureTime}`) < now);
            displayReservations(futureReservations, 'future-reservations');
            displayReservations(pastReservations, 'past-reservations');
        })
        .catch(error => {
            console.error('Error fetching reservations:', error);
            document.getElementById('future-reservations').textContent = "Erreur lors de la récupération des réservations.";
            document.getElementById('past-reservations').textContent = "Erreur lors de la récupération des réservations.";
        });

    document.getElementById('logout').addEventListener('click', () => {
        fetch('http://nathanael-spriet.fr:1111/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId })
        }).then(() => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }).catch(error => {
            console.error('Error logging out:', error);
        });
    });
});

function displayReservations(reservations, containerId) {
    const reservationsDiv = document.getElementById(containerId);
    if (reservations.length === 0) {
        reservationsDiv.textContent = "Vous n'avez pas de réservations pour cette catégorie.";
        return;
    }

    reservations.forEach(reservation => {
        const item = document.createElement('div');
        item.className = 'reservation-item';
        item.innerHTML = `
            <p><strong>Départ :</strong> ${reservation.schedule.date} ${reservation.schedule.departureTime} (${reservation.schedule.travel.from.city} - ${reservation.schedule.travel.from.name})</p>
            <p><strong>Arrivée :</strong> ${reservation.schedule.travel.to.city} - ${reservation.schedule.travel.to.name}</p>
            <p><strong>Type :</strong> ${reservation.schedule.travel.type}</p>
            <p><strong>Durée :</strong> ${reservation.schedule.travel.duration} minutes</p>
            <p><strong>Prix :</strong> ${reservation.schedule.price} €</p>
            <p><strong>Nom :</strong> ${reservation.info.surname}</p>
            <p><strong>Prénom :</strong> ${reservation.info.firstname}</p>
        `;
        reservationsDiv.appendChild(item);
    });
}
