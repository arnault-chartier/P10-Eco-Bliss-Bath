import { login, clearCart } from "../../support";

describe('Cart - Add to cart with no stock', () => {
    let productId = 4; // ID du produit à tester avec un stock à 0

    beforeEach(() => {
        login();
        clearCart();
    });

    it('should not add the product to the cart when stock is zero', () => {
        // Aller sur la page du produit avec un stock à 0
        cy.visit(`/products/${productId}`);
        // Attendre que le texte du titre du produit soit présent, indiquant que la page est bien chargée
        cy.get('[data-cy="detail-product-name"]').invoke('text').should('not.be.empty');
        // Vérifier que le stock affiché est bien à 0
        cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stockParts = stockText.split(' '); // Diviser la chaîne de caractères et stocker les morceaux dans un tableau
            const stockValue = parseInt(stockParts[0]); // Extraire le premier morceau du tableau et le convertir en un entier 
            expect(stockValue).to.equal(0); // Vérifier que ce nombre est égal à 0
        });
        // Essayer d'ajouter au panier
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
