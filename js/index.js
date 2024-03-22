//Används för att hämta nuvarande växelkurs från USD och uppdatera exchangeRateUSDToSEK med hälp av AJAX.
function fetchExchangeRate() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://open.er-api.com/v6/latest/USD',
            type: 'GET',
            success: function(data) {
                resolve(data.rates.SEK);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

//Använder AJAX/jQuery för att hämta produkterna, returnerar ett promise objekt, som ovan
function fetchProducts() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://fakestoreapi.com/products',
            type: 'GET',
            success: function(data) {
                resolve(data);
            },
            error: function(xhr, status, error) {
                reject(error);
            }
        });
    });
}

async function fetchAndDisplayProducts() {
    try {
        //Vi kallar på funktionerna med await så de blir klara innan vi fortsätter i metoden
        const exchangeRate = await fetchExchangeRate();
        console.log('Updated exchange rate:', exchangeRate);

        const products = await fetchProducts();
        const productDisplay = document.getElementById("productDisplay");

        products.forEach(item => {
            const priceInSEK = (item.price * exchangeRate).toFixed(2);
            //Ser till att priset har 2 decimaler
            const formattedPrice = parseFloat(priceInSEK).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const markup = `
              <div class="col mb-5">
                  <div class="card h-100" data-item-id="${item.id}">
                      <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${item.category}</div>
                      <img class="card-img-top" id="img-${item.id}" src="${item.image}" alt="${item.title}" />
                      <div class="card-body p-4">
                          <div class="text-center" id="price-${item.id}">
                          <h5 class="fw-bolder" id="title-${item.id}">${item.title}</h5>
                              <div class="d-flex justify-content-center small text-warning mb-2">
                                  ${generateStars(item.rating.rate)}
                              </div>
                          ${formattedPrice} SEK</div>
                          </div>
                          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                              <div class="text-center"><a class="btn btn-dark mt-auto" id="addToCartBtn">Lägg till i varukorg</a></div>
                          </div>
                      </div>
                  </div>
              </div>`;
            productDisplay.insertAdjacentHTML("beforeend", markup);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

    //Funktion som tar in "item.rating.rate" och rundar den till närmsta heltal, returnerar en sträng med kod för fyllda/tomma stjärnor
  function generateStars(rating) {
      const starCount = Math.round(rating);
      let stars = '';
      for (let i = 0; i < 5; i++) {
          if (i < starCount) {
              stars += '<div class="bi-star-fill"></div>';
          } else {
              stars += '<div class="bi-star"></div>';
          }
      }
      return stars;
  }

  async function onPageLoad() {
      try {
          await fetchAndDisplayProducts();
      } catch (error) {
          console.error('Error on page load:', error);
      }
  }
  

  function addToCart(item, button) {

    //Hämtar produkter som redan finns i varukorgen eller sätter en tom array ([])
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Kollar via id ifall produkten redan finns
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        // Ökar med 1 ifall produkten finns
        existingItem.quantity++;
    } else {
        // Lägger till produkten med antal 1
        item.quantity = 1;
        //push lägger till "item"(produkten) i cartItems arrayen
        cartItems.push(item);

        const cartCount = document.getElementById('varukorgAntal');
        cartCount.textContent = parseInt(cartCount.textContent) + 1;
    }

    //Sparar till localStorage, cartItems är nyckeln, värdet är information om produkten
    // Med JSON.stringify sparas arrayen i rätt format
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    //Ändrar text när man klickar på knappen
    button.textContent = 'Tillagd i varukorgen';

    //Ändrar text efter 3 sekunder
    setTimeout(function() {
        button.textContent = 'Lägg till ännu en';
    }, 3000);
}

function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartCount = document.getElementById('varukorgAntal');
    cartCount.textContent = cartItems.length;
}

//Lyssnar ifall vi klickar på addToCart knappen
document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'addToCartBtn') {
        const product = event.target.closest('.card');

        
        const id = product.dataset.itemId;
        //Variabler med titel, bild och pris med deras id
const title = document.getElementById(`title-${id}`).textContent;
const image = document.getElementById(`img-${id}`).src;
const priceText = document.getElementById(`price-${id}`).textContent.trim();
//const image = product.querySelector('.card-img-top').src;
//const priceText = product.querySelector('.text-center').textContent.trim(); 

        //Formaterar om priset så att vi kan räkna i varukorgen
        const priceWithComma = priceText.match(/[\d,]+\.\d{2}/g);
        const price = parseFloat(priceWithComma[0].replace(',', '')); 


        //Skapar ett produkt-objekt
        const item = {
            id: id,
            title: title,
            image: image,
            price: price
        };
        //Skickar in produkten och event.target(knappen) i addToCart 
        addToCart(item, event.target);

    }
});


window.addEventListener('load', updateCartCount);

window.onload = onPageLoad;