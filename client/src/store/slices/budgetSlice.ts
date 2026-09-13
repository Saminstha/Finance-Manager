import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createBudget,
  deleteBudget as deleteBudgetApi,
  getBudgets,
  updateBudget as updateBudgetApi,
  type CreateBudgetData,
  type UpdateBudgetData,
} from "@/api/budgets";

import type { Budget } from "@/types/budget";

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budgets: [],
  isLoading: false,
  error: null,
};

export const fetchBudgets = createAsyncThunk(
  "budgets/fetchBudgets",
  async (_, { rejectWithValue }) => {
    try {
      return await getBudgets();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load budgets.",
      );
    }
  },
);

export const addBudget = createAsyncThunk(
  "budgets/addBudget",
  async (data: CreateBudgetData, { rejectWithValue }) => {
    try {
      return await createBudget(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create budget.",
      );
    }
  },
);

export const updateBudget = createAsyncThunk(
  "budgets/updateBudget",
  async (
    {
      id,
      budget,
    }: {
      id: string;
      budget: UpdateBudgetData;
    },
    { rejectWithValue },
  ) => {
    try {
      return await updateBudgetApi(id, budget);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update budget.",
      );
    }
  },
);

export const deleteBudget = createAsyncThunk(
  "budgets/deleteBudget",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteBudgetApi(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete budget.",
      );
    }
  },
);

const budgetSlice = createSlice({
  name: "budgets",
  initialState,

  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to load budgets.";
      })

      // Add
      .addCase(addBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.isLoading = false;

        state.budgets.unshift(action.payload);
      })
      .addCase(addBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create budget.";
      })

      // Update
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.budgets.findIndex(
          (budget) => budget.id === action.payload.id,
        );

        if (index !== -1) {
          state.budgets[index] = action.payload;
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update budget.";
      })

      // Delete
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false;

        state.budgets = state.budgets.filter(
          (budget) => budget.id !== action.payload,
        );
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete budget.";
      });
  },
});

export const { clearBudgetError } = budgetSlice.actions;

export default budgetSlice.reducer;
