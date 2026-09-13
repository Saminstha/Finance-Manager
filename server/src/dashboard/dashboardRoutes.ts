import { Router } from "express";
import { authenticate } from "../auth/authenticate";
import { getSummary } from "./dashboardController";

const router = Router();

router.use(authenticate);

router.get("/summary", getSummary);

export default router;
