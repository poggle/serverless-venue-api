export default {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "The name of the attendee."
        },
        email: {
            type: "string",
            description: "The email address of the attendee."
        },
        eventId: {
            type: "string",
            description: "The id of the event."
        },
    },
    required: ['name', 'email', 'eventId'],
    additionalProperties: false,
} as const;
