import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Add excessive quantity', () => {
    let authToken;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should return an error when adding an excessive quantity', () => {
        // Réinitialisation du panier
        resetCart(authToken);

        // Requête pour ajouter une quantité trop élevée
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: 3, // ID du produit à tester
                quantity: 100, // Quantité trop élevée
            },
            failOnStatusCode: false, // Permet de capturer les erreurs
        }).then((response) => {
            // Vérification que l'API renvoie une erreur 400
            expect(response.status).to.eq(400);
        });
    });
});
