// Fonction d'authentification pour obtenir un token valide
export const getAuthToken = () => {
    return cy.request({
        method: 'POST',
        url: `${Cypress.config('apiBaseUrl')}/login`,
        body: {
            username: 'test2@test.fr',
            password: 'testtest',
        },
    }).then((response) => {
        return response.body.token; // Retourne le token
    });
};

// Fonction pour réinitialiser le panier
export const resetCart = (authToken) => {
    // Récupération du panier
    return cy.request({
        method: 'GET',
        url: `${Cypress.config('apiBaseUrl')}/orders`,
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        failOnStatusCode: false, // Empêche l'échec si le panier est vide (404)
    }).then((response) => {
        // Extraction des articles du panier dans orderLines
        // Si le panier est vide, orderLines sera un tableau vide
        const orderLines = response.body.orderLines || [];
        // Suppression de chaque article du panier
        orderLines.forEach((orderLine) => {
            cy.request({
                method: 'DELETE',
                url: `${Cypress.config('apiBaseUrl')}/orders/${orderLine.id}/delete`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        });
    });
};

// Fonction pour se connecter
export const login = () => {
    cy.visit('/login');
    cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
    cy.get('[data-cy="login-input-password"]').type('testtest');
    cy.get('[data-cy="login-submit"]').click();
    // Vérifier la redirection vers la page d'accueil
    cy.url().should('eq', Cypress.config('baseUrl'));
};

// Fonction pour vider le panier
export const clearCart = () => {
    // Intercepter la requête de récupération du panier
    cy.intercept('GET', '/orders').as('getOrders');
    // Visiter la page du panier
    cy.visit('/cart');
    // Attendre que la requête de récupération du panier soit terminée
    cy.wait('@getOrders');
    // Vérifier l'affichage à jour du panier
    cy.get('app-cart').should('exist').then(($cart) => {
        if ($cart.find('[data-cy="cart-empty"]').length > 0) {
            // Panier vide, rien à supprimer
            cy.get('[data-cy="cart-empty"]').should('be.visible').and('contain', 'Votre panier est vide.');
        } else {
            // Panier contient des produits, les supprimer
            cy.get('[data-cy="cart-line"]').should('exist').each(($line) => {
                // Intercepter la suppression
                cy.intercept('DELETE', '/orders/*/delete').as('deleteOrder');
                // Cliquer sur chaque bouton de suppression
                cy.wrap($line).within(() => {
                    cy.get('[data-cy="cart-line-delete"]').click();
                });
                // Attendre la réponse de suppression pour chaque produit
                cy.wait('@deleteOrder');
            });
            // Vérifier ensuite que le panier est bien vide
            cy.get('[data-cy="cart-empty"]').should('be.visible').and('contain', 'Votre panier est vide.');
        }
    });
}