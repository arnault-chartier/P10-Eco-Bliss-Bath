import { getAuthToken, resetCart } from "../../../support/index";

describe('API: Products - Get random products', () => {
    let authToken;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should retrieve 3 random products successfully', () => {
        // Requête pour récupérer 3 produits aléatoires
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/products/random`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification du succès de la requête
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array'); // Vérification que la réponse est un tableau
            expect(response.body.length).to.eq(3); // Vérification qu'il y a bien 3 produits
        });
    });
});
