import { Request, Response, NextFunction } from 'express';

export function responseInterceptor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalJson = res.json.bind(res);

  res.json = (data: any) => {
    res.locals.contentBody = data;

    return originalJson(data);
  };

  next();
}
