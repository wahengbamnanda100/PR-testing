/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDispatch } from "react-redux";
import { ShapeSVG } from "../../pages/ZoomPinchPan";
import { allocateChildrenInGrid } from "../../utils/allocateChildren";
import { selectSD } from "../../store/slice/serviceDomainSlice";

const RenderGrandChildren = ({
	child,
	childIndex,
	parentIndex,
	l1pos,
	parentRect,
	handleBoxClick,
	rectRefs,
	theme,
}) => {
	const dispatch = useDispatch();

	const parentAbsBox = {
		x: l1pos.x,
		y: l1pos.y,
		width: l1pos.width,
		height: l1pos.height,
	};

	const positions = allocateChildrenInGrid(
		parentAbsBox,
		child.children.length,
		4
	);

	return child.children.map((grandchild, grandchildIndex) => {
		const pos = positions[grandchildIndex];

		return (
			<g key={grandchildIndex}>
				<ShapeSVG
					x={parentAbsBox.x + pos.x - 10}
					y={parentAbsBox.y + pos.y - 5}
					ref={(el) =>
						(rectRefs.current[
							`${parentIndex}-${childIndex}-${grandchildIndex}`
						] = el)
					}
					width={pos.width}
					height={pos.height}
					fill={theme.palette.warning.main}
					onClick={(e) => {
						e.stopPropagation();
						handleBoxClick(
							`${parentIndex}-${childIndex}-${grandchildIndex}`,
							true
						);
					}}
					onInfoClick={(e) => {
						dispatch(selectSD(grandchild.label));
					}}
					className="child-child-rect"
					stroke={"white"}
					strokeWidth={0.5}
					label={grandchild.label}
					fontWeight="normal"
					fontSize="2"
					grandchild
				/>
			</g>
		);
	});
};

export default RenderGrandChildren;
