describe('Gestión de marcas', () => {
  before(() => {
    cy.login() // comando custom que setea Cypress.env('token')
  })

  it('Crear marcas desde fixture', () => {
    cy.fixture('brands').then((brands) => {
      brands.forEach((brand) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/brands',
          body: brand,
          headers: { Authorization: `Bearer ${Cypress.env('token')}` }
        }).then((res) => {
          expect(res.status).to.eq(201)
        })
      })
    })
  })
})
