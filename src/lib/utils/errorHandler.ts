// src/lib/utils/errorHandler.ts
export class GameError extends Error {
	constructor(message: string, public context?: string) {
		super(message);
		this.name = 'GameError';
	}
}

export function createSafeWrapper<T extends (...args: any[]) => any>(
	fn: T,
	context: string,
	fallbackReturn?: ReturnType<T>
): T {
	return ((...args: Parameters<T>): ReturnType<T> => {
		try {
			return fn(...args);
		} catch (error) {
			console.error(`Error in ${context}:`, error);
			
			if (fallbackReturn !== undefined) {
				return fallbackReturn;
			}
			
			throw new GameError(
				`Error in ${context}: ${(error as Error).message}`,
				context
			);
		}
	}) as T;
}

export function safeStoreAccess<T>(
	storeValue: T,
	fallback: T,
	context: string
): T {
	try {
		if (storeValue === undefined || storeValue === null) {
			console.warn(`Store value is null/undefined in ${context}, using fallback`);
			return fallback;
		}
		return storeValue;
	} catch (error) {
		console.error(`Error accessing store in ${context}:`, error);
		return fallback;
	}
}

export function handleAsyncError(
	promise: Promise<any>,
	context: string
): Promise<any> {
	return promise.catch(error => {
		console.error(`Async error in ${context}:`, error);
		throw new GameError(
			`Async operation failed in ${context}: ${error.message}`,
			context
		);
	});
}

export function logDebug(message: string, data?: any): void {
	if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
		console.log(`[DEBUG] ${message}`, data);
	}
}

export function logError(message: string, error: Error, context?: string): void {
	console.error(
		`[ERROR] ${message}${context ? ` (${context})` : ''}:`,
		error
	);
}
