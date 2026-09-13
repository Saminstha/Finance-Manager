import { Router } from "express";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/transactionController";
import { getReport } from "../controllers/reportController";
import { authenticate } from "../auth/authenticate";
import { validate } from "../middleware/validate";
import {
  createTransactionSchema,
  transactionIdSchema,
  transactionQuerySchema,
  updateTransactionSchema,
} from "../validation/transactionSchema";

const router = Router();

router.use(authenticate);

router.get(
  "/report",
  validate({
    query: transactionQuerySchema,
  }),
  getReport,
);

router.post(
  "/",
  validate({
    body: createTransactionSchema,
  }),
  create,
);

router.get(
  "/",
  validate({
    query: transactionQuerySchema,
  }),
  getAll,
);

router.patch(
  "/:id",
  validate({
    params: transactionIdSchema,
    body: updateTransactionSchema,
  }),
  update,
);

router.delete(
  "/:id",
  validate({
    params: transactionIdSchema,
  }),
  remove,
);

export default router;
