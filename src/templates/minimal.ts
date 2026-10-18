import type { ProjectInfo, ReadmeOptions } from '../types.js';

export function renderMinimalTemplate(info: ProjectInfo, options: ReadmeOptions): string {
  const title = options.title || info.name;
  const tagline = options.tagline || info.description || 'Lightweight utility.';

  let installCmd = 'npm install';
  let devCmd = 'npm run dev';

  if (info.packageManager === 'pnpm') {
    installCmd = 'pnpm install';
    devCmd = 'pnpm dev';
  } else if (info.packageManager === 'bun') {
    installCmd = 'bun install';
    devCmd = 'bun dev';
  } else if (info.packageManager === 'poetry') {
    installCmd = 'poetry install';
    devCmd = 'poetry run python main.py';
  } else if (info.packageManager === 'pip') {
    installCmd = 'pip install -r requirements.txt';
    devCmd = 'python main.py';
  } else if (info.packageManager === 'cargo') {
    installCmd = 'cargo build';
    devCmd = 'cargo run';
  } else if (info.packageManager === 'go') {
    installCmd = 'go mod download';
    devCmd = 'go run main.go';
  }

  const features = options.features.length > 0 ? options.features : [
    'Fast & zero-dependency footprint',
    'Simple, predictable configuration',
    'Ready for production workloads'
  ];

  return `# ${title}

> ${tagline}

## Installation

\`\`\`bash
${installCmd}
\`\`\`

## Usage

\`\`\`bash
${devCmd}
\`\`\`

## Key Features

${features.map(f => `- ${f}`).join('\n')}

## License

${info.license || 'MIT'}
`;
}
