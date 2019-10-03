// import Pitchfinder from "pitchfinder";
import NoteFrequencies from "./note-frequencies.js";
import YinJs from "yinjs/yin.js";

const BASE_NOTE = 440.0 * Math.pow(2.0, -4.75); // Octave 0, Key C
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getKeyandOctave(frequency) {
	const halfStepsBelowMiddleC = Math.round(
		12.0 * Math.log2(frequency / BASE_NOTE)
	);
	const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
	const key = KEYS[Math.floor(halfStepsBelowMiddleC % 12)];
	return { octave, key };
}

export function getNoteData(data, sampleRate) {
	const frequency = window.yin(data, sampleRate);
	if (frequency) {
		const { octave, key } = getKeyandOctave(frequency);
		if (octave && key) {
			const currentNotePerfectFrequency = NoteFrequencies[octave][key];
			const variance = frequency - currentNotePerfectFrequency;

			return {
				octave,
				key,
				frequency,
				variance
			};
		}
	}
}
