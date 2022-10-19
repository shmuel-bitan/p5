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

/** 
 * Recuperation des donnees sur l'API.
 * @param {string} "identifiant du produit"
 * @return {json}
*/

const getElement = function (id) {

    // Ajout de l'ID sur l'URL.
    fetch(`http://localhost:3000/api/products/${id}`)
        .then(function (response) {
            // Utilisation d'une condition pour l'affichage de la reponse dans la console.
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

    // Placement des donnees API aux bons endroits. 
    let imageContainer = document.createElement("img");
    imageContainer.setAttribute("src", article.imageUrl);
    imageContainer.setAttribute("alt", article.altTxt);
    elementImage.appendChild(imageContainer);
    elementName.textContent = article.name;
    elementPrice.textContent = article.price;
    elementDescription.textContent = article.description;
}


const setColorSelect = function (colors) {
    let domColors = document.getElementById("colors");
    // Affichage des couleurs dans la console.
    for (let color of colors) {
        let option = document.createElement("option");
        option.textContent = color;
        domColors.appendChild(option);
    }   
}

function main() {
    let productId = getIdFromUrl();
    getElement(productId);  
}
main();