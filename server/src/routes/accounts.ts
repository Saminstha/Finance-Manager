import { Router } from "express";
import {
  create,
  getAll,
  remove,
  update,
} from "../controllers/accountController";
import { authenticate } from "../auth/authenticate";
import { validate } from "../middleware/validate";
import {
  accountIdSchema,
  createAccountSchema,
  updateAccountSchema,
} from "../validation/accountSchema";

const router = Router();

router.use(authenticate);

router.post("/", validate({ body: createAccountSchema }), create);

router.get("/", getAll);

router.patch(
  "/:id",
  validate({
    params: accountIdSchema,
    body: updateAccountSchema,
  }),
  update,
);

router.delete("/:id", validate({ params: accountIdSchema }), remove);

export default router;
