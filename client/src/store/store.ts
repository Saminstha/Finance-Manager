import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/auth/authSlice";

import accountReducer from "./slices/accountSlice";
import transactionReducer from "./slices/transactionSlice";
import budgetReducer from "./slices/budgetSlice";
import savingReducer from "./slices/savingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    savings: savingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
