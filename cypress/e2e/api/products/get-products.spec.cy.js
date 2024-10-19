import { getAuthToken } from "../../../support/index";

describe('API: Products - Get list of products', () => {
    let authToken;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should retrieve the list of products successfully', () => {
        // Requête pour récupérer la liste des produits
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/products`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification du succès de la requête
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array'); // Vérification que la réponse est un tableau de produits
            expect(response.body.length).to.be.greaterThan(0); // Vérification qu'il y a au moins un produit dans la liste
        });
    });
});  