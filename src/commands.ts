import { IconDS, generateMasterComponentOnDisk, icons } from './icon.js';
import { getMiConfig, saveMiConfig, miConfigPath } from './config.js';
import { getSvelteComponentPath } from './utils.js';


export interface CommandProps {
	dirpath: string;
	fallback: boolean;
}


export function addIconsCommand (iconNames: string[], props: CommandProps) {
	const { dirpath } = props;
	if (iconNames.length === 0) {
		console.log(`Please provide icons to add!`); return;
	}

	const config = getMiConfig();
	for (const iconName of iconNames) {
		const icon = icons.find(ic => ic.name === iconName);
		if (icon) {
			if (config.icons.includes(iconName)) {
				console.log(`Icon already added: '${iconName}'`);
			} else {
				console.log(`Icon was added: '${iconName}'`);
				config.icons.push(iconName);
				saveMiConfig(config);
			}
		} else {
			console.log(`Icon not found: '${iconName}'`);
		}
	}

	generateMasterComponentOnDisk(config.icons, props);
}

export function removeIconsCommand (iconNames: string[], props: CommandProps) {
	const { dirpath } = props;
	if (iconNames.length === 0) {
		console.log(`Please provide icons to remove!`); return;
	}

	const config = getMiConfig();
	if (!config.icons || config.icons.length === 0) {
		console.log(`No icons found in config: '${miConfigPath}'`);
		return;
	}

	for (const iconName of iconNames) {
		if (config.icons.includes(iconName)) {
			config.icons = config.icons.filter(ic => ic !== iconName);
			saveMiConfig(config);
			console.log(`Icon was removed: '${iconName}'`);
		} else {
			console.log(`Icon not present in config: '${iconName}'`);
		}
	}

	generateMasterComponentOnDisk(config.icons, props);
}

export function generateIconsCommand (props: CommandProps, overwrite: boolean) {
	const { dirpath } = props;
	const config = getMiConfig();
	if (config.icons.length === 0) {
		console.log(`No icons found in config: '${miConfigPath}'`)
		return;
	}

	generateMasterComponentOnDisk(config.icons, props);
}

export function listIconsCommand (iconArr: IconDS[]) {
	for (let i=0; i < iconArr.length; i++) {
		const icon = iconArr[i];
		console.log(`Icon ${i+1} => '${icon.name}'`);
	}
}

export function generateMasterComponentCommand (props: CommandProps, overwrite: boolean) {
	const { dirpath } = props;
	const outputFilePath = getSvelteComponentPath("", dirpath);

	try {
		const config = getMiConfig();
		generateMasterComponentOnDisk(config.icons, props);
	} catch (error) {
		console.log(`\tError: ${error}`);
		console.log(`\tCould not generate: '${outputFilePath}'`);
	}
}
