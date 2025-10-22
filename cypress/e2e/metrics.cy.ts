/// <reference types="cypress" />

describe('📊 Métricas del sistema SafeStore', () => {

  // Token admin
  let token: string;

  before(() => {
    // Login admin y guardar token
    cy.request({
      method: 'POST',
      url: 'http://localhost:3001/auth/login', // URL absoluta
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

  it('✅ Backend responde correctamente', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/brands', // URL absoluta
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      expect(res.status).to.eq(200);
      cy.log(`Tiempo de respuesta: ${res.duration} ms`);
    });
  });

  it('🔐 Auth responde correctamente', () => {
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
      cy.log('✅ Auth funciona correctamente');
    });
  });

  it('⚡ Tiempo de respuesta backend < 1500ms', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:3000/products', // URL absoluta
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => {
      cy.log(`Tiempo de respuesta: ${res.duration} ms`);
      expect(res.duration).to.be.lessThan(1500);
    });
  });

});
