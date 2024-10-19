import { getAuthToken } from "../../../support/index";

describe('API: Users - Get information of the logged-in user', () => {
    let authToken;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should retrieve the logged-in user information successfully', () => {
        // Requête pour récupérer les informations de l'utilisateur connecté
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/me`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification du succès de la requête
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id'); // Vérifie que l'ID de l'utilisateur est bien renvoyé
            expect(response.body).to.have.property('email'); // Vérifie que l'email de l'utilisateur est bien renvoyé
        });
    });
});
