// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
const { createApolloFetch } = require('apollo-fetch');

const GRAPHQL_URI = 'http://localhost:3000/admin/api';
const apolloFetch = createApolloFetch({ uri: GRAPHQL_URI });

/**
 * Uploads a file to an input
 * @memberOf Cypress.Chainable#
 * @name upload_file
 * @function
 * @param {String} selector - element to target
 * @param {String} fileUrl - The file url to upload
 * @param {String} type - content type of the uploaded file
 *
 * Adapted from https://github.com/cypress-io/cypress/issues/170#issuecomment-389837191
 *
 * Usage:
 * // Dynamically create a file, or save one into the fixtures folder, your call
 * cy.writeFile('cypress/fixtures/notice.pdf', 'Hi, this content is created by cypress!')
 * cy.upload_file('input[name=file1]', 'notice.pdf')
 */
Cypress.Commands.add('upload_file', (selector, fileUrl, type = '') => (
  cy.get(selector).then(subject => (
    cy.window().then(appWindow => (
      cy.fixture(fileUrl, 'base64')
        .then(Cypress.Blob.base64StringToBlob)
        .then(blob => {
          const el = subject[0];
          const nameSegments = fileUrl.split('/');
          const name = nameSegments[nameSegments.length - 1];
          // `File` is different from appWindow.File (the one in the app's iframe).
          // Need to access the application's instance of `File` so the types match elsewhere.
          const testFile = new appWindow.File([blob], name, { type });
          const dataTransfer = new appWindow.DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          subject.trigger('change');
          return subject;
        })
    ))
  ))
));

Cypress.Commands.add('graphql_query', (query) => apolloFetch({ query }).then(({ data }) => {
  console.log('Fetched data:', data);
  return data;
}).catch(error => {
  console.log('Error', error);
  throw error;
}));
