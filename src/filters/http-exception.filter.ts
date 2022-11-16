import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let resultMessage = exception.message;
    let resultCode = 1;
    let resultParams = {};
    try {
      const { code, message, ...oth } = JSON.parse(exception.message);
      resultMessage = message;
      resultCode = code;
      resultParams = oth;
    } catch (e) {}
    // const message = exception.message;
    Logger.log(exception, 'Occur exception');
    const errorResponse = {
      status,
      message: resultMessage,
      code: resultCode,
      params: resultParams,
      path: request.url,
      method: request.method,
      timestamp: new Date().toLocaleDateString(),
    };
    // Log out errors
    // Logger.error(
    //   `【${formatDate(new Date().toString())}】${request.method} ${request.url}`,
    //   JSON.stringify(errorResponse),
    //   'HttpExceptionFilter',
    // );
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
