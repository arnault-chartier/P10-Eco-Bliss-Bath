describe('Login - Successful Login', () => {
    it('should log in successfully with valid credentials and update header links', () => {
        cy.visit('/login'); // Aller sur la page de connexion

        // Remplir les champs de connexion
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');

        // Soumettre le formulaire
        cy.get('[data-cy="login-submit"]').click();

        // Vérifier la redirection vers la page d'accueil (baseUrl)
        cy.url().should('eq', Cypress.config('baseUrl'));

        // Vérifier l'affichage des liens "Mon panier" et "Déconnexion"
        cy.get('[data-cy="nav-link-cart"]').should('be.visible');
        cy.get('[data-cy="nav-link-logout"]').should('be.visible');

        // Vérifier que les liens "Connexion" et "Inscription" ne sont plus visibles
        cy.get('[data-cy="nav-link-login"]').should('not.exist');
        cy.get('[data-cy="nav-link-register"]').should('not.exist');
    });
});
