import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Add out-of-stock product', () => {
    let authToken;
    let outOfStockProductId = 4; // ID d'un produit en rupture de stock

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should return an error when adding an out-of-stock product', () => {
        // Réinitialisation du panier
        resetCart(authToken);

        // Requête pour ajouter un produit en rupture de stock
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: outOfStockProductId,
                quantity: 1,
            },
            failOnStatusCode: false, // Permet de capturer les erreurs
        }).then((response) => {
            // Vérification que l'API renvoie une erreur 400
            expect(response.status).to.eq(400);
        });
    });
});  