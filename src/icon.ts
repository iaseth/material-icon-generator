import fs from "fs";
import Handlebars from "handlebars";
import { readFile } from "./fsutils.js";
import { getSvelteComponentPath } from "./utils.js";



export interface IconDS {
	name: string;
	paths: string[];
}

const iconsJson = JSON.parse(readFile('data/icons.json'));
export const icons: IconDS[] = iconsJson.icons;

export function getTemplate (filename: string) {
	const templateSrc = readFile(`templates/${filename}`);
	const template = Handlebars.compile(templateSrc);
	return template;
}

export function generateMasterComponentOnDisk(iconNames: string[], dirpath: string, overwrite: boolean = true) {
	const outputFilePath = getSvelteComponentPath("", dirpath);

	if (!overwrite && fs.existsSync(outputFilePath)) {
		console.log(`\tExists: '${outputFilePath}'`);
		return;
	}

	try {
		const masterTemplate = getTemplate("SvelteMasterComponent.hbs");

		const currentIcons = iconNames.map(name => icons.find(i => i.name === name));
		const nametype = iconNames.map(i => `"${i}"`).join(" | ");
		const iconsArray = iconNames.map(i => `"${i}"`).join(", ");
		const firstIcon = currentIcons[0];
		const restIcons = currentIcons.slice(1);
		const unknownIcon = icons.find(i => i.name === "question-mark-circle");

		const renderedCode = masterTemplate({
			nametype, iconsArray,
			firstIcon, restIcons, unknownIcon
		});
		fs.writeFileSync(outputFilePath, renderedCode);
		console.log(`\tGenerated: '${outputFilePath}'`);
	} catch (error) {
		console.log(`\tError: ${error}`);
		console.log(`\tCould not generate: '${outputFilePath}'`);
	}
}
