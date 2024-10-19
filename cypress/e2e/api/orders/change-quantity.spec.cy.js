import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Change quantity of a product in the cart', () => {
    let authToken;
    let productId = 3; // ID du produit à tester
    let orderLineId; // ID de la ligne du panier

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    beforeEach(() => {
        // Réinitialisation du panier
        resetCart(authToken);

        // Ajout d'un produit au panier et récupération de l'ID de la ligne du panier
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: productId,
                quantity: 1,
            },
        }).then(() => {
            // Récupération de l'ID de la ligne du panier après avoir ajouté le produit
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((response) => {
                const addedProduct = response.body.orderLines.find(
                    (orderLine) => orderLine.product.id === productId
                );
                orderLineId = addedProduct.id; // Récupération de l'ID de la ligne du panier
            });
        });
    });

    it('should change the quantity of the product in the cart', () => {
        // Requête pour modifier la quantité d'un produit dans le panier
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/${orderLineId}/change-quantity`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                quantity: 5, // Nouvelle quantité à tester
            },
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Vérification que la quantité a bien été modifiée
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((response) => {
                const updatedProduct = response.body.orderLines.find(
                    (orderLine) => orderLine.id === orderLineId
                );
                expect(updatedProduct).to.exist;
                expect(updatedProduct.quantity).to.eq(5); // Vérification de la nouvelle quantité
            });
        });
    });
});
