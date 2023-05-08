import { v4 as uuidv4 } from 'uuid';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import {Event, NewEvent} from "../types/event";
import requiredEnvVar from "../libs/required-env-var";

const dynamoDBClient = new DynamoDBClient({});

const buildPartitionKey = (event: Event) => `EVENT#${event.id}`

const serialize = (event: Event) => {
    return {
        ...event,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        PK: buildPartitionKey(event),
        SK: buildPartitionKey(event),
    }
}

export const saveEvent = async (newEvent: NewEvent) => {
    const event: Event = {
        id: uuidv4(),
        ...newEvent
    };

    await dynamoDBClient.send(
        new PutCommand({
            TableName: requiredEnvVar('TABLE_NAME'),
            Item: serialize(event),
        })
    );

    return event;
}