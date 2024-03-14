//Metod för att hämta nuvarande växelkurs från USD och uppdatera exchangeRateUSDToSEK.
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
                    <div class="card h-100">
                        <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">${item.category}</div>
                        <img class="card-img-top" src="${item.image}" alt="${item.title}" />
                        <div class="card-body p-4">
                            <div class="text-center">
                                <h5 class="fw-bolder">${item.title}</h5>
                                <div class="d-flex justify-content-center small text-warning mb-2">
                                    ${generateStars(item.rating.rate)}
                                </div>
                            ${formattedPrice} SEK</div>
                            </div>
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center"><a class="btn btn-dark mt-auto" href="bestallning.html?productId=${item.id}">Beställ</a></div>
                            </div>
                        </div>
                    </div>
                </div>`;
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
    

    window.onload = onPageLoad;