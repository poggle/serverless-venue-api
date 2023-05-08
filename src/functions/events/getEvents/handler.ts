import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import {getNonDraftEvents, saveEvent} from "../../../repositories/event-respository";
import deserialiser from "@functions/events/createEvent/deserialiser";

const createEvent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  return formatJSONResponse(await getNonDraftEvents(), 200);
};

export const main = middyfy(createEvent);
