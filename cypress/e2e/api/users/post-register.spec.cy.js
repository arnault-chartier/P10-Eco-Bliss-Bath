describe('API: Users - Register a new user', () => {
    const password = 'testpassword123'; // Mot de passe à utiliser pour l'inscription

    it('should register a new user successfully', () => {
        // Requête pour créer un nouvel utilisateur
        cy.request({
            method: 'POST',
            url: `${Cypress.config('apiBaseUrl')}/register`,
            body: {
                email: `user${Date.now()}@test.fr`, // Utilisation d'un email unique
                firstname: `John`,
                lastname: `Doe`,
                plainPassword: {
                    first: password,  // Premier champ pour le mot de passe
                    second: password, // Deuxième champ pour la confirmation du mot de passe
                },
            },
        }).then((response) => {
            // Vérification du succès de l'inscription
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id'); // Vérification de la création d'un ID 
        });
    });
});
