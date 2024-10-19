describe('API: Orders - Access cart without authentication', () => {
    it('should return a 401 error when accessing the cart without authentication', () => {
        // Requête pour accéder au panier sans authentification
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/orders`,
            failOnStatusCode: false, // Permet de capturer les erreurs
        }).then((response) => {
            // Vérification que l'API renvoie une erreur 401 (Unauthorized)
            expect(response.status).to.eq(401);
        });
    });
});