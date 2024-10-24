describe('Login - Failure with Empty Fields', () => {
    it('should display an error when fields are left empty', () => {
        cy.visit('/login'); // Aller sur la page de connexion

        // Laisser les champs vides
        cy.get('[data-cy="login-submit"]').click(); // Soumettre le formulaire

        // Vérifier la présence du message d'erreur
        cy.get('[data-cy="login-errors"]').should('be.visible');
        // Vérifier le texte du message d'erreur
        cy.get('[data-cy="login-errors"]').should('contain', 'Merci de remplir correctement tous les champs');
    });
});
