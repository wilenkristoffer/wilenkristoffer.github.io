
//Hämtar all data som är ifyllt när vi klickar på skicka, skickar sedan vidare allt via url:n
document.getElementById('orderForm').addEventListener('submit', function (event) {
    event.preventDefault(); 
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        tel: document.getElementById('tel').value,
        address: document.getElementById('gatunamn').value,
        ort: document.getElementById('ort').value,
        postnr: document.getElementById('postnr').value
    };

    console.log('Form Data:', formData);

    
    const params = new URLSearchParams(formData);

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');
    const confirmationUrl = `confirmation.html?productId=${productId}&${params.toString()}`;

    window.location.href = confirmationUrl;
});

//Funktion för att hämta senaste datat som användaren skrivit i formuläret
window.onload = function() {
    document.getElementById('name').value = localStorage.getItem('name') || '';
    document.getElementById('email').value = localStorage.getItem('email') || '';
    document.getElementById('tel').value = localStorage.getItem('tel') || '';
    document.getElementById('gatunamn').value = localStorage.getItem('gatunamn') || '';
    document.getElementById('ort').value = localStorage.getItem('ort') || '';
    document.getElementById('postnr').value = localStorage.getItem('postnr') || '';
};

// Sparar i localStorage när man ändrar i formuläret
document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', function() {
        localStorage.setItem(input.id, input.value);
    });
});