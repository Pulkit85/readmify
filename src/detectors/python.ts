import fs from 'node:fs';
import path from 'node:path';
import type { PackageManager } from '../types.js';

export interface PythonProjectData {
  isPython: boolean;
  name?: string;
  description?: string;
  framework?: string;
  packageManager: PackageManager;
  dependencies: string[];
  testFramework?: string;
}

const PYTHON_FRAMEWORKS: Record<string, string> = {
  fastapi: 'FastAPI',
  django: 'Django',
  flask: 'Flask',
  streamlit: 'Streamlit',
  torch: 'PyTorch',
  tensorflow: 'TensorFlow',
  langchain: 'LangChain',
  transformers: 'Hugging Face Transformers'
};

export function detectPythonProject(cwd: string): PythonProjectData {
  const reqPath = path.join(cwd, 'requirements.txt');
  const pyprojectPath = path.join(cwd, 'pyproject.toml');
  const pipfilePath = path.join(cwd, 'Pipfile');

  const hasReq = fs.existsSync(reqPath);
  const hasPyproject = fs.existsSync(pyprojectPath);
  const hasPipfile = fs.existsSync(pipfilePath);

  if (!hasReq && !hasPyproject && !hasPipfile) {
    return {
      isPython: false,
      packageManager: 'unknown',
      dependencies: []
    };
  }

  let pm: PackageManager = 'pip';
  if (hasPyproject) {
    try {
      const content = fs.readFileSync(pyprojectPath, 'utf-8');
      if (content.includes('[tool.poetry]')) {
        pm = 'poetry';
      }
    } catch {}
  } else if (hasPipfile) {
    pm = 'pip';
  }

  let depContent = '';
  if (hasReq) {
    try {
      depContent += fs.readFileSync(reqPath, 'utf-8').toLowerCase();
    } catch {}
  }
  if (hasPyproject) {
    try {
      depContent += ' ' + fs.readFileSync(pyprojectPath, 'utf-8').toLowerCase();
    } catch {}
  }

  let framework: string | undefined;
  for (const [key, label] of Object.entries(PYTHON_FRAMEWORKS)) {
    if (depContent.includes(key)) {
      framework = label;
      break;
    }
  }

  let testFramework: string | undefined;
  if (depContent.includes('pytest')) {
    testFramework = 'pytest';
  }

  return {
    isPython: true,
    framework,
    packageManager: pm,
    dependencies: [],
    testFramework
  };
}
