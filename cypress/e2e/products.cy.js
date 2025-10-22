describe('Gestión de productos', () => {
  before(() => {
    cy.login()
  })

  it('Crear productos desde fixture', () => {
    cy.fixture('products').then((products) => {
      products.forEach((product) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/products',
          body: product,
          headers: { Authorization: `Bearer ${Cypress.env('token')}` }
        }).then((res) => {
          expect(res.status).to.eq(201)
          expect(res.body).to.have.property('id')
        })
      })
    })
  })
})
