const { Given } = require('@cucumber/cucumber');
const axios = require('axios');

Given('the following products', async function (dataTable) {
  const apiUrl = `${this.parameters.baseUrl}/api/products`;
  const response = await axios.get(apiUrl);
  for (const product of response.data) {
    await axios.delete(`${apiUrl}/${product.id}`);
  }

  for (const row of dataTable.hashes()) {
    const availability = row.available.toLowerCase();
    if (!['true', 'false'].includes(availability)) {
      throw new Error(`Invalid background availability: ${row.available}`);
    }
    await axios.post(apiUrl, {
      name: row.name,
      description: row.description,
      price: Number(row.price),
      available: availability === 'true',
      category: row.category.toUpperCase()
    });
  }
});
