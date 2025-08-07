import {DynamoDBClient} from '@aws-sdk/client-dynamodb';
import {DynamoDBDocumentClient , PutCommand} from '@aws-sdk/lib-dynamodb';
import {v4 as uuidv4} from 'uuid';

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);
const table = process.env.TABLE_NAME || 'todos';

export const handler = async (event) => {
    const {title} = JSON.parse(event.body);
    const item = {id : uuidv4(), title, completed: false, createdAt: new Date().toISOString()};
    try {
        await doc.send(new PutCommand({
            TableName: table,
            Item: item
        }));
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            body: JSON.stringify(item)
        };
    } catch (error) {
        console.error('Error creating todo:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Could not create todo'})
        };
    }   
}