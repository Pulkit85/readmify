import fs from 'node:fs';
import path from 'node:path';

export interface RustProjectData {
  isRust: boolean;
  name?: string;
  description?: string;
  version?: string;
  framework?: string;
}

export function detectRustProject(cwd: string): RustProjectData {
  const cargoPath = path.join(cwd, 'Cargo.toml');
  if (!fs.existsSync(cargoPath)) {
    return { isRust: false };
  }

  let name: string | undefined;
  let version: string | undefined;
  let description: string | undefined;
  let framework: string | undefined;

  try {
    const content = fs.readFileSync(cargoPath, 'utf-8');
    const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
    if (nameMatch) name = nameMatch[1];

    const versionMatch = content.match(/version\s*=\s*"([^"]+)"/);
    if (versionMatch) version = versionMatch[1];

    const descMatch = content.match(/description\s*=\s*"([^"]+)"/);
    if (descMatch) description = descMatch[1];

    if (content.includes('actix-web')) framework = 'Actix Web';
    else if (content.includes('axum')) framework = 'Axum';
    else if (content.includes('rocket')) framework = 'Rocket';
    else if (content.includes('tokio')) framework = 'Tokio';
    else if (content.includes('tauri')) framework = 'Tauri';
  } catch {}

  return {
    isRust: true,
    name,
    version,
    description,
    framework
  };
}
