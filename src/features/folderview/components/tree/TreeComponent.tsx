/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import {
	alpha,
	Box,
	CircularProgress,
	styled,
	SvgIcon,
	SvgIconProps,
	Typography,
} from "@mui/material";
import {
	TreeItem,
	treeItemClasses,
	TreeItemProps,
} from "@mui/x-tree-view/TreeItem";
import PropTypes from "prop-types";
// import { animated, useSpring } from "react-spring";
import { animated, useSpring } from "@react-spring/web";
import {
	// DownloadRounded,
	ErrorOutlineRounded,
	ListAltOutlined,
} from "@mui/icons-material";

export function MinusSquare(props: SvgIconProps) {
	return (
		<SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
			{/* tslint:disable-next-line: max-line-length */}
			<path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
		</SvgIcon>
	);
}

export function PlusSquare(props: SvgIconProps) {
	return (
		<SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
			{/* tslint:disable-next-line: max-line-length */}
			<path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
		</SvgIcon>
	);
}

export function CloseSquare(props: SvgIconProps) {
	return (
		<SvgIcon
			className="close"
			fontSize="inherit"
			style={{ width: 14, height: 14 }}
			{...props}>
			{/* tslint:disable-next-line: max-line-length */}
			<path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
		</SvgIcon>
	);
}

export function TransitionComponent({
	in: inProp,
	children,
}: {
	in: boolean;
	children: ReactNode;
}) {
	const style = useSpring({
		from: {
			opacity: 0,
			transform: "translate3d(20px,0,0)",
		},
		to: {
			opacity: inProp ? 1 : 0,
			transform: `translate3d(${inProp ? 0 : 20}px,0,0)`,
		},
	});

	return <animated.div style={style}>{children}</animated.div>;
}

TransitionComponent.propTypes = {
	in: PropTypes.bool.isRequired,
	children: PropTypes.node,
};

interface LabelWithLazyIndicatorProps {
	children: ReactNode; // Your original label component (e.g., <LabelBody ... />)
	isLazy: boolean;
	hasLoaded: boolean;
}
export const LabelWithLazyIndicator = ({
	children,
	isLazy,
	hasLoaded,
}: LabelWithLazyIndicatorProps): React.ReactNode => (
	<Box sx={{ display: "flex", alignItems: "center", width: "100%", py: 0.5 }}>
		{/* The main label content */}
		<Box sx={{ flexGrow: 1 }}>{children}</Box>

		{/* Show download icon only if it's a lazy node AND it has NOT been loaded yet */}
		{isLazy && !hasLoaded && (
			<ListAltOutlined
				sx={{ fontSize: 16, color: "text.disabled", ml: 1, flexShrink: 0 }}
			/>
		)}
	</Box>
);

interface CustomTreeItemProps extends TreeItemProps {
	lazyLoad?: boolean;
	endpoint?: (uid: string) => void;
}

export const CustomTreeItem = ({
	itemId,
	label,
	children,
	...props
}: CustomTreeItemProps & { label: ReactNode }) => (
	<TreeItem
		itemId={itemId}
		label={
			<TransitionComponent in={true}>
				{" "}
				{/* Set 'in' as true or control based on your requirements */}
				{label}
			</TransitionComponent>
		}
		{...props}>
		{/* {lazyLoad && (
			<StyledTreeItem
				itemId="dummy-child"
				label={<span style={{ display: "none" }}>Loading...</span>}
			/>
		)} */}
		{children}
	</TreeItem>
);

export const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
	color: theme.palette.primary.dark,
	gap: 4,

	[`& .${treeItemClasses.content}`]: {
		padding: theme.spacing(0.5, 1),
		margin: theme.spacing(0.2, 0),
		display: "flex", // Apply flex to center-align content within
		alignItems: "center",
	},
	[`& .${treeItemClasses.checkbox}`]: {
		marginTop: "4px", // Adjust as needed to align checkbox vertically
		marginRight: "8px", // Space between checkbox and text
		display: "flex",
		alignItems: "center",
	},
	[`& .${treeItemClasses.iconContainer}`]: {
		color: theme.palette.text.disabled,
		display: "flex",
		alignItems: "center",
		"& .close": {
			opacity: 0.3,
		},
	},
	[`& .${treeItemClasses.groupTransition}`]: {
		marginLeft: 15,
		paddingLeft: 18,
		borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
	},
	"&.expanded": {
		fontWeight: theme.typography.fontWeightRegular,
	},
	"&:hover": {
		backgroundColor: theme.palette.action.hoverOpacity,
	},
	"&.focused, &.selected, &.selected.focused": {
		backgroundColor: theme.palette.action.selected,
		color: "var(--tree-view-color)",
	},
}));

export interface LazySectionState {
	loading: boolean;
	error: string | null;
	data: any | null; // The fetched data for the children
	hasLoaded: boolean;
}

// State for all lazy-loadable sections
export interface LazyDataState {
	controlRecord: LazySectionState;
	behaviourQualifiers: LazySectionState;
	serviceOperations: LazySectionState;
	businessArea: LazySectionState;
	inputAttributes: LazySectionState;
	outputAttributes: LazySectionState;
	// Add any other lazy sections here
}

export const renderLazyContent = (
	state: LazySectionState,
	contentRenderer: () => ReactNode
): ReactNode => {
	if (state.loading) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					p: 1,
					ml: 4,
					color: "text.secondary",
				}}>
				<CircularProgress size={16} sx={{ mr: 1.5 }} />
				<Typography variant="body2">Loading...</Typography>
			</Box>
		);
	}

	if (state.error) {
		return (
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					p: 1,
					ml: 4,
					color: "error.main",
				}}>
				<ErrorOutlineRounded sx={{ fontSize: 18, mr: 1 }} />
				<Typography variant="body2">{state.error}</Typography>
			</Box>
		);
	}

	if (state.hasLoaded && state.data) {
		// ...and the data array is empty, show a "no items" message.
		if (state.data.length === 0) {
			return (
				<Box sx={{ p: 1, ml: 4, color: "text.disabled" }}>
					<Typography variant="body2">No items found.</Typography>
				</Box>
			);
		}

		return contentRenderer();
	}

	return null;
};
