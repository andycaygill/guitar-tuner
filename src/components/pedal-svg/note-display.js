import React from "react";

function NoteDisplay(props) {
	return (
		<svg width="220" height="140">
			<text
				fill="#000000"
				fontFamily="DS-Digital"
				fontSize="135"
				fontWeight="normal"
				textAnchor="middle"
				x="50%"
				y="50%"
				dominantBaseline="middle"
			>
				{props.currentNote}
			</text>
		</svg>
	);
}

export default NoteDisplay;
