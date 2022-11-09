
let productStorage = JSON.parse(localStorage.getItem("produit"));

function emptyCart() {
  const creatArticleCartItem = document.createElement("article");
  creatArticleCartItem.classList.add("cart__item");
  const newArticleCartItem = document
    .querySelector("#cart__items")
    .appendChild(creatArticleCartItem);
  newArticleCartItem.innerHTML = "<p>Le panier est vide</p>";
}

const cartProductDisplay = (a) => {
  a = 0; 
  if (!productStorage) {
    emptyCart();
  } else {
    for (let product of productStorage) {
      const creatArticleCartItem = document.createElement("article");
      creatArticleCartItem.classList.add("cart__item");
      creatArticleCartItem.setAttribute("data-id", `${product.id}`);
      creatArticleCartItem.setAttribute("data-color", `${product.color}`);
      const newArticleCartItem = document.querySelector("#cart__items");
      newArticleCartItem.appendChild(creatArticleCartItem);

      const section = document.querySelectorAll("#cart__items article")[a];

      section.innerHTML = `
      <div class="cart__item__img">
      <img
          src="${product.img}"
          alt="${product.alt}"
      />
      </div>
      <div class="cart__item__content">
      <div class="cart__item__content__description">
          <h2>${product.kName}</h2>
          <p>${product.color}</p>
          <p>${product.price * product.quantity} €</p>
      </div>
      <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
          <p>Qté :</p>
          <input
              type="number"
              class="itemQuantity"
              name="itemQuantity"
              min="1"
              max="100"
              value="${product.quantity}"
          />
          </div>
          <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
          </div>
      </div>
      </div>
      `;
      a = a + 1;
    }
  }
};
cartProductDisplay();
let sumTotals = 0;
let priceTotals = 0;

const totalsProductAndPrice = () => {
  if (productStorage) {
    for (let t = 0; t < productStorage.length; t++) {
      sumTotals += parseInt(productStorage[t].quantity);
      priceTotals +=
        parseInt(productStorage[t].price) *
        parseInt(productStorage[t].quantity);
    }
  }
};
totalsProductAndPrice();

function displayResults() {
  document.querySelector("#totalQuantity").innerHTML = sumTotals;
  document.querySelector("#totalPrice").innerHTML = priceTotals;
}
displayResults();
function deleteItem(item) {
  productStorage.splice([item], 1);
  localStorage.setItem("produit", JSON.stringify(productStorage));
  alert("Ce produit a été supprimer du panier");
  window.location.href = "cart.html";
  if (productStorage.length < 1) {
    localStorage.removeItem("produit");
    emptyCart();
  }
}