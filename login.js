document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://nathanael-spriet.fr:1111/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.text();
    })
    .then(userId => {
        sessionStorage.setItem('userId', userId);
        window.location.href = 'index.html';
        console.log(sessionStorage.getItem("userId"))
    })
    .catch(error => {
        console.error('Error logging in:', error);
        document.getElementById('error-message').textContent = "Erreur lors de la connexion.";
    });
});

