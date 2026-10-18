import fs from 'node:fs';
import path from 'node:path';

export function detectEnvVars(cwd: string): string[] {
  const possibleFiles = [
    '.env.example',
    '.env.sample',
    '.env.template',
    '.env.local.example',
    '.env.dist'
  ];

  const envVars = new Set<string>();

  for (const filename of possibleFiles) {
    const fullPath = path.join(cwd, filename);
    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex > 0) {
              const varName = trimmed.slice(0, eqIndex).trim();
              if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(varName)) {
                envVars.add(varName);
              }
            }
          }
        }
      } catch {}
    }
  }

  return Array.from(envVars);
}
