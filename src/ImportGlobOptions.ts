export type ImportGlobOptions = {
	eager?: boolean;
	import?: string;
};

export const isImportGlobOptions = (value: unknown): value is ImportGlobOptions =>
	typeof value === 'object' &&
	value !== null &&
	Object.entries(value).every(([key, value]) => {
		if (!['import', 'eager'].includes(key)) {
			return false;
		}

		if (key === 'import' && typeof value !== 'string' && value !== undefined) {
			return false;
		}

		if (key === 'eager' && typeof value !== 'boolean' && value !== undefined) {
			return false;
		}

		return true;
	});
