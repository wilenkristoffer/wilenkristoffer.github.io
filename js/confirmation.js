// Hämtar produktinfo
function fetchProductDetails(productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
      .then(res => res.json())
      .then(data => {
          document.getElementById('productTitle').innerText = data.title;
          document.getElementById('productImage').src = data.image;
          document.getElementById('productDescription').innerText = data.description;
      })
      .catch(error => console.error('Error fetching product details:', error));
}

//Lägger in datat från url:n i en lista
function populateCustomerInfo(formData) {
  document.getElementById('customerName').innerText = formData.name;
  document.getElementById('customerEmail').innerText = formData.email;
  document.getElementById('customerTel').innerText = formData.tel;
  document.getElementById('customerAddress').innerText = formData.address;
  document.getElementById('customerOrt').innerText = formData.ort;
  document.getElementById('customerPostnr').innerText = formData.postnr;
}

// Körs när sidan laddar
function onPageLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');

  
  fetchProductDetails(productId);

  //Hämtar data från url/form
  const formData = {
      name: urlParams.get('name'),
      email: urlParams.get('email'),
      tel: urlParams.get('tel'),
      address: urlParams.get('address'),
      ort: urlParams.get('ort'),
      postnr: urlParams.get('postnr')
  };

  populateCustomerInfo(formData);
}

window.onload = onPageLoad;