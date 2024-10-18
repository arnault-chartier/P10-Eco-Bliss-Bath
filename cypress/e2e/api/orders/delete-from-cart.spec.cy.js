describe('API: Orders - Delete a product from the cart', () => {
    let authToken;
    let productId = 3; // ID du produit à tester
    let orderLineId; // ID de la ligne du panier

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

        // Ajout d'un produit au panier avant de tester la suppression
        cy.request({
            method: 'PUT',
            url: `${Cypress.config('apiBaseUrl')}/orders/add`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: {
                product: productId,
                quantity: 1,
            },
        }).then(() => {
            // Récupération de l'ID de la ligne du panier après avoir ajouté le produit
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((getResponse) => {
                const addedProduct = getResponse.body.orderLines.find(
                    (orderLine) => orderLine.product.id === productId
                );
                orderLineId = addedProduct.id; // Récupération de l'ID de la ligne du panier
            });
        });
    });

    it('should delete the product from the cart', () => {
        // Requête pour supprimer un produit du panier
        cy.request({
            method: 'DELETE',
            url: `${Cypress.config('apiBaseUrl')}/orders/${orderLineId}/delete`,
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);

            // Vérification que le produit a bien été supprimé
            cy.request({
                method: 'GET',
                url: `${Cypress.config('apiBaseUrl')}/orders`,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }).then((getResponse) => {
                const deletedProduct = getResponse.body.orderLines.find(
                    (orderLine) => orderLine.id === orderLineId
                );
                expect(deletedProduct).to.not.exist; // Vérification que le produit n'est plus dans le panier
            });
        });
    });
});
