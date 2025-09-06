import { createSelector } from "reselect";
import { RootState } from "../index";

const serviceDomain = (state: RootState) => state.serviceDomain;

export const SDSelector = createSelector(
	[serviceDomain],
	(state) => state.serviceDomain
);
