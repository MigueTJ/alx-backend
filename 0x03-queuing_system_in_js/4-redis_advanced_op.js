import redis from 'redis';

const client = redis.createClient();

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const KEY = 'HolbertonSchools';
const keys = ['Portland', 'Seattle', 'New York', 'Bogota', 'Cali', 'Paris'];
const values = [50, 80, 20, 20, 40, 2];

keys.forEach((key, index) => {
  client.hset(KEY, key, values[index], (err, reply) => {
    if (err) throw err;
    console.log(`Set ${key}: ${reply}`);
  });
});

client.hgetall(KEY, (err, value) => {
  if (err) throw err;
  console.log(value);
});
