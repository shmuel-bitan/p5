/*--------------------------------------------------------------------------VARIABLES--------------------------------------------------------------------------*/

// Creation des variables.
let elementImage = document.querySelector(".item__img");
let elementName = document.getElementById("title");
let elementPrice = document.getElementById("price");
let elementDescription = document.getElementById("description");
let elementCart = document.getElementById("addToCart");
let id = getIdFromUrl();

/*--------------------------------------------------------------------------FONCTIONS--------------------------------------------------------------------------*/

/**
 * Recuperation de l'ID.
 * @return {id} identifiant du produit voulu.
 */
function getIdFromUrl() {
    let params = new URL(document.location).searchParams;
    let id = params.get("id");
    return id;
}



const getElement = function (id) {

    // Ajout de l'ID sur l'URL.
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })

        .then(function (article) {
            setColorSelect(article.colors);
            setHTML(article);
        })
}


const setHTML = function (article) {

    
    let imageContainer = document.createElement("img");
    imageContainer.setAttribute("src", article.imageUrl);
    imageContainer.setAttribute("alt", article.altTxt);
    elementImage.appendChild(imageContainer);
    elementName.textContent = article.name;
    elementPrice.textContent = article.price;
    elementDescription.textContent = article.description;
}


const setColorSelect = function (colors) {
    let domColors = document.getElementById("colors")
    for (let color of colors) {
        let option = document.createElement("option");
        option.textContent = color;
        domColors.appendChild(option);
    }   
}
function getCart(){
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (cart == null){
        cart = []
    }
    return cart
}
function saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));

}
function addToCart(product) {
    let cart = getCart();
    for (let i in cart) {
        const productInCart = cart[i];
        if (productInCart.id === product.id && productInCart.color === product.color) {
            productInCart.quantity = product.quantity + productInCart.quantity;
            saveCart(cart);
            if (window.confirm('Votre sélection est ajoutée au panier. Pour accéder au panier cliquez sur "OK", sinon "ANNULER".')) {
                document.location.href = "http://127.0.0.1:5501/front/html/cart.html";
            }
            return;
        }
    }
    cart.push(product);
    saveCart(cart);
    if (window.confirm('Votre sélection est ajoutée au panier. Pour accéder au panier cliquez sur "OK", sinon "ANNULER".')) {
        document.location.href = "http://127.0.0.1:5501/front/html/cart.html";
    }
    return;
}


function listenElementCart() {
    elementCart.addEventListener("click", function () {
        let product = {
            id: id,
            quantity: parseInt(quantity.value),
            color: colors.value,
        };
        if (checkQuantity() && checkColor()) {
            addToCart(product);
        };
    });
}


function checkColor() {
    let colorOrder = document.getElementById("colors").value;
    if (colorOrder > [0]) {
        return true;
    } else {
        alert("Veuillez séléctionner une couleur.");
        return false;
    }
}


function checkQuantity() {
    let quantityOrder = document.getElementById("quantity").value;
    if (quantityOrder > 0 && quantityOrder <= 100) {
        return true;
    } else {
        alert("Veuillez saisir une quantité entre 1 et 100.");
        return false;
    }
}


function main() {
    let productId = getIdFromUrl();
    getElement(productId); 
    listenElementCart(); 
}
main();

