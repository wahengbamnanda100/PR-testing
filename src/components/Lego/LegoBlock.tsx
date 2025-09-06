/// <reference types="vite-plugin-svgr/client" />
import Lego from "../../assets/sd_icons/cube.svg?react";

const LegoBlock = ({ x, y }) => {
	return (
		<g transform={`translate(${x}, ${y})`}>
			<Lego />
		</g>
	);
};

export default LegoBlock;
