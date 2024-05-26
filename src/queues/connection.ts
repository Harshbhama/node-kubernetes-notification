import { winstonLogger } from '@harshbhama/jobber-shared';
import { config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try{
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification service connected to queue successfully');
    closeConnection(channel, connection);
    return channel;
  }catch(error){
    log.log('error', 'NotificationService Error createConnection() method:', error);
  }
}


function closeConnection(channel: Channel, connection: Connection): void {
process.once('SIGNIT', async () => {
    await channel.close();
    await connection.close();
  })
}

export { createConnection };
