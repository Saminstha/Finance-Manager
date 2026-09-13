import type { Request, Response } from "express";
import { getDashboardSummary } from "./dashboardService";

export async function getSummary(req: Request, res: Response): Promise<void> {
  try {
    const summary = await getDashboardSummary(req.user!.id);

    res.json({
      summary,
    });
  } catch (error) {
    console.error("Get dashboard summary error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}
