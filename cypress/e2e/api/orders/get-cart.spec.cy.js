import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Get current cart', () => {
    let authToken;
    let productId = 3; // ID du produit à tester
    let orderId; // ID du panier/commande

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    beforeEach(() => {
        // Réinitialisation du panier
        resetCart(authToken);

        // Ajout d'un produit au panier avant de tester la récupération du panier
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: productId,
                quantity: 2,
            },
        }).then(() => {
            // Récupération de l'ID de la commande après avoir ajouté le produit
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((response) => {
                orderId = response.body.id; // ID du panier/commande
            });
        });
    });

    it('should retrieve the current cart successfully', () => {
        // Récupération du panier en cours
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/orders`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification que le panier a été récupéré avec succès
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', orderId); // Vérifie que l'ID correspond
            expect(response.body.orderLines).to.be.an('array'); // Vérifie que le panier contient des produits
            expect(response.body.orderLines.length).to.be.greaterThan(0); // Vérifie que le panier n'est pas vide
        });
    });
});
