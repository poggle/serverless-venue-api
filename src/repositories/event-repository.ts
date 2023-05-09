import { v4 as uuidv4 } from 'uuid';
import {DynamoDBClient, QueryOutput} from '@aws-sdk/client-dynamodb';
import { PutCommand, QueryCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';

import {DynamoDbSerialisedEvent, Event, NewEvent} from "../types/event";
import requiredEnvVar from "../libs/required-env-var";
import NotFoundError from "../errors/not-found-error";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const getEventById = async (eventId: string) => {
    const result = await dynamoDBClient.send(new QueryCommand( {
        TableName: requiredEnvVar('TABLE_NAME'),
        IndexName: 'IdIndex',
        KeyConditionExpression: 'PK = :PK and id = :id',
        ExpressionAttributeValues: {
            ':PK': 'EVENT',
            ':id': eventId,
        },
    })) as QueryOutput;

    if (result.Items.length !== 1) {
        throw new NotFoundError();
    }

    return  deserialise(result.Items[0] as unknown as DynamoDbSerialisedEvent);
}

export const deleteEvent = async (event: Event) => {
    await dynamoDBClient.send(new DeleteCommand({
        TableName: requiredEnvVar('TABLE_NAME'),
        Key: {
            'PK': buildPartitionKey(event),
            'SK': buildSortKey(event),
        },
    }));
}