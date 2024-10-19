import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Stock decremented after adding product to cart', () => {
    let authToken;
    let initialStock;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;

            // Récupération des informations du produit pour connaître son stock initial après authentification
            return cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/products/3`, // ID du produit à tester
                headers: {
                    Authorization: `Bearer ${authToken}`, // Utilisation du token récupéré
                },
            });
        }).then((response) => {
            initialStock = response.body.availableStock; // Stock initial
        });
    });

    it('should decrement the stock after adding product to cart', () => {
        // Réinitialisation du panier
        resetCart(authToken);

        // Ajout du produit au panier
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: 3,
                quantity: 1,
            },
        }).then(() => {
            // Vérification que le stock a été décrémenté après l'ajout
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/products/3`, // Récupération à nouveau des informations du produit
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((response) => {
                expect(response.body.availableStock).to.eq(initialStock - 1); // Vérification que le stock a été décrémenté
            });
        });
    });
});