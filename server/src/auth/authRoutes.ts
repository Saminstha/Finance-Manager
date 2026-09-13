import { Router } from "express";

import { login, refresh, register } from "./authController";

import { authenticate } from "./authenticate";

import { validate } from "../middleware/validate";

import { createUserSchema } from "../validation/userSchema";
import { loginSchema } from "./authSchemas";

const router = Router();

router.post("/register", validate({ body: createUserSchema }), register);

router.post("/login", validate({ body: loginSchema }), login);

router.post("/refresh", refresh);

router.get("/me", authenticate, (req, res) => {
  res.json({
    message: "You are authenticated",
    userId: req.user?.id,
  });
});

export default router;
