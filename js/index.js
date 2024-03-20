//AJAX används för att hämta nuvarande växelkurs från USD och uppdatera exchangeRateUSDToSEK.
async function fetchExchangeRate() {
  const response = await fetch('https://open.er-api.com/v6/latest/USD');
  const data = await response.json();
  return data.rates.SEK;
}

async function updateExchangeRate() {
  try {
      const exchangeRate = await fetchExchangeRate();
      const exchangeRateUSDToSEK = exchangeRate;
      console.log('Updated exchange rate:', exchangeRateUSDToSEK);

  //Hämtar produkterna         
  fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
          const productDisplay = document.getElementById("productDisplay");
          //"bestallning.html?productId=${item.id}" gör så att vi får med id av produkten till beställningssidan
          data.forEach(item => {
              const priceInSEK = (item.price * exchangeRateUSDToSEK).toFixed(2);
              const formattedPrice = parseFloat(priceInSEK).toLocaleString('en-US', {maximumFractionDigits: 2});
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
              //insertAdjacentHTML() parsar om markup texten till html och lägger in i DOM trädet vid "beforeend"
              productDisplay.insertAdjacentHTML("beforeend", markup);
              });
          })
          .catch(error => console.error('Error fetching products:', error));
  } catch (error) {
      console.error('Error fetching exchange rate:', error);
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
          await updateExchangeRate();
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

    // Sparar till localStorage
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

document.addEventListener('click', function(event) {
    if (event.target && event.target.id === 'addToCartBtn') {
        const product = event.target.closest('.card');

        
        const id = product.dataset.itemId;
        //Sätter variabler med titel, bild och pris och deras id
const title = document.getElementById(`title-${id}`).textContent;
const image = document.getElementById(`img-${id}`).src;
const priceText = document.getElementById(`price-${id}`).textContent.trim();
//const image = product.querySelector('.card-img-top').src;
//const priceText = product.querySelector('.text-center').textContent.trim(); 

        //Formaterar om texten så vi kan räkna i varukorgen
        const priceWithComma = priceText.match(/[\d,]+\.\d{2}/g);
        const price = parseFloat(priceWithComma[0].replace(',', '')); 


        //Skapar ett produkt-objekt
        const item = {
            id: id,
            title: title,
            image: image,
            price: price
        };
        //Skickar in produkten i addToCart och event.target(knappen)
        addToCart(item, event.target);

    }
});


window.addEventListener('load', updateCartCount);

window.onload = onPageLoad;