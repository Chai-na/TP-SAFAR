document.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        document.getElementById('cart').textContent = "Votre panier est vide.";
        document.getElementById('checkout').style.display = 'none';
        return;
    }

    cart.forEach(scheduleId => {
        fetch(`http://nathanael-spriet.fr:1111/schedules/info/${scheduleId}`)
            .then(response => response.json())
            .then(schedule => {
                displayCart(schedule);
            })
            .catch(error => console.error('Error fetching schedule:', error));
    });

    document.getElementById('checkout').addEventListener('click', () => {
        window.location.href = 'checkout.html';
    });
});

function displayCart(schedule) {
    const cartDiv = document.getElementById('cart');
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
        <p><strong>Départ :</strong> ${schedule.travel.from.city} - ${schedule.travel.from.name} à ${schedule.departureTime}</p>
        <p><strong>Arrivée :</strong> ${schedule.travel.to.city} - ${schedule.travel.to.name} à ${schedule.arrivalTime}</p>
        <p><strong>Type :</strong> ${schedule.travel.type}</p>
        <p><strong>Durée :</strong> ${schedule.travel.duration} minutes</p>
        <p><strong>Prix :</strong> ${schedule.price} €</p>
        <button onclick="removeFromCart(${schedule.id})">Retirer</button>
    `;
    cartDiv.appendChild(item);
}

function removeFromCart(scheduleId) {
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    cart = cart.filter(id => id !== scheduleId);
    sessionStorage.setItem('cart', JSON.stringify(cart));
    window.location.reload();
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
