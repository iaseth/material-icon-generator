import json
import re
from pathlib import Path


ICONS_DIRPATH = "material-icons/svg"
BASE_DIR = Path(ICONS_DIRPATH).resolve()

# precompile for speed if used repeatedly
_PATH_D_RE = re.compile(r'<path\b[^>]*\bd="([^"]*)"', re.IGNORECASE)

def extract_svg_paths(svg_path: str):
	with open(svg_path, "r", encoding="utf-8") as f:
		content = f.read()
	return _PATH_D_RE.findall(content)


class MaterialIcon:
	def __init__(self, fullpath):
		self.fullpath = fullpath

		relative_path = self.fullpath.relative_to(BASE_DIR)
		fullname = relative_path.with_suffix("").as_posix()
		self.category, self.name = fullname.replace("_", "-").split("/")

	@property
	def fullname(self):
		if self.category:
			return f"{self.category}-{self.name}"
		return self.name

	@property
	def paths(self):
		return extract_svg_paths(self.fullpath)

	@property
	def jo(self):
		return dict(name=self.fullname, paths=self.paths)

	def __lt__(self, other):
		return self.fullpath < other.fullpath

	def __str__(self):
		return f"{self.fullname} ({self.fullpath})"


def find_svgs():
	icons = []

	for svg_path in BASE_DIR.rglob("*.svg"):
		icon = MaterialIcon(svg_path)
		icons.append(icon)

	icons.sort()
	return icons


def print_icons(icons):
	for idx, icon in enumerate(icons, start=1):
		print(f"{idx:5}. {icon}")


def main():
	icons = find_svgs()

	filled_icons = [x for x in icons if x.category == 'filled']
	outlined_icons = [x for x in icons if x.category == 'outlined']
	round_icons = [x for x in icons if x.category == 'round']
	sharp_icons = [x for x in icons if x.category == 'sharp']

	default_icons = [MaterialIcon(icon.fullpath) for icon in outlined_icons]
	for icon in default_icons:
		icon.category = ""

	icons = [
		*default_icons,
		*filled_icons,
		*outlined_icons,
		*round_icons,
		*sharp_icons,
	]

	print(f"Found {len(icons)} icons")
	print_icons(icons[:10])

	data = [icon.jo for icon in icons]
	jo = dict(icons=data)

	output_json_path = "src/data/icons.json"
	with open(output_json_path, "w") as f:
		json.dump(jo, f, sort_keys=True)
	print(f"Saved: {output_json_path} ({len(icons)} icons)")


if __name__ == '__main__':
	main()
