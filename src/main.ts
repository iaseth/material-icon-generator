#!/usr/bin/env node

import { ArgumentParser } from 'argparse';
import { icons } from './icon.js';
import { addIconsCommand, removeIconsCommand, generateIconsCommand, listIconsCommand, generateMasterComponentCommand, CommandProps } from './commands.js';



function main() {
	const parser = new ArgumentParser({
		description: 'mi - Command-line tool for generating MaterialIcon Component for Svelte',
	});

	// Define arguments
	parser.add_argument('command', {
		help: 'The command to run'
	});
	parser.add_argument('-d', '--dirpath', {
		help: 'Output directory path',
		metavar: 'DIRPATH',
		default: "src/lib/components"
	});
	const [args, rest] = parser.parse_known_args();

	const props: CommandProps = {
		dirpath: args.dirpath
	};

	switch (args.command) {
		case "add":
		case "a":
			addIconsCommand(rest, props); break;

		case "remove":
		case "rm":
		case "r":
			removeIconsCommand(rest, props); break;

		case "create":
		case "c":
			generateIconsCommand(props, false); break;

		case "generate":
		case "gen":
		case "g":
			generateMasterComponentCommand(props, true); break;

		case 'list':
		case 'l':
			listIconsCommand(icons); break;

		default:
			console.log(`Unknown command: '${args.command}'`); return;
	}
}

main()
