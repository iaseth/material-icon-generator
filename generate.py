import json
import re
from pathlib import Path


ICONS_DIRPATH = "material-icons/svg"
BASE_DIR = Path(ICONS_DIRPATH).resolve()

# precompile for speed (handles single or double quotes, any attr order)
_PATH_D_RE = re.compile(
	r"<path\b[^>]*\bd\s*=\s*(['\"])(.*?)\1",
	re.IGNORECASE | re.DOTALL,
)

def extract_svg_pathd(svg_file: str) -> str | None:
	with open(svg_file, "r", encoding="utf-8") as f:
		content = f.read()

	m = _PATH_D_RE.search(content)
	return m.group(2) if m else None


class MaterialIcon:
	def __init__(self, fullpath):
		self.fullpath = fullpath

		relative_path = self.fullpath.relative_to(BASE_DIR)
		fullname = relative_path.with_suffix("").as_posix()
		self.category, self.name = fullname.replace("_", "-").split("/")

	@property
	def fullname(self):
		return f"{self.category}-{self.name}"

	@property
	def pathd(self):
		return extract_svg_pathd(self.fullpath)

	@property
	def jo(self):
		return dict(name=self.fullname, pathd=self.pathd)

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
	icons = [icon for icon in icons if icon.category != 'two-tone']
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
