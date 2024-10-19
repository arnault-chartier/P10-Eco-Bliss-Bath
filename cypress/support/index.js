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
