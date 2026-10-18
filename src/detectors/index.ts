import fs from 'node:fs';
import path from 'node:path';
import type { ProjectInfo, ProjectLanguage, PackageManager } from '../types.js';
import { detectGitInfo } from './git.js';
import { detectNodeProject } from './node.js';
import { detectPythonProject } from './python.js';
import { detectRustProject } from './rust.js';
import { detectGoProject } from './go.js';
import { detectEnvVars } from './env.js';
import { detectLicense } from './license.js';

export function detectProject(cwd: string = process.cwd()): ProjectInfo {
  const folderName = path.basename(path.resolve(cwd));
  const git = detectGitInfo(cwd);
  const node = detectNodeProject(cwd);
  const python = detectPythonProject(cwd);
  const rust = detectRustProject(cwd);
  const go = detectGoProject(cwd);
  const envVars = detectEnvVars(cwd);
  let license = detectLicense(cwd);

  // Check Docker
  const hasDocker = fs.existsSync(path.join(cwd, 'Dockerfile'));
  const hasDockerCompose =
    fs.existsSync(path.join(cwd, 'docker-compose.yml')) ||
    fs.existsSync(path.join(cwd, 'docker-compose.yaml')) ||
    fs.existsSync(path.join(cwd, 'compose.yaml')) ||
    fs.existsSync(path.join(cwd, 'compose.yml'));

  // Language & Framework resolution
  let language: ProjectLanguage = 'Other';
  let framework: string | undefined;
  let packageManager: PackageManager = 'unknown';
  let scripts: Record<string, string> = {};
  let dependencies: string[] = [];
  let testFramework: string | undefined;
  let name = folderName;
  let description = '';
  let version: string | undefined;
  let author: string | undefined;

  if (node.isNode) {
    language = fs.existsSync(path.join(cwd, 'tsconfig.json')) ? 'TypeScript' : 'JavaScript';
    framework = node.framework;
    packageManager = node.packageManager;
    scripts = node.scripts;
    dependencies = node.dependencies;
    testFramework = node.testFramework;
    if (node.name) name = node.name;
    if (node.description) description = node.description;
    if (node.version) version = node.version;
    if (node.author) author = node.author;
    if (!license && node.license) license = node.license;
  } else if (python.isPython) {
    language = 'Python';
    framework = python.framework;
    packageManager = python.packageManager;
    testFramework = python.testFramework;
  } else if (rust.isRust) {
    language = 'Rust';
    framework = rust.framework;
    packageManager = 'cargo';
    if (rust.name) name = rust.name;
    if (rust.description) description = rust.description;
    if (rust.version) version = rust.version;
  } else if (go.isGo) {
    language = 'Go';
    framework = go.framework;
    packageManager = 'go';
    if (go.moduleName) {
      name = path.basename(go.moduleName);
    }
  }

  // Format clean project title from kebab-case/snake_case
  return {
    name,
    description,
    version,
    author,
    license: license || 'MIT',
    language,
    framework,
    packageManager,
    scripts,
    dependencies,
    envVars,
    hasDocker,
    hasDockerCompose,
    testFramework,
    git
  };
}
