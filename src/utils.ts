import path from 'path';



function dashedToCamelCase(str: string): string {
	return str
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join('');
}

export function getSvelteFileName(title: string): string {
	return `Svig${dashedToCamelCase(title)}Icon.svelte`;
}

export function getSvelteComponentPath(iconName: string, dirpath: string): string {
	const filename = getSvelteFileName(iconName);
	const filepath = path.join(dirpath, filename);
	return filepath;
}
