import fs from 'fs';



export const svigConfigPath = "svig.config.json";

export interface SvigConfigDS {
	icons: string[]
}

export function getSvigConfig (): SvigConfigDS {
	try {
		const data = fs.readFileSync(svigConfigPath, 'utf8');
		const config: SvigConfigDS = JSON.parse(data);
		return config;
	} catch (error) {
		const config: SvigConfigDS = {
			icons: []
		}
		return config;
	}
}

export function saveSvigConfig (config: SvigConfigDS) {
	try {
		config.icons = config.icons.sort();
		const jsonString = JSON.stringify(config, null, 2); // Indented with 2 spaces
		fs.writeFileSync(svigConfigPath, jsonString);
	} catch (error) {
		console.log(`Error while writing json: ${error}`);
	}
}
