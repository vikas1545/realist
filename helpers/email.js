import * as config from "../config.js";

export const emailTemplate = (email,content,replyTo,subject)=> {
   return {
      Source: config.EMAIL_FROM, Destination: {
         ToAddresses: [email],
      }, Message: {
         Body: {
            Html: {
               Charset: "UTF-8",
               Data: `<html>
                                 <body>
                                  <h5>Welcome to Realist App by refactoring</h5>
                                   ${content}
                                  <p>@copyright : ${new Date().getFullYear()}</p>
                                </body>
                               </html>`,
            },
         }, Subject: {
            Charset: "UTF-8", Data: `${subject}`,
         },
      },
   }
}