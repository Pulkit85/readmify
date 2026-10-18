import type { ProjectInfo } from '../types.js';

interface BadgeConfig {
  style?: 'for-the-badge' | 'flat-square' | 'flat';
}

const LANGUAGE_BADGES: Record<string, { label: string; color: string; logo: string; logoColor: string }> = {
  TypeScript: { label: 'TypeScript', color: '3178C6', logo: 'typescript', logoColor: 'white' },
  JavaScript: { label: 'JavaScript', color: 'F7DF1E', logo: 'javascript', logoColor: 'black' },
  Python: { label: 'Python', color: '3776AB', logo: 'python', logoColor: 'white' },
  Rust: { label: 'Rust', color: '000000', logo: 'rust', logoColor: 'white' },
  Go: { label: 'Go', color: '00ADD8', logo: 'go', logoColor: 'white' }
};

const FRAMEWORK_BADGES: Record<string, { label: string; color: string; logo: string; logoColor: string }> = {
  'Next.js': { label: 'Next.js', color: '000000', logo: 'nextdotjs', logoColor: 'white' },
  'React': { label: 'React', color: '20232A', logo: 'react', logoColor: '61DAFB' },
  'Vue.js': { label: 'Vue.js', color: '35495E', logo: 'vuedotjs', logoColor: '4FC08D' },
  'Svelte': { label: 'Svelte', color: '4A4A55', logo: 'svelte', logoColor: 'FF3E00' },
  'Express': { label: 'Express.js', color: '404D59', logo: 'express', logoColor: 'white' },
  'FastAPI': { label: 'FastAPI', color: '005571', logo: 'fastapi', logoColor: 'white' },
  'Tailwind CSS': { label: 'TailwindCSS', color: '38B2AC', logo: 'tailwind-css', logoColor: 'white' }
};

export function generateBadges(info: ProjectInfo, config: BadgeConfig = { style: 'for-the-badge' }): string[] {
  const badges: string[] = [];
  const style = config.style || 'for-the-badge';

  // 1. Language badge
  if (info.language && LANGUAGE_BADGES[info.language]) {
    const b = LANGUAGE_BADGES[info.language];
    badges.push(`![${b.label}](https://img.shields.io/badge/${encodeURIComponent(b.label)}-${b.color}?style=${style}&logo=${b.logo}&logoColor=${b.logoColor})`);
  }

  // 2. Framework badge
  if (info.framework && FRAMEWORK_BADGES[info.framework]) {
    const f = FRAMEWORK_BADGES[info.framework];
    badges.push(`![${f.label}](https://img.shields.io/badge/${encodeURIComponent(f.label)}-${f.color}?style=${style}&logo=${f.logo}&logoColor=${f.logoColor})`);
  }

  // 3. License badge
  if (info.license) {
    badges.push(`![License](https://img.shields.io/badge/license-${encodeURIComponent(info.license)}-blue?style=${style})`);
  }

  // 4. GitHub stars / issues / forks if git repo exists
  if (info.git.owner && info.git.repo) {
    const { owner, repo } = info.git;
    badges.push(`[![Stars](https://img.shields.io/github/stars/${owner}/${repo}?style=${style}&logo=github)](https://github.com/owner/${repo}/stargazers)`.replace('owner', owner));
    badges.push(`[![Issues](https://img.shields.io/github/issues/${owner}/${repo}?style=${style}&logo=github)](https://github.com/owner/${repo}/issues)`.replace('owner', owner));
  }

  // 5. PRs welcome
  badges.push(`![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=${style})`);

  return badges;
}
