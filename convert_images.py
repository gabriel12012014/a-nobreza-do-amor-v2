import os
import glob
from PIL import Image

def optimize_images(directory):
    files = []
    for ext in ('*.png', '*.jpg', '*.jpeg'):
        files.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))
    
    for file_path in files:
        try:
            img = Image.open(file_path)
            
            # Use RGBA to handle transparency correctly if PNG
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            
            base = os.path.splitext(file_path)[0]
            new_path = base + ".webp"
            
            # Convert and save with WebP format
            # Using quality=75 for good compression
            img.save(new_path, "webp", quality=75, optimize=True)
            print(f"Convertida e comprimida: {os.path.basename(file_path)} -> {os.path.basename(new_path)}")
        except Exception as e:
            print(f"Erro ao converter {file_path}: {e}")

if __name__ == "__main__":
    optimize_images('assets/')
