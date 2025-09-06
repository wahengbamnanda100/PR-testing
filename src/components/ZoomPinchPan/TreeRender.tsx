import RenderChildren from "./RenderChildren";
import { flattenTree } from "../../utils/flatenTree";
import { assignPositions } from "../../utils/assignPosition";
import { ShapeSVG } from "../../pages/ZoomPinchPan";

const TreeRenderer = ({ treeData, scale, handleBoxClick, rectRefs, theme }) => {
	const flatNodes = flattenTree(treeData);
	const positionMap = assignPositions(flatNodes);

	return (
		<>
			{/* Render all top-level parents */}
			{flatNodes
				.filter((n) => n.level === 0)
				.map((parent) => {
					const pos = positionMap[parent.indexPath];

					return (
						<g key={parent.indexPath}>
							<ShapeSVG
								x={pos.x}
								y={pos.y}
								width={pos.width}
								height={pos.height}
								label={parent.label}
								stroke="black"
								fill={theme.palette.primary.main}
							/>

							{/* Render children */}
							<RenderChildren
								flatNodes={flatNodes}
								positionMap={positionMap}
								handleBoxClick={handleBoxClick}
								rectRefs={rectRefs}
								theme={theme}
								scale={scale}
							/>
						</g>
					);
				})}
		</>
	);
};

export default TreeRenderer;
