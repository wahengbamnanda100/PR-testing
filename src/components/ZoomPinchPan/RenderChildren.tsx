import { NestedParentText, ShapeSVG } from "../../pages/ZoomPinchPan";
import { allocateChildrenInGrid } from "../../utils/allocateChildren";
import RenderGrandChildren from "./RenderGrandChildren";

const RenderChildren = ({
	rect,
	index,
	scale,
	handleBoxClick,
	rectRefs,
	theme,
}) => {
	const toplevelBox = {
		x: rect.x,
		y: rect.y,
		width: rect.width,
		height: rect.height,
	};

	const parentPositions = allocateChildrenInGrid(
		toplevelBox,
		rect.children.length,
		4
	);

	return rect.children.map((child, childIndex) => {
		const l1pos = parentPositions[childIndex];

		return (
			<g key={childIndex}>
				<ShapeSVG
					x={l1pos.x}
					y={l1pos.y}
					ref={(el) => (rectRefs.current[`${index}-${childIndex}`] = el)}
					width={l1pos.width}
					height={l1pos.height}
					// fill={theme.palette.secondary.main}
					fill={`hsl(${index * 30}, 70%, 60%)`}
					onClick={(e) => {
						e.stopPropagation();
						handleBoxClick(`${index}-${childIndex}`, true);
					}}
					className="child-rect"
					stroke="white"
					strokeWidth={0.5}
					label={child.label}
					fontWeight="normal"
					fontSize="8"
				/>

				<NestedParentText
					rect={{ ...l1pos, ...child }}
					scale={scale}
					parentScale={2}
					childrenScale={5}
					fontSize="4"
					childFontSize="3"
				/>

				{scale > 5 && child.children?.length > 0 && (
					<RenderGrandChildren
						child={child}
						childIndex={childIndex}
						parentIndex={index}
						l1pos={l1pos}
						parentRect={rect}
						handleBoxClick={handleBoxClick}
						rectRefs={rectRefs}
						theme={theme}
					/>
				)}
			</g>
		);
	});
};

export default RenderChildren;
