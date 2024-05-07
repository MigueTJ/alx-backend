import express from 'express';
import kue from 'kue';
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const seatsKey = 'available_seats';
const queue = kue.createQueue();
const queueName = 'reserve_seat';

client.on('error', (error) => {
  console.error(`Redis client not connected to the server: ${error.message}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
  client.set(seatsKey, 50);
});

const app = express();
const port = 1245;

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getAsync(seatsKey);
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', (req, res) => {
  const job = queue.create(queueName).save((err) => {
    if (err) {
      res.json({ status: 'Reservation failed' });
    } else {
      res.json({ status: 'Reservation in process' });
    }
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  });

  job.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`);
  });
});

app.get('/process', async (req, res) => {
  queue.process(queueName, async (job, done) => {
    let availableSeats = await getAsync(seatsKey);

    if (availableSeats <= 0) {
      done(Error('Not enough seats available'));
    } else {
      availableSeats = Number(availableSeats) - 1;
      client.set(seatsKey, availableSeats);
      done();
    }
  });
  res.json({ status: 'Queue processing' });
});
