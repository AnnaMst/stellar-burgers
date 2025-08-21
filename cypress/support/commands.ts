/// <reference types="cypress" />
import { selectors } from './selectors';

Cypress.Commands.add('addBun', () => {
  cy.get(selectors.buns).scrollIntoView().contains('Добавить').click({ force: true });
});

Cypress.Commands.add('addSauce', () => {
  cy.get(selectors.sauces).scrollIntoView().contains('Добавить').click({ force: true });
});

Cypress.Commands.add('createOrder', () => {
  cy.get(selectors.orderButton).scrollIntoView().click({ force: true });
  cy.wait('@createOrder');
  cy.get(selectors.orderNumber).should('contain', '123456');
});

// Типизация кастомных команд
declare global {
  namespace Cypress {
    interface Chainable {
      addBun(): Chainable<void>;
      addSauce(): Chainable<void>;
      createOrder(): Chainable<void>;
    }
  }
}
