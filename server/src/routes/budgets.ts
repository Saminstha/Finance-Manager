import { Router } from "express";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/budgetController";
import { authenticate } from "../auth/authenticate";
import { validate } from "../middleware/validate";
import {
  createBudgetSchema,
  budgetIdSchema,
  updateBudgetSchema,
} from "../validation/budgetSchema";

const router = Router();

router.use(authenticate);

router.post("/", validate({ body: createBudgetSchema }), create);

router.get("/", getAll);

router.patch(
  "/:id",
  validate({
    params: budgetIdSchema,
    body: updateBudgetSchema,
  }),
  update,
);

router.delete(
  "/:id",
  validate({
    params: budgetIdSchema,
  }),
  remove,
);

export default router;
