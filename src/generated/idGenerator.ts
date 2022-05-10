import { customAlphabet } from 'nanoid';
import { lowercase, uppercase, numbers } from 'nanoid-dictionary';

const dictionary = [...lowercase, ...uppercase, ...numbers].join('');

/**
 * Generate designer id
 */
export const generateDesignerId = (): string => {
	const generate = customAlphabet(dictionary, 6);
	return generate();
};