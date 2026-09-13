import type { NextFunction, Request, Response } from "express";

import type { ZodType } from "zod";

interface Schemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export function validate(schemas: Schemas) {
  return function (req: Request, _res: Response, next: NextFunction): void {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    if (schemas.params) {
      Object.assign(req.params, schemas.params.parse(req.params));
    }

    if (schemas.query) {
      Object.defineProperty(req, "query", {
        value: schemas.query.parse(req.query),
        writable: true,
        configurable: true,
      });
    }

    next();
  };
}
