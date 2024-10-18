describe('API: Authentication', () => {
  it('should log in successfully with valid credentials', () => {
    // Étape 1 : Envoi de la requête POST avec des identifiants valides
    cy.request({
      method: 'POST',
      url: `${Cypress.config('apiBaseUrl')}/login`, // Utilisation de l'URL de base de l'API
      body: {
        username: 'test2@test.fr', // Identifiants de test
        password: 'testtest',
      },
    }).then((response) => {
      // Étape 2 : Vérification du statut de la réponse (200 = succès)
      expect(response.status).to.eq(200);

      // Étape 3 : Vérification que le token est bien présent dans la réponse
      expect(response.body).to.have.property('token');
    });
  });

  it('should fail with invalid credentials', () => {
    // Étape 4 : Envoi de la requête POST avec des identifiants invalides
    cy.request({
      method: 'POST',
      url: `${Cypress.config('apiBaseUrl')}/login`,
      failOnStatusCode: false, // Désactivation de l'échec automatique sur les statuts d'erreur pour capturer le statut 401
      body: {
        username: 'wronguser@test.fr',
        password: 'wrongpassword',
      },
    }).then((response) => {
      // Étape 5 : Vérification que le statut est bien 401 (non autorisé)
      expect(response.status).to.eq(401);
    });
  });
});
