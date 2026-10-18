import fs from 'node:fs';
import path from 'node:path';

export interface GoProjectData {
  isGo: boolean;
  moduleName?: string;
  framework?: string;
}

export function detectGoProject(cwd: string): GoProjectData {
  const modPath = path.join(cwd, 'go.mod');
  if (!fs.existsSync(modPath)) {
    return { isGo: false };
  }

  let moduleName: string | undefined;
  let framework: string | undefined;

  try {
    const content = fs.readFileSync(modPath, 'utf-8');
    const modMatch = content.match(/module\s+([^\s]+)/);
    if (modMatch) moduleName = modMatch[1];

    if (content.includes('gin-gonic/gin')) framework = 'Gin';
    else if (content.includes('gofiber/fiber')) framework = 'Fiber';
    else if (content.includes('labstack/echo')) framework = 'Echo';
    else if (content.includes('gorilla/mux')) framework = 'Gorilla Mux';
  } catch {}

  return {
    isGo: true,
    moduleName,
    framework
  };
}
