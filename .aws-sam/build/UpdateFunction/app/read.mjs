import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);
const table = process.env.TABLE_NAME || 'todos';

export const handler = async (event) => {
    const id = event.pathParameters.id;
    try {
        const res = await doc.send(new GetCommand({
            TableName: table,
            Key: { id }
        }));
        return {   
            statusCode: res.Item ? 200 : 404,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: res.Item ? JSON.stringify(res.Item) : JSON.stringify({ error: 'Todo not found' })
        };
    } catch (error) {
        console.error('Error reading todo:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Could not retrieve todo'})
        };
    }
}