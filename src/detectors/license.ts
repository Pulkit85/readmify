import fs from 'node:fs';
import path from 'node:path';

export function detectLicense(cwd: string): string | undefined {
  const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license', 'license.md'];

  for (const name of licenseFiles) {
    const fullPath = path.join(cwd, name);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        if (content.includes('MIT License') || content.includes('Permission is hereby granted, free of charge')) {
          return 'MIT';
        }
        if (content.includes('Apache License') && content.includes('Version 2.0')) {
          return 'Apache-2.0';
        }
        if (content.includes('GNU GENERAL PUBLIC LICENSE')) {
          if (content.includes('Version 3')) return 'GPL-3.0';
          return 'GPL';
        }
        if (content.includes('BSD 3-Clause')) {
          return 'BSD-3-Clause';
        }
        if (content.includes('Mozilla Public License')) {
          return 'MPL-2.0';
        }
        return 'Custom';
      } catch {}
    }
  }

  return undefined;
}
