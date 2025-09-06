import { configureStore } from "@reduxjs/toolkit";
import servideDomainReducer from "../store/slice/serviceDomainSlice";

export const store = configureStore({
	reducer: {
		serviceDomain: servideDomainReducer,
	},
});

// types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
