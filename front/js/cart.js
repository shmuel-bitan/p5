const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
/////////////// déclaration de la fonction du fetch pour acceder aux infos Hors Scope/////////
async function fetchApi() {    
let basketArrayFull = []; // tableau vide qui va contenir les objets créés en suite
let basketClassFull = JSON.parse(localStorage.getItem("kanapLs"));
if (basketClassFull !== null) {
for (let g = 0; g < basketClassFull.length; g++) {
	await fetch("http://localhost:3000/api/products/" + basketClassFull[g].idSelectedProduct)
		.then((res) => res.json())
		.then((canap) => {
			const article = {
				//création d'un objet qui va regrouper les infos nécessaires à la suite
				_id: canap._id,
				name: canap.name,
				price: canap.price,
				color: basketClassFull[g].colorSelectedProduct,
				quantity: basketClassFull[g].quantity,
				alt: canap.altTxt,
				img: canap.imageUrl,
			};
			basketArrayFull.push(article); //ajout de l'objet article au tableau 
		})
		.catch(function (err) {
			console.log(err);
		});
}
}
return basketArrayFull;
};

//////////// fonction d'affichage du DOM ////////////////////

async function showBasket() {
	const responseFetch = await fetchApi(); // appel de la fonction FETCH et attente de sa réponse//
	const basketValue = JSON.parse(localStorage.getItem("kanapLs"));
	if (basketValue !== null && basketValue.length !== 0) {
		const zonePanier = document.querySelector("#cart__items");
		responseFetch.forEach((product) => { // injection dynamique des produits dans le DOM
			zonePanier.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src= "${product.img}" alt="Photographie d'un canapé">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
		});
	} else {
		return messagePanierVide(); //si Ls vide, affichage du message Panier Vide
	}

};
//////////////création des fonctions de modif et suppression d'articles du panier/////////////////

function getBasket() {  // fonction de récupération du LocalStorage//////
    return JSON.parse(localStorage.getItem("kanapLs"));
};

//Fonction permettant de modifier le nombre d'éléments dans le panier

async function modifyQuantity() {
	await fetchApi(); //on attend que le fetch soit terminé
	const quantityInCart = document.querySelectorAll(".itemQuantity");
	for (let input of quantityInCart) {
		input.addEventListener("change", function () {
			//écoute du changement de qty
			let basketValue = getBasket();
			//On récupère l'ID de la donnée modifiée
			let idModif = this.closest(".cart__item").dataset.id;
			//On récupère la couleur de la donnée modifiée
			let colorModif = this.closest(".cart__item").dataset.color;
			//On filtre le Ls avec l'iD du canap modifié
			let findId = basketValue.filter((e) => e.idSelectedProduct === idModif);
			//Puis on cherche le canap même id par sa couleur 
			let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
			if (this.value > 0) {
				// si la couleur et l'id sont trouvés, on modifie la quantité en fonction
				findColor.quantity = this.value;
				//On Push le panier dans le local Storage
				localStorage.setItem("kanapLs", JSON.stringify(basketValue));
				calculQteTotale();
				calculPrixTotal();
			} else {
				calculQteTotale();
				calculPrixTotal();
			}
			localStorage.setItem("kanapLs", JSON.stringify(basketValue));
		});
	}
};

////////////////Supprimer un kanap avec le bouton delete////////

async function removeItem() {
	await fetchApi();
	const kanapDelete = document.querySelectorAll(".deleteItem"); //crée un tableau avec les boutons suppr
	kanapDelete.forEach((article) => {
		article.addEventListener("click", function (event) {
			let basketValue = getBasket();
			//On récupère l'ID de la donnée concernée
			const idDelete = event.target.closest("article").getAttribute("data-id");
			//On récupère la couleur de la donnée concernée
			const colorDelete = event.target
				.closest("article")
				.getAttribute("data-color");
			const searchDeleteKanap = basketValue.find(  // on cherche l'élément du Ls concerné 
				(element) => element.idSelectedProduct == idDelete && element.colorSelectedProduct == colorDelete
			);
			basketValue = basketValue.filter(  // et on filtre le Ls avec l'élément comme modèle
				(item) => item != searchDeleteKanap
			);
			localStorage.setItem("kanapLs", JSON.stringify(basketValue)); // on met à jour le Ls
			const getSection = document.querySelector("#cart__items");
			getSection.removeChild(event.target.closest("article")); // on supprime l'élément du DOM
			alert("article supprimé !");
			calculQteTotale();
			calculPrixTotal();  // on met à jour les qty et prix dynamiquement
		});
	});
	if (getBasket() !== null && getBasket().length === 0) {
		localStorage.clear();       //////// si le Ls est vide, on le clear et on affiche le message 
		return messagePanierVide();
	}
};
removeItem();

/// Initialisation des fonctions ///////////

initialize();

async function initialize() {
showBasket();         ////// affichage du DOM ( avec rappel du fetchApi //////
removeItem();		  ////// suppression dynamique des articles du panier et 
modifyQuantity();	  ////// modification des quantités

calculQteTotale();	  ////// mise à jour dynamique des quantités et prix totaux
calculPrixTotal();
};


function calculQteTotale() {
	let basketValue = getBasket();
	const zoneTotalQuantity = document.querySelector("#totalQuantity");
	let quantityInBasket = []; // création d'un tableau vide pour accumuler les qtés
	if (basketValue === null || basketValue.length === 0) {
		messagePanierVide();
	} else {
	for (let kanap of basketValue) {
		quantityInBasket.push(parseInt(kanap.quantity)); //push des qtés
		const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des objets du tableau par reduce
		zoneTotalQuantity.textContent = quantityInBasket.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	}
}};

async function calculPrixTotal() {
	const responseFetch = await fetchApi();
	let basketValue = getBasket();
	const zoneTotalPrice = document.querySelector("#totalPrice");
    finalTotalPrice = [];
    for (let p = 0; p < responseFetch.length; p++) { //produit du prix unitaire et de la quantité
	let sousTotal = parseInt(responseFetch[p].quantity) * parseInt(responseFetch[p].price);
	finalTotalPrice.push(sousTotal);

	const reducer = (accumulator, currentValue) => accumulator + currentValue; // addition des prix du tableau par reduce
	zoneTotalPrice.textContent = finalTotalPrice.reduce(reducer, 0); //valeur initiale à 0 pour eviter erreur quand panier vide
	localStorage.setItem("kanapLs", JSON.stringify(basketValue));
}};

modifyQuantity();
removeItem();


//On Push le panier dans le local Storage
localStorage.setItem("kanapLs", JSON.stringify(basketValue));

