describe('Métricas de rendimiento y datos', () => {
  it('Medir tiempo de respuesta de marcas', () => {
    const start = Date.now()
    cy.request('GET', 'http://localhost:3000/brands').then((res) => {
      const duration = Date.now() - start
      cy.log(`Tiempo de respuesta: ${duration}ms`)
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.greaterThan(0)
    })
  })

  it('Medir tiempo de respuesta de productos', () => {
    const start = Date.now()
    cy.request('GET', 'http://localhost:3000/products').then((res) => {
      const duration = Date.now() - start
      cy.log(`Tiempo de respuesta: ${duration}ms`)
      expect(res.status).to.eq(200)
      expect(res.body.length).to.be.greaterThan(0)
    })
  })
})
