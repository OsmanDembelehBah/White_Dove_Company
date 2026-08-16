#!/usr/bin/env python3
import re

files = ['manager.html', 'seller.html']

for filename in files:
    try:
        with open(filename, 'r') as f:
            content = f.read()
        
        # Replace CDN links
        content = content.replace(
            'https://unpkg.com/react@18/umd/react.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js'
        )
        content = content.replace(
            'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js'
        )
        content = content.replace(
            'https://unpkg.com/@babel/standalone/babel.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.9/babel.min.js'
        )
        
        with open(filename, 'w') as f:
            f.write(content)
        print(f'✅ Fixed {filename}')
    except Exception as e:
        print(f'❌ Error fixing {filename}: {e}')

print('Done!')
