import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);
const table = process.env.TABLE_NAME || 'todos';

export const handler = async (event) => {
    const id = event.pathParameters.id;
    try {
        await doc.send(new DeleteCommand({
            TableName: table,
            Key: { id }
        }));
        return { statusCode: 204,
                 headers: {
                     "Access-Control-Allow-Origin": "*",
                     "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                     "Access-Control-Allow-Headers": "Content-Type"
                 },
                 body: '' };
    } catch (error) {
        console.error('Error deleting todo:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Could not delete todo'})
        };
    }
}