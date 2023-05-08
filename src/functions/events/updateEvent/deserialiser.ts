import type { FromSchema } from "json-schema-to-ts";
import schema from "./schema";
import {Event, EventCategory} from "../../../types/event";

export default (requestPayload: FromSchema<typeof schema>): Event => ({
    ...requestPayload,
    startTime: new Date(requestPayload.startTime),
    endTime: new Date(requestPayload.endTime),
    category: requestPayload.category as EventCategory
})