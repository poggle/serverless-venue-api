import { v4 as uuidv4 } from 'uuid';
import {DynamoDBClient, QueryOutput} from '@aws-sdk/client-dynamodb';
import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import {DynamoDbSerialisedEvent, Event, NewEvent} from "../types/event";
import requiredEnvVar from "../libs/required-env-var";

const dynamoDBClient = new DynamoDBClient({});

const buildPartitionKey = (_: Event) => `EVENT`;
const buildSortKey = (event: Event) => `isDraft=${Number(event.isDraft)}-startTime=${event.startTime.toISOString()}-eventId=${event.id}`;

const serialize = (event: Event): DynamoDbSerialisedEvent => ({
        ...event,
        startTime: event.startTime.toISOString(),
        endTime: event.endTime.toISOString(),
        PK: buildPartitionKey(event),
        SK: buildSortKey(event),
});

const deserialise = (serialisedEvent: DynamoDbSerialisedEvent) => {
    const {SK, PK, ...restOfEvent} = serialisedEvent;
    return {
        ...restOfEvent,
        startTime: new Date(restOfEvent.startTime),
        endTime: new Date(restOfEvent.endTime),
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

export const getNonDraftEvents = async (): Promise<Event[]> => {
    const result = await dynamoDBClient.send(
        new QueryCommand({
            TableName: requiredEnvVar('TABLE_NAME'),
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :notDraft)",
            ExpressionAttributeValues: {
                ":pk": "EVENT",
                ":notDraft": "isDraft=0",
            },
        })
    ) as QueryOutput;

    return result.Items.map((item) => {
        return deserialise(item as unknown as DynamoDbSerialisedEvent)
    });
}