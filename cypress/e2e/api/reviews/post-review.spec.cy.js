import { getAuthToken } from "../../../support/index";

describe('API: Reviews - Post a new review', () => {
    let authToken;

    before(() => {
        // Authentification pour obtenir un token valide
        getAuthToken().then((token) => {
            authToken = token;
        });
    });

    it('should post a new review successfully', () => {
        // Requête pour créer un nouvel avis
        cy.request({
            method: 'POST',
            url: `${Cypress.config('apiBaseUrl')}/reviews`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                title: 'Amazing!', // Titre de l'avis
                comment: 'This product is amazing!', // Contenu de l'avis
                rating: 5, // Note attribuée (de 1 à 5)
            },
        }).then((response) => {
            // Vérification du succès de la requête
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('comment', 'This product is amazing!'); // Vérification du commentaire
            expect(response.body).to.have.property('rating', 5); // Vérification de la note
        });
    });
});
