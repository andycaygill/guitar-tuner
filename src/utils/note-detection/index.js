// import Pitchfinder from "pitchfinder";
import NoteFrequencies from "./note-frequencies.js";
import YinJs from "yinjs/yin.js";

// Lookup array for note names.
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getNextNote(note) {
	if (note === "B") {
		return "C";
	} else {
		const currentNoteIndex = keys.indexOf(note);
		return keys[currentNoteIndex + 1];
	}
}

function getPrevNote(note) {
	if (note === "C") {
		return "B";
	} else {
		const currentNoteIndex = keys.indexOf(note);
		return keys[currentNoteIndex - 1];
	}
}

function getNoteRange(octave, note) {
	const nextNote = getNextNote(note);
	const prevNote = getPrevNote(note);
	const currentNoteFrequency = NoteFrequencies[octave][note];
	const nextNoteFrequency = NoteFrequencies[octave][nextNote];
	const prevNoteFrequency = NoteFrequencies[octave][prevNote];

	const noteMinFrequency =
		currentNoteFrequency - Math.abs(currentNoteFrequency - prevNoteFrequency);
	const noteMaxFrequency =
		currentNoteFrequency + Math.abs(currentNoteFrequency - nextNoteFrequency);

	return { currentNoteFrequency, noteMinFrequency, noteMaxFrequency };
}

export function getNoteData(data, sampleRate) {
	const frequency = window.yin(data, sampleRate);
	if (frequency) {
		const c0 = 440.0 * Math.pow(2.0, -4.75);
		const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(frequency / c0));
		const remainder = (12.0 * Math.log2(frequency / c0)) % 1;
		const remainderPercent = remainder * 100;
		const variance = Math.abs(remainderPercent - 100);
		const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
		const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];

		if (octave > 0) {
			const {
				currentNoteFrequency,
				noteMinFrequency,
				noteMaxFrequency
			} = getNoteRange(octave, key);

			return {
				octave,
				key,
				currentNoteFrequency,
				noteMinFrequency,
				noteMaxFrequency,
				variance
			};
		}
	}
}
