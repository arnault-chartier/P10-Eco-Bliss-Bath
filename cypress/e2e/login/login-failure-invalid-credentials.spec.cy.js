describe('Login - Failure with Invalid Credentials', () => {
    it('should display an error message when login fails with incorrect credentials', () => {
        cy.visit('/login'); // Aller sur la page de connexion

        // Remplir les champs avec des identifiants incorrects
        cy.get('[data-cy="login-input-username"]').type('invaliduser@test.fr');
        cy.get('[data-cy="login-input-password"]').type('invalidpassword');

        // Soumettre le formulaire
        cy.get('[data-cy="login-submit"]').click();

        // Vérifier la présence du message d'erreur
        cy.get('[data-cy="login-errors"]').should('be.visible');
        // Vérifier le texte du message d'erreur
        cy.get('[data-cy="login-errors"]').should('contain', 'Identifiants incorrects');
    });
});
