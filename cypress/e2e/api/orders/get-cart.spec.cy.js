describe('API: Orders - Get current cart', () => {
    let authToken;
    let productId = 3; // ID du produit à tester
    let orderId; // ID du panier/commande

    before(() => {
        // Authentification pour obtenir un token valide
        cy.request({
            method: 'POST',
            url: `${Cypress.config('apiBaseUrl')}/login`,
            body: {
                username: 'test2@test.fr',
                password: 'testtest',
            },
        }).then((response) => {
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

        // Ajout d'un produit au panier avant de tester la récupération du panier
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: productId,
                quantity: 2,
            },
        }).then(() => {
            // Récupération de l'ID de la commande après avoir ajouté le produit
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((getResponse) => {
                orderId = getResponse.body.id; // ID du panier/commande
            });
        });
    });

    it('should retrieve the current cart successfully', () => {
        // Récupération du panier en cours
        cy.request({
            method: 'GET',
            url: `${Cypress.config('apiBaseUrl')}/orders`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            // Vérification que le panier a été récupéré avec succès
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', orderId); // Vérifie que l'ID correspond
            expect(response.body.orderLines).to.be.an('array'); // Vérifie que le panier contient des produits
            expect(response.body.orderLines.length).to.be.greaterThan(0); // Vérifie que le panier n'est pas vide
        });
    });
});
