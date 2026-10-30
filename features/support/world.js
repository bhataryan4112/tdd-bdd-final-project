const { setWorldConstructor, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const chrome = require('selenium-webdriver/chrome');

setDefaultTimeout(60 * 1000);

class CustomWorld {
  constructor({ parameters }) {
    this.parameters = parameters;
    this.clipboard = {};
  }
}

setWorldConstructor(CustomWorld);

Before(async function () {
  const browser = process.env.BROWSER || 'firefox';
  const builder = new Builder().forBrowser(browser);
  if (browser === 'chrome') {
    builder.setChromeOptions(new chrome.Options().addArguments('--headless=new', '--window-size=1280,900'));
  } else {
    builder.setFirefoxOptions(new firefox.Options().addArguments('-headless'));
  }
  this.driver = await builder.build();
  await this.driver.manage().setTimeouts({ implicit: 0 });
});

After(async function () {
  if (this.driver) {
    await this.driver.quit();
  }
});
