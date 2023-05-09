import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import createEvent from '../../../services/events/create-event';
import deserialiser from "@functions/events/createEvent/deserialiser";
import ValidationError from "../../../errors/validation-error";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema, {}> = async (requestEvent) => {
  try {
    const newEvent = deserialiser(requestEvent.body);
    const event = createEvent(newEvent);
    return formatJSONResponse(event, 201);
  } catch (e: unknown) {
    if (e instanceof ValidationError) {
      return formatJSONErrorResponse(e.message, 400);
    }
    throw e;
  }
};

export const main = middyfy(handler);
