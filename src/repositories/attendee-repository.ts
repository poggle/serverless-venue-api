import { v4 as uuidv4 } from 'uuid';
import {DynamoDBClient, QueryOutput} from '@aws-sdk/client-dynamodb';
import { PutCommand, QueryCommand, DeleteCommand} from '@aws-sdk/lib-dynamodb';

import requiredEnvVar from "../libs/required-env-var";
import NotFoundError from "../errors/not-found-error";
import {Attendee, DynamoDbSerialisedAttendee, NewAttendee} from "../types/attendee";

const dynamoDBClient = new DynamoDBClient({});

const buildPartitionKey = (_: Attendee) => `ATTENDEE`;
const buildSortKey = (attendee: Attendee) => `eventId=${attendee.eventId}-attendeeId=${attendee.id}`;

const serialize = (attendee: Attendee): DynamoDbSerialisedAttendee => ({
        ...attendee,
        PK: buildPartitionKey(attendee),
        SK: buildSortKey(attendee),
});

const deserialise = (serialisedAttendee: DynamoDbSerialisedAttendee) => {
    const {SK, PK, ...restOfAttendee} = serialisedAttendee;
    return restOfAttendee;
}

export const saveAttendee = async (newAttendee: NewAttendee) => {
    const attendee: Attendee = {
        id: uuidv4(),
        ...newAttendee
    };

    await dynamoDBClient.send(
        new PutCommand({
            TableName: requiredEnvVar('TABLE_NAME'),
            Item: serialize(attendee),
        })
    );

    return attendee;
}

export const getAttendeesByEventId = async (eventId: string): Promise<Attendee[]> => {
    const result = await dynamoDBClient.send(
        new QueryCommand({
            TableName: requiredEnvVar('TABLE_NAME'),
            KeyConditionExpression: "PK = :pk AND begins_with(SK, :eventId)",
            ExpressionAttributeValues: {
                ":pk": "ATTENDEE",
                ":eventId": `eventId=${eventId}`,
            },
        })
    ) as QueryOutput;

    return result.Items.map((item) => {
        return deserialise(item as unknown as DynamoDbSerialisedAttendee)
    });
}

export const getAttendeeById = async (attendeeId: string) => {
    const result = await dynamoDBClient.send(new QueryCommand( {
        TableName: requiredEnvVar('TABLE_NAME'),
        IndexName: 'IdIndex',
        KeyConditionExpression: 'PK = :PK and id = :id',
        ExpressionAttributeValues: {
            ':PK': 'ATTENDEE',
            ':id': attendeeId,
        },
    })) as QueryOutput;

    if (result.Items.length !== 1) {
        throw new NotFoundError();
    }

    return  deserialise(result.Items[0] as unknown as DynamoDbSerialisedAttendee);
}

export const deleteAttendee = async (attendee: Attendee) => {
    await dynamoDBClient.send(new DeleteCommand({
        TableName: requiredEnvVar('TABLE_NAME'),
        Key: {
            'PK': buildPartitionKey(attendee),
            'SK': buildSortKey(attendee),
        },
    }));
}