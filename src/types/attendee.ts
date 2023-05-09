export interface Attendee {
    id: string;
    name: string;
    email: string;
    eventId: string;
}

export type NewAttendee = Omit<Attendee, 'id'>;

export interface DynamoDbSerialisedAttendee extends Attendee {
    PK: string;
    SK: string;
}