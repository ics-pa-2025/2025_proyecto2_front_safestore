describe('Autenticación y token', () => {
  it('Login admin y guarda token', () => {
    cy.fixture('users').then((user) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/auth/login',
        body: {
          email: user.admin.email,
          password: user.admin.password
        }
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('accessToken')
        Cypress.env('token', res.body.accessToken)
      })
    })
  })
})
