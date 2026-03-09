import os
from PIL import Image

file_path = 'assets/titulos/barro-preto.png'
if os.path.exists(file_path):
    try:
        img = Image.open(file_path)
        img = img.convert("RGBA")
        new_path = 'assets/titulos/barro-preto.webp'
        img.save(new_path, "webp", quality=75, optimize=True)
        print(f"✅ Convertida para WebP: {new_path}")
        os.remove(file_path)
    except Exception as e:
        print(f"Erro ao converter: {e}")
else:
    print(f"Aviso: {file_path} não encontrado.")
