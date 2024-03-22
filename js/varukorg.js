/* -----------------------------------------------------Gammal kod utan jQuery-----------------------------------------------------


function displayCartItems() {
    //Vi hämtar produkter ffån localStorage med getItem
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountContainer = document.getElementById('totalAmount');
    const emptyCartMessageContainer = document.getElementById('emptyCartMessage');
    cartItemsContainer.innerHTML = '';
    
    let totalAmount = 0;
    //Om cartItems arrayen är 0 så sätter vi en text som visar att varukorgen är tom.
    if (cartItems.length === 0) {
        emptyCartMessageContainer.textContent = 'Varukorgen är tom.';
        cartItemsContainer.style.display = 'none';
        totalAmountContainer.textContent = '';
        return; 
    } else {
        emptyCartMessageContainer.textContent = ''; 
        cartItemsContainer.style.display = 'block'; 
    }

    //För varje produkt så skapar vi ett div element, och sätter text på elementet via innerHtml och sedan en markup text. 
    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        const totalPrice = (item.price * item.quantity).toFixed(2);
        totalAmount += parseFloat(totalPrice); 
        itemElement.innerHTML = `
            <div>
                <img src="${item.image}" alt="${item.title}" style="width: 100px; height: 100px;">
                <div>${item.title}</div>
                <div>Pris/st: ${item.price} SEK</div>
                <div>Totalt: ${totalPrice} SEK</div>
                <button class="decrement" data-item-id="${item.id}" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 5px;">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increment" data-item-id="${item.id}" style="background-color: green; color: white; border: none; padding: 5px 10px; border-radius: 5px;">+</button>
            </div>
            <hr>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    //Vi sätter texten för totala summan
    totalAmountContainer.textContent = `Summa totalt: ${totalAmount.toFixed(2)} SEK`
}

*/

//Laddas när vi öppnar sidan efter att DOM har laddats klar, används istället för onLoad
$(document).ready(function() {
    function displayCartItems() {
        //Vi hämtar produkter från localStorage med getItem
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        //DOM med jQuery
        const cartItemsContainer = $('#cartItems');
        const totalAmountContainer = $('#totalAmount');
        const emptyCartMessageContainer = $('#emptyCartMessage');
        cartItemsContainer.empty();
    
        let totalAmount = 0;
         //Om cartItems arrayen är 0 så sätter vi en text som visar att varukorgen är tom.
        if (cartItems.length === 0) {
            //hide/text/show är jQuery metoder istället för de vanliga (innerHtml etc)
            emptyCartMessageContainer.text('Varukorgen är tom.');
            cartItemsContainer.hide();
            totalAmountContainer.text('');
            return;
        } else {
            emptyCartMessageContainer.text('');
            cartItemsContainer.show();
        }
        //För varje produkt så skapar vi ett div element, och sätter text på elementet via innerHtml och sedan en markup text. 
        cartItems.forEach(item => {
            const totalPrice = (item.price * item.quantity).toFixed(2);
            totalAmount += parseFloat(totalPrice);
            const itemElement = `
                <div>
                    <img src="${item.image}" alt="${item.title}" style="width: 250px; height: 250px;">
                    <div>${item.title}</div>
                    <div>Pris/st: ${item.price} SEK</div>
                    <div>Totalt: ${totalPrice} SEK</div>
                    <button class="decrement" data-item-id="${item.id}" style="background-color: red; color: white; border: none; padding: 5px 10px; border-radius: 5px;">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increment" data-item-id="${item.id}" style="background-color: green; color: white; border: none; padding: 5px 10px; border-radius: 5px;">+</button>
                </div>
                <hr>
            `;
            cartItemsContainer.append(itemElement);
        });
        //Vi sätter texten för totala summan
        totalAmountContainer.text(`Summa totalt: ${totalAmount.toFixed(2)} SEK`);
    }

    function removeAllItems() {
        localStorage.removeItem('cartItems');
        displayCartItems();
        updateCartCount();
    }
    
    
    //Funktion för att öka antalet för en specifik vara
    function incrementQuantity(itemId) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cartItems[itemIndex].quantity++;
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            displayCartItems();
        }
    }
    
    //Funktion för att minska antalet för en specifik vara
    function decrementQuantity(itemId) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemIndex = cartItems.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            if (cartItems[itemIndex].quantity === 1) {
                // Tar bort produkten om man klickar "-" när det bara är 1 kvar
                cartItems.splice(itemIndex, 1);
            } else {
                // Annars minskar kvantitet med 1
                cartItems[itemIndex].quantity--;
               
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            displayCartItems();
        }
    }
    
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartCount = document.getElementById('varukorgAntal');
        cartCount.textContent = cartItems.length;
    }

    //Eventhandlers med jQuery
/*  //Fungerar inte med knappar som är genererade, kanske skapas innan DOM är klart??
    $(document).on('click', '.increment', function() {
        const itemId = $(this).data('itemId');
        incrementQuantity(itemId);
    });

    $(document).on('click', '.decrement', function() {
        const itemId = $(this).data('itemId');
        decrementQuantity(itemId);
        updateCartCount();
    });
*/
    $('#removeAllItemsBtn').on('click', function() {
        removeAllItems();
    });

    //Traditionell eventhanterare för increment och decrement
    document.addEventListener('click', function(event) {
        const target = event.target;
        // Kollar ifall det är increment eller decrement och kallar på funktionerna
        if (target.classList.contains('increment')) {
            const itemId = target.dataset.itemId;
            incrementQuantity(itemId);
        } else if (target.classList.contains('decrement')) {
            const itemId = target.dataset.itemId;
            decrementQuantity(itemId);
            updateCartCount();
        }
    });
    

    updateCartCount();
    displayCartItems();
});


