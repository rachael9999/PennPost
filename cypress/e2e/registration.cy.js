describe('test registration', () => {
  it('registration successfully', () => {
    cy.visit('http://localhost:8080');
    cy.wait(1000);

    cy.get('button').contains('No account? Signup').click();
    cy.wait(1000);

    cy.get('input[name="firstName"]').type('test').should('have.value', 'test');
    cy.wait(1000);

    cy.get('input[name="lastName"]').type('test').should('have.value', 'test');
    cy.wait(1000);

    cy.get('input[name="email"]').type('2@test.com').should('have.value', '2@test.com');
    cy.wait(1000);

    cy.get('input[name="phoneNumber"]').type('1111111111').should('have.value', '1111111111');
    cy.wait(1000);

    cy.get('input[name="password"]').type('22222bbbbb').should('have.value', '22222bbbbb');
    cy.wait(1000);

    cy.get('button').contains('Sign Up').click();
    cy.wait(1000);

    cy.get('input[name="email"]').type('2@test.com').should('have.value', '2@test.com');
    cy.wait(1000);

    cy.get('input[name="password"]').type('22222bbbbb').should('have.value', '22222bbbbb');
    cy.wait(1000);

    cy.get('button').contains('Login').click();
    cy.wait(1000);
  });
});
