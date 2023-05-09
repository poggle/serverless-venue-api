import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import {getNonDraftEvents} from "../../../repositories/event-repository";

const handler: ValidatedEventAPIGatewayProxyEvent<{}, {}> = async () => {
  return formatJSONResponse(await getNonDraftEvents(), 200);
};

export const main = middyfy(handler);
