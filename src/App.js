import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { getNoteData } from "./utils/NoteDetection.js";

const handleSuccess = function(stream) {
	const context = new AudioContext();
	const source = context.createMediaStreamSource(stream);
	const processor = context.createScriptProcessor(1024, 1, 1);

	source.connect(processor);
	processor.connect(context.destination);

	processor.onaudioprocess = function(e) {
		const note = getNoteData(e.inputBuffer);

		if (note) {
			console.log(note);
		}
	};
};

navigator.mediaDevices
	.getUserMedia({ audio: true, video: false })
	.then(handleSuccess);

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
