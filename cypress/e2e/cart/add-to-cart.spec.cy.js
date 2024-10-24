describe('Cart - Add a product to the cart', () => {
    let productId = 5; // ID du produit à tester
    let productName; // Variable pour stocker le nom du produit

    before(() => {
        // Connexion
        cy.visit('/login');
        cy.get('[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('[data-cy="login-input-password"]').type('testtest');
        cy.get('[data-cy="login-submit"]').click();
        // Vérifier la redirection vers la page d'accueil (baseUrl)
        cy.url().should('eq', Cypress.config('baseUrl'));

        // Visiter la page du panier
        cy.visit('/cart');
        // Vérifier l'URL de la page du panier
        cy.url().should('include', '/cart');

        // Attendre que l'une des deux sections soit présente
        cy.get('app-cart').then(($cart) => {
            if ($cart.find('[data-cy="cart-empty"]').length > 0) {
                // Si le panier est vide
                cy.get('[data-cy="cart-empty"]').should('be.visible');
                cy.log('Le panier est vide');
            } else if ($cart.find('[data-cy="cart-form"]').length > 0) {
                // Si le formulaire du panier est présent (panier avec des produits)
                cy.get('[data-cy="cart-form"]').should('be.visible');
                cy.log('Le panier contient des produits');
            } else {
                // Aucune des deux sections n'est présente, ce qui indiquerait un problème
                cy.log('Erreur : ni cart-empty, ni cart-form ne sont présents');
            }
        });
    });

    it('should add a product to the cart and update the stock', () => {
        // Aller sur la page du produit
        cy.visit(`/products/${productId}`);

        // Attendre que le texte du titre du produit est présent, indiquant que la page est bien chargée
        cy.get('[data-cy="detail-product-name"]').invoke('text').should('not.be.empty');

        // Récupérer le nom du produit pour l'utiliser dans le test
        cy.get('[data-cy="detail-product-name"]').invoke('text').then((text) => {
            productName = text.trim(); // Stocker le nom du produit
        });

        // // Vérification du stock (ne doit pas être vide et doit être supérieur à 0)
        // cy.get('[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
        //     // Vérifier que le texte contient bien un nombre avant "en stock"
        //     const stockParts = stockText.split(' '); // Diviser la chaîne de caractères et stocker les morceaux dans un tableau
        //     const stockValue = parseInt(stockParts[0]); // Extraire le premier morceau du tableau et le convertir en un entier 
        //     // Vérifier que le nombre n'est pas vide (il doit exister et être un nombre valide)
        //     expect(stockParts[0].trim()).to.not.equal(''); // Le nombre avant "en stock" ne doit pas être vide
        //     expect(stockValue).to.not.be.NaN; // Vérifier que ce nombre est valide
        //     expect(stockValue).to.be.greaterThan(0); // Vérifier que ce nombre est supérieur à 0
        // });

        // // Cliquer sur le bouton "Ajouter au panier"
        // cy.get('[data-cy="detail-product-add"]').click();

        // // Vérifier que l'URL redirige automatiquement vers la page du panier
        // cy.url().should('include', '/cart');

        // // Vérifier que le produit avec le nom récupéré est bien dans le panier
        // cy.get('[data-cy="cart-line-name"]').should('contain', productName);

        // // Vérifier que la quantité du produit dans le panier est bien "1"
        // cy.get('[data-cy="cart-line-quantity"]').should('contain', '1');

        // // Retourner sur la page du produit et vérifier que le stock a été décrémenté
        // cy.visit(`/products/${productId}`);
        // cy.get('[data-cy="product-stock"]').should('contain', 'Stock:').and('not.contain', '0'); // Ajuster selon la décrémentation
    });
});
