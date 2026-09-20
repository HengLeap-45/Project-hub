import os
import glob

html_files = glob.glob('c:/modern-website/*.html')

nav_logo_old = '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-blue-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-violet-500/30 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300">P</div>'
nav_logo_new = '<img src="./assets/logo.jpg" alt="ProjectHub Logo" class="w-10 h-10 rounded-xl object-cover shadow-lg shadow-violet-500/30 group-hover:rotate-6 group-hover:scale-105 transition-transform duration-300">'

mobile_logo_old = '<div class="w-9 h-9 rounded-xl bg-gradient-to-br from-fuchsia-500 to-blue-600 flex items-center justify-center text-white font-extrabold">P</div>'
mobile_logo_new = '<img src="./assets/logo.jpg" alt="ProjectHub Logo" class="w-9 h-9 rounded-xl object-cover">'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(nav_logo_old, nav_logo_new)
    content = content.replace(mobile_logo_old, mobile_logo_new)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print(f'Updated {len(html_files)} files.')
