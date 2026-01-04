import os

root_dir = "."
target_footer = '<footer class="text-center section" style="padding: 4rem 0; border-top: 1px solid var(--border-subtle);">'
footer_replacement_es = '''<footer class="text-center section" style="padding: 4rem 0; border-top: 1px solid var(--border-subtle);">
        <p style="opacity: 0.5; font-size: 0.9rem;">&copy; 2026 ZEROX Project. Manuel Marco del Pino.</p>
        <div class="footer-socials">
            <a href="https://www.linkedin.com/in/manuel-marco-del-pino/" target="_blank" class="footer-icon" aria-label="LinkedIn">LinkedIn</a>
            <a href="https://github.com/migranitodearenamanuel" target="_blank" class="footer-icon" aria-label="Portfolio">Portfolio</a>
            <a href="https://github.com/migranitodearenamanuel/Zerox-Core" target="_blank" class="footer-icon" aria-label="Repo">Repo</a>
        </div>
    </footer>'''

footer_replacement_en = '''<footer class="text-center section" style="padding: 4rem 0; border-top: 1px solid var(--border-subtle);">
        <p style="opacity: 0.5; font-size: 0.9rem;">&copy; 2026 ZEROX Project. Manuel Marco del Pino.</p>
        <div class="footer-socials">
            <a href="https://www.linkedin.com/in/manuel-marco-del-pino/" target="_blank" class="footer-icon" aria-label="LinkedIn">LinkedIn</a>
            <a href="https://github.com/migranitodearenamanuel" target="_blank" class="footer-icon" aria-label="Portfolio">Portfolio</a>
            <a href="https://github.com/migranitodearenamanuel/Zerox-Core" target="_blank" class="footer-icon" aria-label="Repo">Repo</a>
        </div>
    </footer>'''

count = 0

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".html"):
            if "index.html" in filename and "es" in dirpath:
                continue # Already done manually

            filepath = os.path.join(dirpath, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            # Find the footer start and replace the block until </footer>
            if target_footer in content:
                start_index = content.find(target_footer)
                end_index = content.find("</footer>", start_index) + len("</footer>")
                
                if start_index != -1 and end_index != -1:
                    old_footer_block = content[start_index:end_index]
                    
                    if "es" in dirpath:
                        new_content = content.replace(old_footer_block, footer_replacement_es)
                    else:
                        new_content = content.replace(old_footer_block, footer_replacement_en)
                    
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Footer Upgraded: {filepath}")
                    count += 1

print(f"Total footers upgraded: {count}")
