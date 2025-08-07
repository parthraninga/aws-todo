import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient , UpdateCommand} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);
const table = process.env.TABLE_NAME || 'todos';

export const handler = async (event) => {
 const id = event.pathParameters.id;
 const {title, completed} = JSON.parse(event.body);
 try {
     const attributes = await doc.send(new UpdateCommand({
        TableName: table,
        Key: { id },
        UpdateExpression: 'SET #title = :title, #completed = :completed',
        ExpressionAttributeNames: {
            '#title': 'title',
            '#completed': 'completed'
        },
        ExpressionAttributeValues: {
            ':title': title,
            ':completed': completed
        },
        ReturnValues: "ALL_NEW"
      }));

      return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify(attributes.Attributes)
      };
 } catch (error) {
     console.error('Error updating todo:', error);
     return {
         statusCode: 500,
         body: JSON.stringify({error: 'Could not update todo'})
     };
 }
};