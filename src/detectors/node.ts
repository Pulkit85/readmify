import fs from 'node:fs';
import path from 'node:path';
import type { PackageManager } from '../types.js';

export interface NodeProjectData {
  isNode: boolean;
  name?: string;
  description?: string;
  version?: string;
  author?: string;
  license?: string;
  framework?: string;
  packageManager: PackageManager;
  scripts: Record<string, string>;
  dependencies: string[];
  testFramework?: string;
}

const FRAMEWORK_MAP: Record<string, string> = {
  next: 'Next.js',
  nuxt: 'Nuxt',
  astro: 'Astro',
  remix: 'Remix',
  '@sveltejs/kit': 'SvelteKit',
  svelte: 'Svelte',
  vue: 'Vue.js',
  react: 'React',
  '@angular/core': 'Angular',
  express: 'Express',
  fastify: 'Fastify',
  '@nestjs/core': 'NestJS',
  koa: 'Koa',
  hono: 'Hono',
  electron: 'Electron',
  '@tauri-apps/api': 'Tauri',
  tailwindcss: 'Tailwind CSS',
  vite: 'Vite'
};

const TEST_FRAMEWORKS: Record<string, string> = {
  vitest: 'Vitest',
  jest: 'Jest',
  mocha: 'Mocha',
  playwright: 'Playwright',
  '@playwright/test': 'Playwright',
  cypress: 'Cypress'
};

export function detectNodeProject(cwd: string): NodeProjectData {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return {
      isNode: false,
      packageManager: 'unknown',
      scripts: {},
      dependencies: []
    };
  }

  let pkg: any = {};
  try {
    const raw = fs.readFileSync(pkgPath, 'utf-8');
    pkg = JSON.parse(raw);
  } catch {
    // Malformed JSON
  }

  // Detect Package Manager
  let pm: PackageManager = 'npm';
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
    pm = 'pnpm';
  } else if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
    pm = 'yarn';
  } else if (fs.existsSync(path.join(cwd, 'bun.lockb')) || fs.existsSync(path.join(cwd, 'bun.lock'))) {
    pm = 'bun';
  }

  const allDeps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {})
  };
  const depNames = Object.keys(allDeps);

  // Detect Framework
  let detectedFramework: string | undefined;
  for (const [pkgName, label] of Object.entries(FRAMEWORK_MAP)) {
    if (depNames.includes(pkgName)) {
      detectedFramework = label;
      break;
    }
  }

  // Detect Test Framework
  let detectedTest: string | undefined;
  for (const [pkgName, label] of Object.entries(TEST_FRAMEWORKS)) {
    if (depNames.includes(pkgName)) {
      detectedTest = label;
      break;
    }
  }

  return {
    isNode: true,
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    author: typeof pkg.author === 'string' ? pkg.author : pkg.author?.name,
    license: pkg.license,
    framework: detectedFramework,
    packageManager: pm,
    scripts: pkg.scripts || {},
    dependencies: depNames,
    testFramework: detectedTest
  };
}
