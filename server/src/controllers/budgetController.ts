import type { Request, Response } from "express";
import {
  createBudget,
  deleteBudget,
  getBudgets,
  updateBudget,
} from "../services/budgetService";

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const budget = await createBudget(req.user!.id, req.body);

    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    console.error("Create budget error:", error);

    if (
      error instanceof Error &&
      error.message === "A budget for this category and month already exists"
    ) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function getAll(req: Request, res: Response): Promise<void> {
  try {
    const budgets = await getBudgets(req.user!.id);

    res.json({
      budgets,
    });
  } catch (error) {
    console.error("Get budgets error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const budget = await updateBudget(
      req.user!.id,
      req.params.id as string,
      req.body,
    );

    res.json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Update budget error:", error);

    if (error instanceof Error) {
      if (error.message === "Budget not found") {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (
        error.message === "A budget for this category and month already exists"
      ) {
        res.status(400).json({
          message: error.message,
        });
        return;
      }
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    await deleteBudget(req.user!.id, req.params.id as string);

    res.json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    if (error instanceof Error && error.message === "Budget not found") {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      message: "Server error",
    });
  }
}
