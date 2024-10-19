import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Add a product to the cart', () => {
    let authToken;
    let productId = 3; // ID du produit à tester

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should add a product to the cart successfully', () => {
        // Réinitialisation du panier
        resetCart(authToken);

        // Requête pour ajouter un produit au panier
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: productId, // ID du produit à ajouter
                quantity: 2,  // Quantité du produit à ajouter
            },
        }).then((response) => {
            // Vérification que l'ajout au panier a réussi
            expect(response.status).to.eq(200);

            // Vérification que la réponse contient les informations correctes sur la commande
            expect(response.body).to.have.property('id'); // Vérification que la commande a un id
            expect(response.body).to.have.property('orderLines').that.is.an('array'); // Vérification que "orderLines" est un tableau

            // Vérification qu'un des produits dans la commande correspond à celui ajouté
            const addedProduct = response.body.orderLines.find(
                (orderLine) => orderLine.product.id === productId
            );
            expect(addedProduct).to.exist; // Le produit ajouté doit être dans la commande
        });
    });
});
