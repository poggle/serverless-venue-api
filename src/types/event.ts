export enum EventCategory {
    'conference'='conference',
    'meetup'='meetup',
    'concert'='concert'
}

export interface Event {
    id: string;
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    category: EventCategory;
    isDraft: boolean;
    isCancelled: boolean;
}

export type NewEvent = Omit<Event, 'id'>;

export interface DynamoDbSerialisedEvent extends Omit<Event, 'startTime'  | 'endTime'> {
    SK: string,
    PK: string,
    startTime: string,
    endTime: string
}