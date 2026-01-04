import os

root_dir = "."
target_str_1 = 'style="padding-top: 140px;"'
target_str_2 = 'style="padding-top: 140px; padding-bottom: 60px;"'
replacement = 'style="padding-top: 100px; padding-bottom: 20px;"'

count = 0

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".html"):
            filepath = os.path.join(dirpath, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content.replace(target_str_1, replacement)
            new_content = new_content.replace(target_str_2, replacement)
            
            if content != new_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Fixed: {filepath}")
                count += 1

print(f"Total files fixed: {count}")
