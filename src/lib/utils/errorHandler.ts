// src/lib/utils/errorHandler.ts
export class GameError extends Error {
	constructor(message: string, public context: string) {
		super(message);
		this.name = 'GameError';
	}
}

export function createSafeWrapper<T extends any[], R>(
	fn: (...args: T) => R,
	context: string,
	fallback?: R
) {
	return (...args: T): R => {
		try {
			return fn(...args);
		} catch (err) {
			console.error(`Error in ${context}:`, err);
			if (fallback !== undefined) return fallback;
			throw new GameError((err as Error).message, context);
		}
	};
}

export function safeStoreAccess<T>(
	storeValue: T,
	fallback: T,
	storeName: string
): T {
	try {
		return storeValue || fallback;
	} catch (err) {
		console.error(`Error accessing ${storeName} store:`, err);
		return fallback;
	}
}
