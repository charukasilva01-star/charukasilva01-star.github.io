import os
import glob

# 1. Rename files
assets_dir = "assets"
for root, dirs, files in os.walk(assets_dir):
    for f in files:
        if " " in f:
            old_path = os.path.join(root, f)
            new_f = f.replace(" ", "_")
            new_path = os.path.join(root, new_f)
            os.rename(old_path, new_path)
            print(f"Renamed: {old_path} -> {new_path}")

# 2. Update index.html
with open("index.html", "r") as file:
    content = file.read()

# Replace all spaces in src attributes inside assets/
import re
def replacer(match):
    src_val = match.group(1)
    if src_val.startswith("assets/") and " " in src_val:
        new_src = src_val.replace(" ", "_")
        return f'src="{new_src}"'
    return match.group(0)

new_content = re.sub(r'src="([^"]+)"', replacer, content)

with open("index.html", "w") as file:
    file.write(new_content)

print("Updated index.html")
