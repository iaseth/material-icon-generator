import fs from 'fs';



export const miConfigPath = "mi.config.json";

export interface MiConfigDS {
	icons: string[]
}

export function getMiConfig (): MiConfigDS {
	try {
		const data = fs.readFileSync(miConfigPath, 'utf8');
		const config: MiConfigDS = JSON.parse(data);
		return config;
	} catch (error) {
		const config: MiConfigDS = {
			icons: []
		}
		return config;
	}
}

export function saveMiConfig (config: MiConfigDS) {
	try {
		config.icons = config.icons.sort();
		const jsonString = JSON.stringify(config, null, 2); // Indented with 2 spaces
		fs.writeFileSync(miConfigPath, jsonString);
	} catch (error) {
		console.log(`Error while writing json: ${error}`);
	}
}
