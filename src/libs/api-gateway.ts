import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S, P> = Omit<APIGatewayProxyEvent, 'body' | 'pathParameters'> & { body: FromSchema<S>, pathParameters: P }
export type ValidatedEventAPIGatewayProxyEvent<S, P> = Handler<ValidatedAPIGatewayProxyEvent<S, P>, APIGatewayProxyResult>

export const formatJSONErrorResponse = (errorMessage: string, statusCode?: number) => {
  return formatJSONResponse({error: {errorMessage}}, statusCode || 400);
}


export const formatJSONResponse = (response: object, statusCode?: number) => {
  return {
    statusCode: statusCode || 200,
    body: JSON.stringify(response)
  }
}
