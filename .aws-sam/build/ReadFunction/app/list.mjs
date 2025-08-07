import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient, ScanCommand} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);
const table = process.env.TABLE_NAME || 'todos';

export const handler = async (event) => {
    try {
        const res = await doc.send(new ScanCommand({
            TableName: table
        }));
        
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify({
                todos: res.Items || [],
                count: res.Count || 0
            })
        };
    } catch (error) {
        console.error('Error listing todos:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Could not retrieve todos'})
        };
    }
};
