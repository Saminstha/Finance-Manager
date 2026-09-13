import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createTransaction,
  deleteTransaction as deleteTransactionApi,
  getTransactions,
  updateTransaction as updateTransactionApi,
  type CreateTransactionData,
  type UpdateTransactionData,
} from "@/api/transactions";

import { fetchAccounts } from "@/store/slices/accountSlice";

import type { Transaction } from "@/types/transaction";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await getTransactions();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load transactions.",
      );
    }
  },
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (data: CreateTransactionData, { rejectWithValue, dispatch }) => {
    try {
      const transaction = await createTransaction(data);

      dispatch(fetchAccounts());

      return transaction;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create transaction.",
      );
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (
    {
      id,
      transaction,
    }: {
      id: string;
      transaction: UpdateTransactionData;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const updatedTransaction = await updateTransactionApi(id, transaction);

      dispatch(fetchAccounts());

      return updatedTransaction;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update transaction.",
      );
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await deleteTransactionApi(id);

      dispatch(fetchAccounts());

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete transaction.",
      );
    }
  },
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,

  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })

      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to load transactions.";
      })

      // Add
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(addTransaction.fulfilled, (state, action) => {
        state.isLoading = false;

        state.transactions.unshift(action.payload);
      })

      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to create transaction.";
      })

      // Update
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id,
        );

        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })

      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to update transaction.";
      })

      // Delete
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false;

        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        );
      })

      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to delete transaction.";
      });
  },
});

export const { clearTransactionError } = transactionSlice.actions;

export default transactionSlice.reducer;
