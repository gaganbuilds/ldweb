from rembg import remove
from PIL import Image
import sys

input_path = "src/assets/student.png"
output_path = "src/assets/student.png"

try:
    print("Loading image...")
    input_image = Image.open(input_path)
    print("Removing background...")
    output_image = remove(input_image)
    print("Saving image...")
    output_image.save(output_path, format="PNG")
    print("Done!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
