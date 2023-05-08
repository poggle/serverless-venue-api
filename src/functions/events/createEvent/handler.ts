import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { saveEvent } from "../../../repositories/event-respository";
import deserialiser from "@functions/events/createEvent/deserialiser";

const handler: ValidatedEventAPIGatewayProxyEvent<typeof schema, {}> = async (requestEvent) => {
  const newEvent = deserialiser(requestEvent.body);
  const event = await saveEvent(newEvent);
  return formatJSONResponse(event, 201);
};

export const main = middyfy(handler);
