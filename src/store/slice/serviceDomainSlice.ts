import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SDState {
	serviceDomain: string | null;
}

const initialState: SDState = {
	serviceDomain: null,
};

const serviceDomainSlice = createSlice({
	name: "serviceDomain",
	initialState,
	reducers: {
		selectSD(state, action: PayloadAction<string>) {
			state.serviceDomain = action.payload;
		},
		removeSD(state) {
			state.serviceDomain = null;
		},
	},
});

export const { selectSD, removeSD } = serviceDomainSlice.actions;
export default serviceDomainSlice.reducer;
