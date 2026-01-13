#!/usr/bin/env python3
"""
Automated script to replace all hardcoded localhost URLs with axiosInstance
"""
import os
import re
from pathlib import Path

# Files that need fixing (in order of importance)
files_to_fix = [
    'src/pages/Board.jsx',
    'src/pages/WikiPage.jsx', 
    'src/pages/Wiki.jsx',
    'src/pages/timelogsummary.jsx',
    'src/pages/pipelines.jsx',
    'src/pages/SprintFixed.jsx',
    'src/pages/Sprint.jsx',
    'src/pages/workitemdetail.jsx',
    'src/pages/ProjectDetail.jsx',
    'src/components/TaskboardSidebar.jsx',
    'src/components/project/boardSubitem/WorkItemEdit.jsx',
    'src/components/project/boardSubitem/Sprint.jsx',
    'src/hooks/useProject.js',
]

def fix_file(filepath):
    """Fix localhost URLs in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Replace axios import with axiosInstance
        if "import axios from 'axios'" in content:
            content = content.replace("import axios from 'axios'", "import axiosInstance from '../services/axiosInstance'")
        elif 'import axios from "axios"' in content:
            content = content.replace('import axios from "axios"', "import axiosInstance from '../services/axiosInstance'")
        
        # Replace import API_BASE_URL if needed for image URLs
        if 'localhost' in content and '`http://localhost' in content and '.logo' in content:
            if 'API_BASE_URL' not in content:
                # Add import after other imports
                lines = content.split('\n')
                for i, line in enumerate(lines):
                    if 'import axiosInstance' in line:
                        lines.insert(i+1, "import { API_BASE_URL } from '../utils/apiBase';")
                        content = '\n'.join(lines)
                        break
        
        # Replace HTTP calls:
        # 1. axios.get/post/patch/delete with full URL
        patterns = [
            # Match: axios.get(`http://localhost:5000/api/...`, { headers: ... })
            (r"axios\.get\(\s*`http://localhost:5000/api/([^`]+)`\s*,\s*\{\s*headers:\s*\{[^}]+Authorization[^}]+\}\s*\}\s*\)", 
             lambda m: f"axiosInstance.get(`/{m.group(1)}`)"),
            
            # Match: axios.post/patch/delete with full URL
            (r"axios\.(post|put|patch|delete)\(\s*`http://localhost:5000/api/([^`]+)`\s*,\s*([^,]+)\s*,\s*\{\s*headers:\s*\{[^}]+Authorization[^}]+\}\s*\}\s*\)",
             lambda m: f"axiosInstance.{m.group(1)}(`/{m.group(2)}`, {m.group(3)})"),
            
            # Match: axios.get/post without headers object
            (r"axios\.get\(\s*`http://localhost:5000/api/([^`]+)`\s*\)",
             lambda m: f"axiosInstance.get(`/{m.group(1)}`)"),
            
            (r"axios\.(post|patch|put|delete)\(\s*`http://localhost:5000/api/([^`]+)`\s*,\s*([^)]+)\s*\)",
             lambda m: f"axiosInstance.{m.group(1)}(`/{m.group(2)}`, {m.group(3)})"),
        ]
        
        for pattern, replacement in patterns:
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE | re.DOTALL)
        
        # Replace plain string URLs
        content = content.replace('http://localhost:5000/api/projects', '/projects')
        content = content.replace('http://localhost:5000/api', '')
        content = content.replace('http://localhost:5000', '')
        
        # Replace const baseURL or const url = "http://localhost..."
        content = re.sub(
            r'const\s+(baseURL|url)\s*=\s*["\']http://localhost:5000/api["\'];?',
            '',
            content
        )
        
        # Replace image URLs: src=`http://localhost:5000${...}`
        content = content.replace('`http://localhost:5000${', '`${API_BASE_URL}${')
        content = content.replace('`http://localhost:5000', '`${API_BASE_URL}')
        
        # Only write if changed
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Fixed: {filepath}")
            return True
        else:
            print(f"- No changes: {filepath}")
            return False
    except Exception as e:
        print(f"✗ Error in {filepath}: {e}")
        return False

# Run fixes
if __name__ == '__main__':
    fixed_count = 0
    for filepath in files_to_fix:
        if os.path.exists(filepath):
            if fix_file(filepath):
                fixed_count += 1
    
    print(f"\nTotal files fixed: {fixed_count}/{len(files_to_fix)}")
