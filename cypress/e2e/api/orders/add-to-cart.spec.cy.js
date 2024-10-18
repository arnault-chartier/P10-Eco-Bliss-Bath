describe('API: Orders - Add a product to the cart', () => {
    let authToken;
    let productId = 3; // ID du produit à tester

    before(() => {
        // Connexion pour obtenir un token de connexion valide
        cy.request({
            method: 'POST',
            url: `${Cypress.config('apiBaseUrl')}/login`,
            body: {
                username: 'test2@test.fr',
                password: 'testtest',
            },
        }).then((response) => {
            // Stockage du token d'authentification pour l'utiliser dans les tests
            authToken = response.body.token;
        });
    });

    beforeEach(() => {
        // Réinitialisation du panier avant chaque test
        // Récupération du panier
        cy.request({
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

            // Supprimer chaque article du panier
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
    });

    it('should add a product to the cart successfully', () => {
        // Requête pour ajouter un produit au panier
        cy.request({
            method: 'PUT', // Utilisation de la méthode PUT
            url: `${Cypress.config('apiBaseUrl')}/orders/add`, // Endpoint pour ajouter un produit au panier
            headers: {
                Authorization: `Bearer ${authToken}`, // Utilisation du token pour l'authentification
            },
            body: {
                product: productId, // ID du produit à ajouter
                quantity: 2,  // Quantité du produit à ajouter
            },
        }).then((response) => {
            // Vérification que l'ajout au panier a réussi
            expect(response.status).to.eq(200);

            // Vérification que la réponse contient les informations correctes sur la commande
            expect(response.body).to.have.property('id'); // Vérification que la commande a un id
            expect(response.body).to.have.property('orderLines').that.is.an('array'); // Vérification que "orderLines" est un tableau

            // Vérification qu'un des produits dans la commande correspond à celui ajouté
            const addedProduct = response.body.orderLines.find(
                (orderLine) => orderLine.product.id === productId
            );
            expect(addedProduct).to.exist; // Le produit ajouté doit être dans la commande
        });
    });
});
