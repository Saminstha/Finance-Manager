import { Router } from "express";
import {
  addAmount,
  create,
  getAll,
  remove,
  removeAmount,
  update,
} from "../controllers/savingController";
import { authenticate } from "../auth/authenticate";
import { validate } from "../middleware/validate";
import {
  createSavingSchema,
  savingAmountSchema,
  savingIdSchema,
  updateSavingSchema,
} from "../validation/savingSchema";

const router = Router();

router.use(authenticate);

router.post("/", validate({ body: createSavingSchema }), create);

router.get("/", getAll);

router.patch(
  "/:id",
  validate({
    params: savingIdSchema,
    body: updateSavingSchema,
  }),
  update,
);

router.patch(
  "/:id/add",
  validate({
    params: savingIdSchema,
    body: savingAmountSchema,
  }),
  addAmount,
);

router.patch(
  "/:id/remove",
  validate({
    params: savingIdSchema,
    body: savingAmountSchema,
  }),
  removeAmount,
);

router.delete(
  "/:id",
  validate({
    params: savingIdSchema,
  }),
  remove,
);

export default router;
