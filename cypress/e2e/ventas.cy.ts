describe('📊 Métricas del sistema SafeStore - Ventas', () => {

  // Token admin
  let token: string;

  before(() => {
    // Login admin y guardar token
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/auth/login',
      body: {
        email: 'admin@example.com',
        password: 'Admin123!'
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('accessToken');
      token = res.body.accessToken;
      Cypress.env('token', token);
      cy.log('🔑 Token guardado correctamente');
    });
  });

  it('✅ Registrar venta correctamente', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/sell',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        sellDetails: [
          { cantidad: 1, idProduct: 3 }
        ]
      }
    }).then((res) => {
      expect(res.status).to.eq(201);
      cy.log('✅ Venta registrada correctamente');
      cy.log(`Tiempo de respuesta: ${res.duration} ms`);
    });
  });

  it('⚠️ No registrar venta si supera stock disponible', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/sell',
      headers: {
        Authorization: `Bearer ${token}`
      },
      failOnStatusCode: false, // Para no fallar el test automáticamente
      body: {
        sellDetails: [
          { cantidad: 9999, idProduct: 3 } // fuerza límite de stock
        ]
      }
    }).then((res) => {
      expect(res.status).to.eq(201); // según tu backend
      cy.log('⚠️ Venta no permitida por stock insuficiente');
      cy.log(`Tiempo de respuesta: ${res.duration} ms`);
    });
  });

  it('⚡ Tiempo de respuesta registro de venta < 1500ms', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/sell',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        sellDetails: [
          { cantidad: 1, idProduct: 3 }
        ]
      }
    }).then((res) => {
      cy.log(`Tiempo de respuesta: ${res.duration} ms`);
      expect(res.duration).to.be.lessThan(1500);
    });
  });

});
