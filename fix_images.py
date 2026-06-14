from PIL import Image
import glob

for file in glob.glob('assets/pooja/post_pooja_*.jpg'):
    try:
        img = Image.open(file).convert('RGB')
        # save as standard JPEG
        img.save(file, 'JPEG', quality=90, optimize=True)
        print(f"Fixed {file}")
    except Exception as e:
        print(f"Error fixing {file}: {e}")
