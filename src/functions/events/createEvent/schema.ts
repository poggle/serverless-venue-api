export default {
    type: "object",
    properties: {
        name: {
            type: "string",
            description: "The name of the event."
        },
        description: {
            type: "string",
            description: "A brief description of the event."
        },
        startTime: {
            type: "string",
            format: "date-time",
            description: "The start time of the event in ISO 8601 format."
        },
        endTime: {
            type: "string",
            format: "date-time",
            description: "The end time of the event in ISO 8601 format."
        },
        category: {
            type: "string",
            description: "The event's category (e.g., conference, meetup, concert)."
        },
        status: {
            type: "string",
            description: "The event's status (e.g., upcoming, ongoing, completed, canceled)."
        },
    },
    required: ['name', 'description', 'startTime', 'endTime', 'category', 'status']
} as const;
