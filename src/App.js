import React, { useState } from "react";
import Pedal from "./components/pedal-svg/pedal.js";
import { getNoteData } from "./utils/note-detection/index.js";
import "./App.css";

function App() {
	const [currentNote, setCurrentNote] = useState();
	const [needlePosition, setNeedlePosition] = useState();

	/*
	function calculateNeedlePosition(noteData) {
		const currentNoteFrequency = noteData.currentNoteFrequency;
		const noteMinFrequency = noteData.noteMinFrequency;
		const noteMaxFrequency = noteData.noteMaxFrequency;

		//Calculate the percentage value to position the needle in CSS
		// Adjust the numbers so that the values start from 0, to make it easier to calculate percentage
		const maxFreq = noteMaxFrequency - noteMinFrequency;
		const currentFreq = currentNoteFrequency - noteMinFrequency;
		const percentage = (currentFreq * 100) / maxFreq;

		return percentage;
  }
  */

	function successCallback(stream) {
		//window.AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = Math.pow(2, 13);
		const sampleRate = audioContext.sampleRate;
		const data = new Float32Array(analyser.fftSize);

		function step() {
			requestAnimationFrame(step);
			analyser.getFloatTimeDomainData(data);

			const noteData = getNoteData(data, sampleRate);

			if (noteData) {
				setCurrentNote(noteData.key);
				setNeedlePosition(noteData.variance);
			}
		}

		const mediaStreamSource = audioContext.createMediaStreamSource(stream);
		mediaStreamSource.connect(analyser);
		requestAnimationFrame(step);
	}

	function errorCallback(err) {
		alert(err);
	}

	navigator.getUserMedia({ audio: true }, successCallback, errorCallback);

	let audioContext = new (window.AudioContext || window.webkitAudioContext)();
	let analyserNode = audioContext.createAnalyser();

	return (
		<div className="App">
			<Pedal currentNote={currentNote} dialPosition={needlePosition} />
		</div>
	);
}

export default App;
