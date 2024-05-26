import {  winstonLogger } from '@harshbhama/jobber-shared';
import { config } from '@notifications/config';
import { Application } from 'express';
import 'express-async-errors';
import http from 'http';
import { Logger } from 'winston';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
// import { IEmailMessageDetails } from '@harshbhama/jobber-shared';

const SERVER_PORT = 4001;
const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthRoutes)
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
 const emailChannel: Channel = await createConnection() as Channel;
 await consumeAuthEmailMessages(emailChannel);
 await consumeOrderEmailMessages(emailChannel);
 
 // Make dummy
//   const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token='1231231231231fsdfsd`;
//   const messageDetails: IEmailMessageDetails = {
//     receiverEmail: `${config.SENDER_EMAIL}`,
//     resetLink: verificationLink,
//     username: 'Manny',
//     template: 'forgotPassword'
//   }
//  await emailChannel.assertExchange('jobber-email-notification', 'direct');
//  const message = JSON.stringify(messageDetails)
//  emailChannel.publish('jobber-email-notification', 'auth-email', Buffer.from(message)); // similar to send to queue

//  await emailChannel.assertExchange('jobber-order-notification', 'direct');
//  const message1 = JSON.stringify({name: 'jobber',service: 'order notification service' })
//  emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1)); // similar to send to queue



}

function startElasticSearch(): void {
  checkConnection();
}
function startServer(app: Application): void {
  try{
    const httpServer: http.Server = new http.Server(app);
    log.info(`Worker with process id of ${process.pid} on notification server has started`)
    httpServer.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`)
    })
  }catch(error){
    log.log('error', 'NotificationService startServer() method:', error)
  }
}