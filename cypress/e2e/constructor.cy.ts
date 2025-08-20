// cypress/e2e/burger-constructor.cy.ts

const testURL = 'http://localhost:4000';

const burgerConstructor = '[data-cy=burger-constructor]';

const mainIngredientConstructor = '[data-cy=ingredients-main]';
const saucesConstructor = '[data-cy=ingredients-sauces]';
const bunsConstructor = '[data-cy=ingredients-buns]';

const orderButton = '[data-cy=order-button]';
const orderNumber = '[data-cy=order-number]';

const closeModal = '[data-cy=close-modal]';
const closeOverlay = '[data-cy=close-overlay]';

describe('Burger Constructor', () => {
  beforeEach(() => {
    // Мокируем API запросы
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );

    // Устанавливаем токены авторизации
    cy.setCookie('accessToken', 'mocked-access-token');

    // Посещаем страницу
    cy.visit(testURL);

    // Ждем загрузки данных и проверки видимости ингредиента
    cy.wait(['@getIngredients', '@getUser']);
    cy.contains('Ингредиент 1').should('be.visible');
  });

  afterEach(() => {
    cy.clearCookies();
  });

  it('добавление булки в конструктор', () => {
    // Проверяем начальное состояние
    cy.get(burgerConstructor).should('contain', 'Выберите булки');

    // Добавляем булку
    cy.get(bunsConstructor).contains('Добавить').click();

    // Проверяем что булка добавилась
    cy.get(burgerConstructor).should('not.contain', 'Выберите булки');
    cy.get(burgerConstructor).should('contain', 'Ингредиент 1');
  });

  it('добавление начинки в конструктор', () => {
    // Сначала добавляем булку (иначе кнопка заказа будет disabled)
    cy.get(bunsConstructor).contains('Добавить').click();

    // Добавляем начинку
    cy.get(saucesConstructor).contains('Добавить').click();

    // Ждем, пока начинка реально появится в конструкторе
    cy.get(burgerConstructor).should('contain', 'Ингредиент 1');
    cy.get(burgerConstructor).should('contain', 'Ингредиент 4');

    // Проверяем, что заглушка "Выберите начинку" исчезла
    cy.get(burgerConstructor).should('not.contain', 'Выберите начинку');
  });

  it('тест открытия модального окна', () => {
    cy.contains('Детали ингредиента').should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').contains('Ингредиент 1').should('exist');
  });

  it('тест закрытия модального окна по кнопке', () => {
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeModal).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('тест закрытия модального окна по нажатию оверлея', () => {
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeOverlay).click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('создание заказа', () => {
    // Собираем бургер: булка + начинка
    cy.get(bunsConstructor).contains('Добавить').click();
    cy.get(saucesConstructor).contains('Добавить').click();

    // Проверяем что кнопка заказа активна
    cy.get(orderButton).should('not.be.disabled');

    // Оформляем заказ
    cy.get(orderButton).scrollIntoView().click({ force: true });

    // Ждем выполнения запроса
    cy.wait('@createOrder');

    // Проверяем что модальное окно с номером заказа открылось
    cy.get(orderNumber).should('contain', '123456');

    // Закрываем модальное окно через обновление страницы
    cy.reload();
  });

  it('проверка изменения конструктора', () => {
    // Запоминаем начальное состояние конструктора
    cy.get(burgerConstructor).then(($initial) => {
      const initialText = $initial.text();

      // Добавляем ингредиент
      cy.get(saucesConstructor).contains('Добавить').click();

      // Проверяем что конструктор изменился
      cy.get(burgerConstructor).should(($after) => {
        expect($after.text()).not.to.equal(initialText);
      });
    });
  });

  it('полный цикл работы приложения', () => {
    // Добавляем ингредиенты
    cy.get(saucesConstructor).contains('Добавить').click();
    cy.get(bunsConstructor).contains('Добавить').click();
    cy.get(mainIngredientConstructor).contains('Добавить').click();

    // Оформляем заказ
    cy.get(orderButton).click({ force: true });
    cy.wait('@createOrder');

    // Проверяем номер заказа
    cy.get(orderNumber).should('contain', '123456');

    // Обновляем страницу для возврата в исходное состояние
    cy.reload();

    // Проверяем что конструктор очистился
    cy.get(burgerConstructor).should('contain', 'Выберите булки');
    cy.get(burgerConstructor).should('contain', 'Выберите начинку');
  });
});
