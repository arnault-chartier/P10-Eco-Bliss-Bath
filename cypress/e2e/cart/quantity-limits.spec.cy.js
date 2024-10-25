import { login, clearCart } from "../../support";

describe('Cart - Quantity Limits', () => {
    let productId = 5; // ID du produit à tester

    beforeEach(() => {
        login();
        clearCart();

        // Aller sur la page du produit
        cy.visit(`/products/${productId}`);
        cy.get('[data-cy="detail-product-name"]').invoke('text').should('not.be.empty');
    });

    it('should not add a product with a negative quantity', () => {
        // Entrer une quantité négative et essayer d'ajouter au panier
        cy.get('[data-cy="detail-product-quantity"]').clear().type('-5');
        cy.get('[data-cy="detail-product-add"]').click();
        // Aller sur la page du panier pour vérifier que le produit n’a pas été ajouté
        cy.intercept('GET', '/orders').as('getOrders');
        cy.visit('/cart');
        cy.wait('@getOrders');
        cy.get('app-cart').should('exist').within(() => {
            cy.get('[data-cy="cart-empty"]').should('be.visible').and('contain', 'Votre panier est vide.');
        });
    });

    it('should not add a product with a quantity exceeding the limit', () => {
        // Entrer une quantité supérieure à 20 et essayer d'ajouter au panier
        cy.get('[data-cy="detail-product-quantity"]').clear().type('50');
        cy.get('[data-cy="detail-product-add"]').click();
        // Aller sur la page du panier pour vérifier que le produit n’a pas été ajouté
        cy.intercept('GET', '/orders').as('getOrders');
        cy.visit('/cart');
        cy.wait('@getOrders');
        cy.get('app-cart').should('exist').within(() => {
            cy.get('[data-cy="cart-empty"]').should('be.visible').and('contain', 'Votre panier est vide.');
        });
    });
});
