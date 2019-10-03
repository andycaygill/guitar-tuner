import React, { useState } from "react";
import Pedal from "./components/pedal-svg/pedal.js";
import { getNoteData } from "./utils/note-detection/index.js";
import "./App.css";

if (
	global.AnalyserNode &&
	!global.AnalyserNode.prototype.getFloatTimeDomainData
) {
	var uint8 = new Uint8Array(2048);
	global.AnalyserNode.prototype.getFloatTimeDomainData = function(array) {
		this.getByteTimeDomainData(uint8);
		for (var i = 0, imax = array.length; i < imax; i++) {
			array[i] = (uint8[i] - 128) * 0.0078125;
		}
	};
}

function App() {
	const [currentNote, setCurrentNote] = useState();
	const [needlePosition, setNeedlePosition] = useState();

	function calculateNeedlePosition(noteVariance) {
		return noteVariance * 20;
		/*const currentNoteFrequency = noteData.currentNoteFrequency;
		const noteMinFrequency = noteData.noteMinFrequency;
		const noteMaxFrequency = noteData.noteMaxFrequency;

		//Calculate the percentage value to position the needle in CSS
		// Adjust the numbers so that the values start from 0, to make it easier to calculate percentage
		const maxFreq = noteMaxFrequency - noteMinFrequency;
		const currentFreq = currentNoteFrequency - noteMinFrequency;
		const percentage = (currentFreq * 100) / maxFreq;

    return percentage;
    */
	}

	function successCallback(stream) {
		//window.AudioContext = window.AudioContext || window.webkitAudioContext;
		const audioContext = new (window.AudioContext ||
			window.webkitAudioContext)();
		const analyser = audioContext.createAnalyser();
		analyser.fftSize = Math.pow(2, 13);
		const sampleRate = audioContext.sampleRate;
		const data = new Float32Array(analyser.fftSize);

		function step() {
			analyser.getFloatTimeDomainData(data);

			const noteData = getNoteData(data, sampleRate);

			if (noteData) {
				console.log(noteData);
				setCurrentNote(noteData.key);
				setNeedlePosition(calculateNeedlePosition(noteData.variance));
			}

			//requestAnimationFrame(step);
		}

		setInterval(step, 50);

		const mediaStreamSource = audioContext.createMediaStreamSource(stream);
		mediaStreamSource.connect(analyser);
		//requestAnimationFrame(step);
	}

	function errorCallback(err) {
		alert(err);
	}

	//navigator.getUserMedia(, , errorCallback);
	navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then(function(stream) {
			successCallback(stream);
		})
		.catch(function(err) {
			alert(err);
		});

	let audioContext = new (window.AudioContext || window.webkitAudioContext)();
	let analyserNode = audioContext.createAnalyser();

	return (
		<div className="App">
			<Pedal currentNote={currentNote} dialPosition={needlePosition} />
		</div>
	);
}

export default App;
