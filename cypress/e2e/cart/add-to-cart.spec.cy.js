import { login, clearCart, getAuthToken } from "../../support";

describe('Cart - Add a product to the cart and update the stock', () => {
    let productId = 5; // ID du produit à tester
    let productName; // Variable pour stocker le nom du produit
    let initialStock; // Variable pour stocker la quantité en stock initiale du produit avant l'ajout au panier

    before(() => {
        login();
        clearCart();
    })

    it('should add a product to the cart and verify the quantity in cart', () => {
        // Aller sur la page du produit
        cy.visit(`/products/${productId}`);
        // Attendre que le texte du titre du produit soit présent, indiquant que la page est bien chargée
        cy.get('[data-cy="detail-product-name"]').invoke('text').should('not.be.empty');
        // Récupérer le nom du produit
        cy.get('[data-cy="detail-product-name"]').invoke('text').then((text) => {
            productName = text.trim(); // Stocker le nom du produit dans "productName"
        });
        // Vérifier le stock (ne doit pas être vide et doit être supérieur à 0)
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            // Vérifier que le texte contient bien un nombre avant "en stock"
            const stockParts = stockText.split(' '); // Diviser la chaîne de caractères et stocker les morceaux dans un tableau
            const stockValue = parseInt(stockParts[0].trim()); // Extraire le premier morceau du tableau et le convertir en un entier 
            // Vérifier que le nombre n'est pas vide (il doit exister et être un nombre valide)
            expect(stockValue).to.not.equal(''); // Le nombre ne doit pas être vide
            expect(stockValue).to.not.be.NaN; // Vérifier que ce nombre est valide
            expect(stockValue).to.be.greaterThan(0); // Vérifier que ce nombre est supérieur à 0
            initialStock = stockValue; // Stocker la quantité dans "initialStock"
        });
        // Cliquer sur le bouton "Ajouter au panier"
        cy.get('[data-cy="detail-product-add"]').click();
        // Vérifier que l'URL redirige automatiquement vers la page du panier
        cy.url().should('include', '/cart');
        // Attendre que le texte du titre de la ligne de produit soit présent, indiquant que la page est bien chargée
        cy.get('[data-cy="cart-line-name"]').invoke('text').should('not.be.empty');
        // Récupérer le texte du titre de la ligne du panier et vérifier qu'il correspond au produit ajouté
        cy.get('[data-cy="cart-line-name"]').invoke('text').then((cartProductName) => {
            expect(cartProductName.trim()).to.equal(productName); // Comparer avec le nom du produit
        });
        // Vérifier que la quantité du produit dans le panier est bien "1"
        cy.get('[data-cy="cart-line-quantity"]').invoke('val').should('eq', '1');
    });

    it('should verify product is added to the cart with correct quantity via API', () => {
        // Récupérer le token d'authentification pour effectuer la requête API sécurisée
        getAuthToken().then((authToken) => {
            // Envoyer une requête GET pour récupérer le contenu du panier via l'API
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((response) => {
                // Vérifier que la réponse de l'API est un succès (status 200)
                expect(response.status).to.eq(200);
                // Chercher le produit ajouté dans la réponse de l'API
                const cartProduct = response.body.orderLines.find(line => line.product.id === productId);
                // Vérifier que le produit existe bien dans le panier
                expect(cartProduct).to.not.be.undefined;
                // Vérifier que la quantité ajoutée dans le panier est correcte
                expect(cartProduct.quantity).to.equal(1);
                // Vérifier que le nom du produit correspond au produit ajouté
                expect(cartProduct.product.name).to.equal(productName);
            });
        });
    });

    it('should verify stock decrement on product page after adding to cart', () => {
        // Aller sur la page du produit
        cy.visit(`/products/${productId}`);
        // Attendre que le texte du titre du produit soit présent, indiquant que la page est bien chargée
        cy.get('[data-cy="detail-product-name"]').invoke('text').should('not.be.empty');
        // Vérifier la décrémentation du stock
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((newStockText) => {
            const newStockValue = parseInt(newStockText.split(' ')[0]); // Récupérer le stock actuel
            expect(newStockValue).to.equal(initialStock - 1); // Vérification de la décrémentation
        });
    });
});
