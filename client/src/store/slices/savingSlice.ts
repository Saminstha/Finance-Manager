import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addSavingAmount,
  createSaving,
  deleteSaving,
  getSavings,
  removeSavingAmount,
  updateSaving,
  type CreateSavingData,
  type UpdateSavingData,
} from "@/api/savings";

import type { Saving } from "@/types/saving";

interface SavingState {
  savings: Saving[];
  isLoading: boolean;
  error: string | null;
}

interface UpdateSavingPayload {
  id: string;
  saving: UpdateSavingData;
  currentSavedAmount: number;
  newSavedAmount: number;
}

const initialState: SavingState = {
  savings: [],
  isLoading: false,
  error: null,
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    return response?.data?.message ?? "Something went wrong";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const fetchSavings = createAsyncThunk(
  "savings/fetchSavings",
  async (_, { rejectWithValue }) => {
    try {
      return await getSavings();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const addSaving = createAsyncThunk(
  "savings/addSaving",
  async (data: CreateSavingData, { rejectWithValue }) => {
    try {
      return await createSaving(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const updateSavingGoal = createAsyncThunk(
  "savings/updateSaving",
  async (
    { id, saving, currentSavedAmount, newSavedAmount }: UpdateSavingPayload,
    { rejectWithValue },
  ) => {
    try {
      let finalSaving: Saving;

      /*
       * If saved amount is being reduced, reduce it first.
       *
       * This is important when the user also lowers the target amount.
       */
      if (newSavedAmount < currentSavedAmount) {
        finalSaving = await removeSavingAmount(
          id,
          currentSavedAmount - newSavedAmount,
        );

        finalSaving = await updateSaving(id, saving);

        return finalSaving;
      }

      /*
       * If target/name/deadline changes and saved amount is
       * increasing, update the goal first.
       *
       * This allows the target to increase before adding money.
       */
      finalSaving = await updateSaving(id, saving);

      if (newSavedAmount > currentSavedAmount) {
        finalSaving = await addSavingAmount(
          id,
          newSavedAmount - currentSavedAmount,
        );
      }

      return finalSaving;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const deleteSavingGoal = createAsyncThunk(
  "savings/deleteSaving",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSaving(id);

      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const savingSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchSavings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSavings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savings = action.payload;
      })
      .addCase(fetchSavings.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Failed to load savings goals";
      })

      // Add
      .addCase(addSaving.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSaving.fulfilled, (state, action) => {
        state.isLoading = false;
        state.savings.unshift(action.payload);
      })
      .addCase(addSaving.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Failed to create savings goal";
      })

      // Update
      .addCase(updateSavingGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSavingGoal.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.savings.findIndex(
          (saving) => saving.id === action.payload.id,
        );

        if (index !== -1) {
          state.savings[index] = action.payload;
        }
      })
      .addCase(updateSavingGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Failed to update savings goal";
      })

      // Delete
      .addCase(deleteSavingGoal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSavingGoal.fulfilled, (state, action) => {
        state.isLoading = false;

        state.savings = state.savings.filter(
          (saving) => saving.id !== action.payload,
        );
      })
      .addCase(deleteSavingGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Failed to delete savings goal";
      });
  },
});

export default savingSlice.reducer;
