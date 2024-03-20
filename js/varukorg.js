function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountContainer = document.getElementById('totalAmount');
    const emptyCartMessageContainer = document.getElementById('emptyCartMessage');
    cartItemsContainer.innerHTML = '';
    
    let totalAmount = 0;
    if (cartItems.length === 0) {
        emptyCartMessageContainer.textContent = 'Varukorgen är tom.';
        cartItemsContainer.style.display = 'none';
        totalAmountContainer.textContent = '';
        return; 
    } else {
        emptyCartMessageContainer.textContent = ''; 
        cartItemsContainer.style.display = 'block'; 
    }

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

    
    totalAmountContainer.textContent = `Summa totalt: ${totalAmount.toFixed(2)} SEK`
}



function calculateTotalAmount(cartItems) {
    let totalAmount = 0;
    cartItems.forEach(item => {
        totalAmount += item.price * item.quantity;
    });
}


function removeAllItems() {
    localStorage.removeItem('cartItems');
    displayCartItems();
    updateCartCount();
}


const removeAllItemsBtn = document.getElementById('removeAllItemsBtn');
removeAllItemsBtn.addEventListener('click', removeAllItems);



function incrementQuantity(itemId) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity++;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        displayCartItems();
    }
}


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


function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.getElementById('varukorgAntal');
    cartCount.textContent = cartItems.length;
}


window.onload = function() {
    updateCartCount();
    displayCartItems();
};