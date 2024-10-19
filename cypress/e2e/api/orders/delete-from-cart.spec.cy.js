import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Delete a product from the cart', () => {
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

        // Ajout d'un produit au panier avant de tester la suppression
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

    it('should delete the product from the cart', () => {
        // Requête pour supprimer un produit du panier
        cy.request({
            method: 'DELETE',
            url: `${Cypress.config('apiBaseUrl')}/orders/${orderLineId}/delete`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Vérification que le produit a bien été supprimé
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((response) => {
                const deletedProduct = response.body.orderLines.find(
                    (orderLine) => orderLine.id === orderLineId
                );
                expect(deletedProduct).to.not.exist; // Vérification que le produit n'est plus dans le panier
            });
        });
    });
});
