import type { FromSchema } from "json-schema-to-ts";
import schema from "./schema";
import {NewEvent} from "../../../types/event";

export default (requestPayload: FromSchema<typeof schema>): NewEvent => ({
    ...requestPayload,
    startTime: new Date(requestPayload.startTime),
    endTime: new Date(requestPayload.endTime),
})