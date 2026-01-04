import os

root_dir = "."
target_style = 'style="padding-top: 100px; padding-bottom: 20px;"'
target_class = 'class="section text-center"'
replacement = 'class="hero-small"'

count = 0

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".html"):
            if "index.html" in filename and ("es" in dirpath or "en" in dirpath):
                # Skip index.html as it uses full .hero
                continue
                
            filepath = os.path.join(dirpath, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Search for the specific header line
            # We look for where class and style are both present in the header tag
            if target_style in content and target_class in content:
                new_content = content.replace(target_class, replacement)
                new_content = new_content.replace(target_style, "")
                # Clean up potential double spaces or empty style attributes if any remain (basic cleanup)
                new_content = new_content.replace(' style=""', '')
                
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Upgraded: {filepath}")
                count += 1

print(f"Total files upgraded: {count}")
