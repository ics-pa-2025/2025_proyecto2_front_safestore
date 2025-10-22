/// <reference types="cypress" />

Cypress.Commands.add('login', () => {
  cy.request('POST', '/auth/login', {
    email: 'admin@example.com',
    password: 'Admin123!'
  }).then((resp) => {
    expect(resp.status).to.eq(200)
    Cypress.env('token', resp.body.token)
    cy.log('🔑 Token guardado correctamente')
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Inicia sesión y guarda el token JWT globalmente.
       */
      login(): Chainable<void>
    }
  }
}
