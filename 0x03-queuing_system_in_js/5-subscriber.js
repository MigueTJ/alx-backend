import redis from 'redis';

const subscriber = redis.createClient();

subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

subscriber.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

const CHANNEL = 'holberton school channel';

subscriber.subscribe(CHANNEL);

subscriber.on('message', (channel, message) => {
  if (channel === CHANNEL) console.log(message);

  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe(CHANNEL);
    subscriber.quit();
  }
});
