import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  createAccount,
  deleteAccount as deleteAccountApi,
  getAccounts,
  updateAccount as updateAccountApi,
  type CreateAccountData,
  type UpdateAccountData,
} from "@/api/accounts";

import type { Account } from "@/types/account";

interface AccountState {
  accounts: Account[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  isLoading: false,
  error: null,
};

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAccounts",
  async (_, { rejectWithValue }) => {
    try {
      return await getAccounts();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load accounts.",
      );
    }
  },
);

export const addAccount = createAsyncThunk(
  "accounts/addAccount",
  async (data: CreateAccountData, { rejectWithValue }) => {
    try {
      return await createAccount(data);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create account.",
      );
    }
  },
);

export const updateAccount = createAsyncThunk(
  "accounts/updateAccount",
  async (
    {
      id,
      account,
    }: {
      id: string;
      account: UpdateAccountData;
    },
    { rejectWithValue },
  ) => {
    try {
      return await updateAccountApi(id, account);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update account.",
      );
    }
  },
);

export const deleteAccount = createAsyncThunk(
  "accounts/deleteAccount",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteAccountApi(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete account.",
      );
    }
  },
);

const accountSlice = createSlice({
  name: "accounts",
  initialState,

  reducers: {
    clearAccountError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts = action.payload;
      })

      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to load accounts.";
      })

      // Add
      .addCase(addAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(addAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accounts.unshift(action.payload);
      })

      .addCase(addAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create account.";
      })

      // Update
      .addCase(updateAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(updateAccount.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.accounts.findIndex(
          (account) => account.id === action.payload.id,
        );

        if (index !== -1) {
          state.accounts[index] = action.payload;
        }
      })

      .addCase(updateAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update account.";
      })

      // Delete
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.isLoading = false;

        state.accounts = state.accounts.filter(
          (account) => account.id !== action.payload,
        );
      })

      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete account.";
      });
  },
});

export const { clearAccountError } = accountSlice.actions;

export default accountSlice.reducer;
