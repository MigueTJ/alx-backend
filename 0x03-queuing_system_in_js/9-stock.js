import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const listProducts = [

];

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
  listProducts.forEach((product) => {
    client.set(`item.${product.itemId}`, product.initialAvailableQuantity);
  });
});

const app = express();
const port = 1245;

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = listProducts.find((product) => product.itemId === itemId);

  if (!item) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  const currentStock = await getAsync(`item.${itemId}`);
  item.currentQuantity = currentStock;
  res.json(item);
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = Number(req.params.itemId);
  const item = listProducts.find((product) => product.itemId === itemId);

  if (!item) {
    res.status(404).json({ status: 'Product not found' });
    return;
  }

  const currentStock = await getAsync(`item.${itemId}`);
  if (currentStock <= 0) {
    res.json({ status: 'Not enough stock available', itemId });
    return;
  }

  client.set(`item.${itemId}`, Number(currentStock) - 1);
  res.json({ status: 'Reservation confirmed', itemId });
});
