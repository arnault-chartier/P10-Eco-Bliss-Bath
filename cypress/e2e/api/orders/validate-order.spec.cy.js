import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Orders - Validate an order', () => {
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

        // Ajout d'un produit au panier avant de valider la commande
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
            // Récupération de l'ID de la commande (orderId) après avoir ajouté le produit
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

    it('should validate the order successfully', () => {
        // Validation de la commande avec les informations requises
        cy.request({
            method: 'POST',
            url: `${Cypress.config('apiBaseUrl')}/orders`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                firstname: 'John',
                lastname: 'Doe',
                address: '123 Main St',
                zipCode: '12345',
                city: 'Springfield',
            },
        }).then((response) => {
            // Vérification que la commande a bien été validée
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('validated', true); // Vérifie que la commande est validée

            // Vérification que l'ID de la commande validée correspond à orderId
            expect(response.body.id).to.eq(orderId);

            // Vérification que la commande contient des produits
            expect(response.body.orderLines).to.be.an('array');
            expect(response.body.orderLines.length).to.be.greaterThan(0);
        });
    });
});
