import Pitchfinder from "pitchfinder";

const detectPitch = Pitchfinder.AMDF();

// Lookup array for note names.
const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function float32ArrayFromBuffer(buffer) {
	return buffer.getChannelData(0);
}

function noteNumberFromPitch(pitch) {
	const noteNum = 12 * (Math.log(pitch / 440) / Math.log(2));
	return Math.round(noteNum) + 69;
	//return noteNum + 69;
}

function noteNumberToString(noteNumber) {
	const note = keys[Math.round(noteNumber) % 12];
	return note;
}

export function getNoteData(buffer) {
	const frequencyArray = float32ArrayFromBuffer(buffer);
	const pitch = detectPitch(frequencyArray);

	if (pitch) {
		const noteNumber = noteNumberFromPitch(pitch);
		const noteString = noteNumberToString(noteNumber);
		return { noteString, noteNumber };
	}
}
