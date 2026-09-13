import type { Request, Response } from "express";
import { getTransactionReport } from "../services/reportService";

export async function getReport(req: Request, res: Response): Promise<void> {
  try {
    const report = await getTransactionReport(req.user!.id, req.query);

    res.json({
      report,
    });
  } catch (error) {
    console.error("Get transaction report error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}
