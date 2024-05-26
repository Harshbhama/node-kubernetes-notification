import { IEmailLocals, winstonLogger } from "@harshbhama/jobber-shared";
import { config } from "@notifications/config";
import { emailTemplates } from "@notifications/helpers";
import { Logger } from "winston";

const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mainTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void>{
  try{
    // email template
    emailTemplates(template, receiverEmail, locals);
    log.info('Email send successfully');
  }catch(error){
    log.log('error', 'NotificationService MailTransport sendEmail() method error', error);
  }
}
export { sendEmail };