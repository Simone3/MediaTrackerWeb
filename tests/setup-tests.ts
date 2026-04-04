import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

const globalObject = globalThis as typeof globalThis & {
	TextDecoder?: typeof TextDecoder;
	TextEncoder?: typeof TextEncoder;
};

if (!globalObject.TextEncoder) {
	globalObject.TextEncoder = TextEncoder;
}

if (!globalObject.TextDecoder) {
	globalObject.TextDecoder = TextDecoder;
}
