import React from "react";

function Dial(props) {
	return (
		<svg width="410" height="95">
			<rect
				width="10px"
				height="100%"
				style={{
					fill: `rgb(245, 91, 91)`,
					// transition: `all ease-in-out 0.2s`,
					transform: `translateX(-5px)`
				}}
				x={`${props.dialPosition}%`}
			></rect>
		</svg>
	);
}

export default Dial;
