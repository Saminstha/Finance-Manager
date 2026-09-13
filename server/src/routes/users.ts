import { Router } from "express";
import {
  deleteMe,
  getMe,
  updateMe,
  updatePassword,
  updatePhoto,
} from "../controllers/userController";
import { authenticate } from "../auth/authenticate";
import { validate } from "../middleware/validate";
import {
  changePasswordSchema,
  updateUserSchema,
} from "../validation/userSchema";
import { uploadProfilePhoto } from "../middleware/upload";

const router = Router();

router.use(authenticate);

router.get("/me", getMe);

router.patch("/me", validate({ body: updateUserSchema }), updateMe);

router.patch(
  "/me/password",
  validate({ body: changePasswordSchema }),
  updatePassword,
);

router.patch("/me/photo", uploadProfilePhoto.single("photo"), updatePhoto);

router.delete("/me", deleteMe);

export default router;
