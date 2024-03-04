describe('Test that we can post a photo post', () => {
  it('passes if we can login and post a photo post', () => {
    // launch the web app
    cy.visit('http://localhost:8080')
    // check that the input text field 'Email'
    cy.get('input[name="email"]').type('endtoendtest@test.com').should('have.value', 'endtoendtest@test.com')
    cy.wait(1000)
    // get and input password
    cy.get('input[name="password"]').type('11111aaaaa').should('have.value', '11111aaaaa')
    cy.wait(1000)

    // check that the button with caption 'Login' is displayed
    cy.get('button').contains('Login').click()
    cy.wait(1000)
    // check click create post button
    cy.get('div').contains('Create Post').click()
    cy.wait(1000)
    // check that input text in title field
    cy.get('input').eq(0).type('Test Posting a Photo')
      .should('have.value', 'Test Posting a Photo')
    cy.wait(1000)
    // check that input text in content field
    cy.get('textarea').eq(0).type('Posting a photo. Please look at it.')
      .should('have.value', 'Posting a photo. Please look at it.')
    cy.wait(1000)
      // check that select a photo
    cy.get('input').eq(1).selectFile('cypress/e2e/source/test_img.jpg')
    cy.wait(1000)
    // check click submit button
    cy.get('button').eq(1).click()
    cy.wait(1000)
    // check that a successful message show
    cy.get('div').contains('Successfully created a post!')
    cy.wait(1000)
    // check that go to activity feed
    cy.get('div').contains('Feed').click()
    cy.wait(3000)
    // check that new post in activity feed
    cy.get('div').contains('Test Posting a Photo')
    cy.wait(1000)
    // check that go to my activity page
    cy.get('div').contains('My Activity').click()
    cy.wait(1000)
    // check that the post is in my activity page
    cy.get('div').contains('Test Posting a Photo')
    cy.wait(3000)

    // go to delete the test posts
    cy.get('button').contains('Delete').eq(0).click()
    cy.wait(1000)
    cy.get('button').contains('Yes, Delete').click()
    cy.wait(1000)
    cy.get('button').contains('Close').click()
    cy.wait(1000)
  })
})
