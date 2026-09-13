import type { Request, Response } from "express";
import {
  addSavingAmount,
  createSaving,
  deleteSaving,
  getSavings,
  removeSavingAmount,
  updateSaving,
} from "../services/savingService";

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const saving = await createSaving(req.user!.id, req.body);

    res.status(201).json({
      message: "Saving goal created successfully",
      saving,
    });
  } catch (error) {
    console.error("Create saving error:", error);

    if (
      error instanceof Error &&
      error.message === "Saved amount cannot exceed target amount"
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
    const savings = await getSavings(req.user!.id);

    res.json({
      savings,
    });
  } catch (error) {
    console.error("Get savings error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const saving = await updateSaving(
      req.user!.id,
      req.params.id as string,
      req.body,
    );

    res.json({
      message: "Saving goal updated successfully",
      saving,
    });
  } catch (error) {
    console.error("Update saving error:", error);

    if (error instanceof Error) {
      if (error.message === "Saving goal not found") {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (
        error.message === "Target amount cannot be less than the saved amount"
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

export async function addAmount(req: Request, res: Response): Promise<void> {
  try {
    const saving = await addSavingAmount(
      req.user!.id,
      req.params.id as string,
      req.body,
    );

    res.json({
      message: "Amount added to saving goal successfully",
      saving,
    });
  } catch (error) {
    console.error("Add saving amount error:", error);

    if (error instanceof Error) {
      if (error.message === "Saving goal not found") {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.message === "Saved amount cannot exceed target amount") {
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

export async function removeAmount(req: Request, res: Response): Promise<void> {
  try {
    const saving = await removeSavingAmount(
      req.user!.id,
      req.params.id as string,
      req.body,
    );

    res.json({
      message: "Amount removed from saving goal successfully",
      saving,
    });
  } catch (error) {
    console.error("Remove saving amount error:", error);

    if (error instanceof Error) {
      if (error.message === "Saving goal not found") {
        res.status(404).json({
          message: error.message,
        });
        return;
      }

      if (error.message === "Saved amount cannot be less than 0") {
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
    await deleteSaving(req.user!.id, req.params.id as string);

    res.json({
      message: "Saving goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete saving error:", error);

    if (error instanceof Error && error.message === "Saving goal not found") {
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
