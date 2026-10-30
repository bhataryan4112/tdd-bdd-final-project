const { When, Then } = require('@cucumber/cucumber');
const { By, until, Select } = require('selenium-webdriver');
const assert = require('assert');

function getField(world, fieldName) {
  return world.driver.findElement(By.id('product_' + fieldName.toLowerCase().replace(/ /g, '_')));
}

When('I visit the {string}', async function (pageName) {
  assert.strictEqual(pageName, 'Home Page');
  await this.driver.get(`${this.parameters.baseUrl}/`);
});

Then('I should see {string} in the title', async function (expectedTitle) {
  await this.driver.wait(until.titleContains(expectedTitle), this.parameters.waitTimeout);
});

When('I set the {string} to {string}', async function (fieldName, value) {
  const field = await getField(this, fieldName);
  await field.clear();
  await field.sendKeys(value);
});

When('I select {string} in the {string} dropdown', async function (value, dropdownName) {
  const dropdown = await getField(this, dropdownName);
  await new Select(dropdown).selectByVisibleText(value);
});

When('I press the {string} button', async function (buttonText) {
  const button = await this.driver.findElement(By.id(buttonText.toLowerCase() + '-btn'));
  await this.driver.wait(until.elementIsVisible(button), this.parameters.waitTimeout);
  // Every API action clears the old flash message before issuing its request.
  await this.driver.executeScript("document.getElementById('flash_message').textContent = ''; ");
  await button.click();
  if (buttonText.toLowerCase() !== 'clear') {
    await this.driver.wait(async () => {
      const message = await this.driver.findElement(By.id('flash_message')).getText();
      return message.trim().length > 0;
    }, this.parameters.waitTimeout, `No response after clicking ${buttonText}`);
  }
});

Then('I should see {string}', async function (text) {
  await this.driver.wait(async () => {
    const body = await this.driver.findElement(By.css('body')).getText();
    return body.includes(text);
  }, this.parameters.waitTimeout, `Expected to see "${text}"`);
});

Then('I should not see {string}', async function (text) {
  await this.driver.wait(async () => {
    const body = await this.driver.findElement(By.css('body')).getText();
    return !body.includes(text);
  }, this.parameters.waitTimeout, `Expected not to see "${text}"`);
});

Then('I should see the message {string}', async function (expectedMessage) {
  await this.driver.wait(async () => {
    const message = await this.driver.findElement(By.id('flash_message')).getText();
    return message.includes(expectedMessage);
  }, this.parameters.waitTimeout, `Expected message "${expectedMessage}"`);
});

When('I copy the {string} field', async function (fieldName) {
  const field = await getField(this, fieldName);
  this.clipboard[fieldName] = await field.getAttribute('value');
  assert.ok(this.clipboard[fieldName], `Cannot copy an empty ${fieldName} field`);
});

Then('the {string} field should be empty', async function (fieldName) {
  const field = await getField(this, fieldName);
  assert.strictEqual(await field.getAttribute('value'), '');
});

When('I paste the {string} field', async function (fieldName) {
  assert.ok(this.clipboard[fieldName], `No copied ${fieldName} value`);
  const field = await getField(this, fieldName);
  await field.clear();
  await field.sendKeys(this.clipboard[fieldName]);
});

Then('I should see {string} in the {string} field', async function (expectedValue, fieldName) {
  const field = await getField(this, fieldName);
  await this.driver.wait(async () => (await field.getAttribute('value')) === expectedValue,
    this.parameters.waitTimeout, `Expected ${expectedValue} in ${fieldName}`);
});

Then('I should see {string} in the {string} dropdown', async function (expectedValue, dropdownName) {
  const dropdown = await getField(this, dropdownName);
  await this.driver.wait(async () => {
    const option = await new Select(dropdown).getFirstSelectedOption();
    return (await option.getText()) === expectedValue;
  }, this.parameters.waitTimeout);
});

When('I change {string} to {string}', async function (fieldName, newValue) {
  const field = await getField(this, fieldName);
  await field.clear();
  await field.sendKeys(newValue);
});
