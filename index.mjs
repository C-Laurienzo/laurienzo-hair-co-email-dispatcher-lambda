import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Headers" : "Content-Type",
    "Access-Control-Allow-Origin": "http://localhost:4200",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
  }
  
  try {
    const sns = new SNSClient()
    const body = JSON.parse(event.body)

    const customerName = `Customer Name: ${body.firstName} ${body.lastName}\n`
    const customerPhone = `Phone Number: ${body.phoneNumber}\n`
    let msg = customerName + customerPhone

    if (body.email != undefined) {
      msg += `Email: ${body.email}\n`
    }

    if (body.description != undefined) {
      msg += `Comments From Customer: ${body.description}\n`
    }
    
    const command = new PublishCommand({
      Message: msg, 
      Subject: 'New Customer Inquiry',
      TargetArn: process.env.TOPIC_ARN
    })
  
    await sns.send(command)

    return {
      statusCode: 200,
      headers: headers,
      body: 'Success'
    }
  } catch {
    return {
      statusCode: 500,
      headers: headers,
      body: 'Internal Error'
    }
  }
}
