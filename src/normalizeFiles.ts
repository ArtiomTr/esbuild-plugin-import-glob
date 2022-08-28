import { normalize, join, dirname } from 'path';

export const normalizeFiles = (files: string[], current: string): string[] => {
	const normalizedFiles = files
		.map(normalize)
		.filter((file) => normalize(join(dirname(current), file)) !== normalize(current));

	return normalizedFiles.map((file) => (/^[./\\]/.test(file) ? file : `./${file}`).replace(/\\/g, '/'));
};
