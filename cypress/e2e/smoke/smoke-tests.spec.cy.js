import { login } from "../../support";

describe('Smoke Tests', () => {
    it('should successfully load the home page', () => {
        cy.visit('/');
        // Vérifier que l'URL correspond à la baseUrl
        cy.url().should('eq', Cypress.config('baseUrl'));
        // Vérifier que l'élément <app-home> est bien présent sur la page
        cy.get('app-home').should('be.visible');
    });

    it('should successfully load the login page', () => {
        // Vérifier la présence des champs et boutons de connexion
        cy.visit('/login');
        cy.get('[data-cy="login-input-username"]').should('be.visible');
        cy.get('[data-cy="login-input-password"]').should('be.visible');
        cy.get('[data-cy="login-submit"]').should('be.visible');
    });

    it('should successfully load the products page', () => {
        cy.visit('/products');
        cy.url().should('include', '/products');
        // Vérifier que plusieurs produits sont affichés
        cy.get('[data-cy="product"]').should('have.length.greaterThan', 0);
    });

    it('should successfully load a product page', () => {
        // Connexion avant d'ajouter un produit au panier
        login();
        // Visiter la page du produit
        cy.visit('/products/5');
        // Attendre que le texte du titre du produit soit présent, indiquant que la page est bien chargée
        cy.get('[data-cy="detail-product-name"]').invoke('text').should('not.be.empty');
        // Vérifier la présence du champ de disponibilité du produit
        cy.get('[data-cy="detail-product-stock"]').should('be.visible');
        // Vérifier la présence du bouton d'ajout au panier
        cy.get('[data-cy="detail-product-add"]').should('be.visible');
    });

    it('should successfully load the cart page', () => {
        // Connexion pour pouvoir accéder à la page du panier
        login();
        // Visiter la page du panier
        cy.visit('/cart');
        // Attendre que l'URL soit bien celle de la page du panier      
        cy.url().should('include', '/cart');
        // Vérifier que l'élément <app-cart> est bien présent sur la page
        cy.get('app-cart').should('be.visible');
    });
});
