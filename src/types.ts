export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'pip' | 'poetry' | 'cargo' | 'go' | 'unknown';

export type ProjectLanguage =
  | 'TypeScript'
  | 'JavaScript'
  | 'Python'
  | 'Rust'
  | 'Go'
  | 'Java'
  | 'C++'
  | 'PHP'
  | 'Ruby'
  | 'Other';

export interface GitInfo {
  isGitRepo: boolean;
  owner?: string;
  repo?: string;
  remoteUrl?: string;
  defaultBranch?: string;
}

export interface ProjectInfo {
  name: string;
  description: string;
  version?: string;
  author?: string;
  license?: string;
  language: ProjectLanguage;
  framework?: string;
  packageManager: PackageManager;
  scripts: Record<string, string>;
  dependencies: string[];
  envVars: string[];
  hasDocker: boolean;
  hasDockerCompose: boolean;
  testFramework?: string;
  git: GitInfo;
}

export type TemplateStyle = 'modern' | 'minimal' | 'showcase';

export interface ReadmeOptions {
  title: string;
  tagline: string;
  description: string;
  template: TemplateStyle;
  includeBadges: boolean;
  includeInstall: boolean;
  includeEnv: boolean;
  includeScripts: boolean;
  includeFeatures: boolean;
  includeContributing: boolean;
  includeLicense: boolean;
  features: string[];
  outputPath: string;
  force: boolean;
  dryRun: boolean;
}
