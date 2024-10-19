import { getAuthToken } from "../../../support/index";

describe('API: Reviews - Get list of reviews', () => {
    let authToken;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should retrieve the list of reviews successfully', () => {
        // Requête pour récupérer la liste des avis
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/reviews`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification du succès de la requête
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array'); // Vérifie que la réponse est un tableau
            expect(response.body.length).to.be.greaterThan(0); // Vérifie qu'il y a au moins un avis
        });
    });
});
