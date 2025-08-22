// cypress/e2e/burger-constructor.cy.ts
import { selectors } from '../support/selectors';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Мокаем API запросы
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');

    // Устанавливаем токен
    cy.setCookie('accessToken', 'mocked-access-token');

    // Заходим на страницу
    cy.visit('/login');

    // Ждем загрузки данных
    cy.wait(['@getIngredients', '@getUser']);

    // Устанавливаем алиасы для элементов
    cy.get(selectors.burgerConstructor).as('constructor').should('exist');
    cy.get(selectors.buns).as('buns').should('exist');
    cy.get(selectors.sauces).as('sauces').should('exist');
    cy.get(selectors.mainIngredients).as('main').should('exist');
    cy.get(selectors.orderButton).as('orderButton').should('exist');

    // Проверка, что ингредиент существует в DOM
    cy.contains('Ингредиент 1').should('exist');
  });

  afterEach(() => {
    cy.clearCookies();
  });

  it('добавление булки', () => {
    cy.get('@constructor').should('contain', 'Выберите булки');
    cy.get('@buns').contains('Добавить').click({ force: true });
    cy.get('@constructor').should('contain', 'Ингредиент 1');
  });

  it('добавление начинки', () => {
    cy.get('@buns').contains('Добавить').click({ force: true });
    cy.get('@sauces').contains('Добавить').click({ force: true });

    cy.get('@constructor').should('contain', 'Ингредиент 1');
    cy.get('@constructor').should('contain', 'Ингредиент 4');
    cy.get('@constructor').should('not.contain', 'Выберите начинку');
  });

  it('создание заказа', () => {
    cy.get('@buns').contains('Добавить').click({ force: true });
    cy.get('@sauces').contains('Добавить').click({ force: true });

    cy.get('@orderButton').should('not.be.disabled');
    cy.get('@orderButton').click({ force: true });
    cy.wait('@createOrder');

    // После создания заказа ищем номер заказа без scroll
    cy.get(selectors.orderNumber).should('contain', '123456');
  });

  it('полный цикл работы приложения', () => {
    cy.addSauce();
    cy.addBun();
    cy.get('@main').contains('Добавить').click({ force: true });

    cy.createOrder();

    // Перезагрузка страницы — старые алиасы недействительны
    cy.reload();

    // Повторно ищем селекторы после reload
    cy.get(selectors.burgerConstructor).should('contain', 'Выберите булки');
    cy.get(selectors.burgerConstructor).should('contain', 'Выберите начинку');
  });
});
