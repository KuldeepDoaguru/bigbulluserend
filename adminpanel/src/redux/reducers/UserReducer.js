// reducers/userReducer.js
import { createReducer } from "@reduxjs/toolkit";
import { setUser, clearUser, toggleTableRefresh } from "../slices/UserSlicer";

// Initial state for the user
const initialState = { name: "", id: null, branch: null, refreshTable: false };

// Create a reducer using createReducer from Redux Toolkit
export const userReducer = createReducer(initialState, (builder) => {
  console.log("Initial User State:", initialState);
  builder
    .addCase(setUser, (state, action) => {
      state.name = action.payload.name;
      state.id = action.payload.id;
      console.log("User State after setUser:", state);
    })
    .addCase(clearUser, (state) => {
      state.name = "";
      state.id = null;
    })
    .addCase(toggleTableRefresh, (state) => {
      state.refreshTable = !state.refreshTable;
    });
});
