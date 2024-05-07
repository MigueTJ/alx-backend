import kue from 'kue';

const queue = kue.createQueue();
const jobFormat = {
  phoneNumber: '6815155874',
  message: 'This is your push notification code'
};

const queueName = 'push_notification_code';

const job = queue.create(queueName, jobFormat).save((err) => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed', (err) => {
  console.log('Notification job failed:', err);
});
