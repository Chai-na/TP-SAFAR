document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const surname = document.getElementById('surname').value;
    const firstname = document.getElementById('firstname').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postcode = document.getElementById('postcode').value;

    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Votre panier est vide.");
        return;
    }

    const userId = sessionStorage.getItem('userId');
    const bookingInfo = {
        info: {
            address: { number: "", street: address, city: city, postcode: postcode },
            surname: surname,
            firstname: firstname,
            mail: email,
            user: userId ? userId : undefined
        },
        schedules: cart
    };

    fetch('http://nathanael-spriet.fr:1111/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingInfo)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Booking failed');
        }
        return response.json();
    })
    .then(tickets => {
        alert("Commande réussie !");
        sessionStorage.removeItem('cart');
        window.location.href = 'reservations.html';
    })
    .catch(error => {
        console.error('Request failed:', error);
        alert("Erreur lors de la commande.");
    });
});
