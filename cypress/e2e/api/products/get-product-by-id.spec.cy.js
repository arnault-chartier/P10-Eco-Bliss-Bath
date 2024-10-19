import { getAuthToken } from "../../../support/index";

describe('API: Products - Get product by ID', () => {
    let authToken;
    let productId = 3; // ID du produit à tester

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should retrieve a specific product successfully', () => {
        // Requête pour récupérer un produit par son ID
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/products/${productId}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification du succès de la requête
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', productId); // Vérification que l'ID correspond
            expect(response.body).to.have.property('name'); // Vérification que le produit a un nom
        });
    });
});
