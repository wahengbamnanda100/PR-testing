/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

// MUI-style Box component
interface BoxProps {
	children?: React.ReactNode;
	sx?: any;
	onClick?: () => void;
	ref?: React.RefObject<HTMLDivElement>;
	[key: string]: any;
}

export const Box: React.FC<BoxProps> = ({ children, sx = {}, ...props }) => {
	const boxStyles: any = {
		boxSizing: "border-box",
		...sx,
	};

	return (
		<div style={boxStyles} {...props}>
			{children}
		</div>
	);
};

// Typography component
interface TypographyProps {
	variant?: "h6" | "body2" | "caption";
	color?: "primary" | "inherit";
	sx?: any;
	children?: React.ReactNode;
	[key: string]: any;
}

export const Typography: React.FC<TypographyProps> = ({
	variant,
	color,
	sx = {},
	children,
	...props
}) => {
	const getVariantStyles = (variant: string | undefined) => {
		switch (variant) {
			case "h6":
				return {
					fontSize: "1.1rem",
					fontWeight: 500,
					lineHeight: 1.4,
					letterSpacing: "0.0075em",
				};
			case "body2":
				return {
					fontSize: "0.8rem",
					fontWeight: 400,
					lineHeight: 1.3,
					letterSpacing: "0.01071em",
				};
			case "caption":
				return {
					fontSize: "0.75rem",
					fontWeight: 400,
					lineHeight: 1.66,
					letterSpacing: "0.03333em",
				};
			default:
				return {};
		}
	};

	const getColorStyles = (color: string | undefined) => {
		switch (color) {
			case "primary":
				return { color: "#1976d2" };
			default:
				return {};
		}
	};

	const styles = {
		margin: 0,
		...getVariantStyles(variant),
		...getColorStyles(color),
		...sx,
	};

	return (
		<div style={styles} {...props}>
			{children}
		</div>
	);
};