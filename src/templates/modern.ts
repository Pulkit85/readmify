import type { ProjectInfo, ReadmeOptions } from '../types.js';
import { generateBadges } from '../generators/badges.js';

export function renderModernTemplate(info: ProjectInfo, options: ReadmeOptions): string {
  const badges = options.includeBadges ? generateBadges(info) : [];
  const badgeSection = badges.length > 0 ? `<p align="center">\n  ${badges.join('\n  ')}\n</p>\n` : '';

  // Title & Tagline
  const title = options.title || info.name;
  const tagline = options.tagline || (info.description ? info.description : 'A modern, high-performance software project.');

  // Installation commands based on package manager
  let installCmd = 'npm install';
  let devCmd = 'npm run dev';
  let buildCmd = 'npm run build';
  let testCmd = 'npm test';

  if (info.packageManager === 'pnpm') {
    installCmd = 'pnpm install';
    devCmd = 'pnpm dev';
    buildCmd = 'pnpm build';
    testCmd = 'pnpm test';
  } else if (info.packageManager === 'bun') {
    installCmd = 'bun install';
    devCmd = 'bun dev';
    buildCmd = 'bun build';
    testCmd = 'bun test';
  } else if (info.packageManager === 'yarn') {
    installCmd = 'yarn install';
    devCmd = 'yarn dev';
    buildCmd = 'yarn build';
    testCmd = 'yarn test';
  } else if (info.packageManager === 'poetry') {
    installCmd = 'poetry install';
    devCmd = 'poetry run python main.py';
    testCmd = 'poetry run pytest';
  } else if (info.packageManager === 'pip') {
    installCmd = 'pip install -r requirements.txt';
    devCmd = 'python main.py';
    testCmd = 'pytest';
  } else if (info.packageManager === 'cargo') {
    installCmd = 'cargo build';
    devCmd = 'cargo run';
    testCmd = 'cargo test';
    buildCmd = 'cargo build --release';
  } else if (info.packageManager === 'go') {
    installCmd = 'go mod download';
    devCmd = 'go run main.go';
    testCmd = 'go test ./...';
    buildCmd = 'go build -o app';
  }

  // Features list
  const defaultFeatures = [
    '⚡ **Blazing Fast**: Optimized for speed and minimal resource usage.',
    '🛠️ **Zero Configuration**: Ready to run right out of the box.',
    '🔒 **Type Safe & Reliable**: Built with robust architecture and modern standards.',
    '🎨 **Developer Friendly**: Intuitive workflow with helpful error messages and logs.'
  ];
  const features = options.features.length > 0 ? options.features : defaultFeatures;

  // Environment variables section
  let envSection = '';
  if (options.includeEnv && info.envVars.length > 0) {
    const rows = info.envVars.map(v => `| \`${v}\` | Configuration value for \`${v.toLowerCase()}\` | \`required\` |`).join('\n');
    envSection = `
## ⚙️ Environment Variables

Create a \`.env\` file in the root directory and configure the following variables:

| Variable | Description | Status |
| :--- | :--- | :--- |
${rows}
`;
  }

  // Scripts section
  let scriptsSection = '';
  if (options.includeScripts && Object.keys(info.scripts).length > 0) {
    const scriptRows = Object.entries(info.scripts)
      .slice(0, 8)
      .map(([cmd, script]) => `| \`${cmd}\` | \`${script}\` |`)
      .join('\n');

    scriptsSection = `
## 📜 Available Scripts

| Script | Command |
| :--- | :--- |
${scriptRows}
`;
  }

  // Docker section
  let dockerSection = '';
  if (info.hasDockerCompose) {
    dockerSection = `
## 🐳 Docker Setup

Run the application inside Docker containers using Docker Compose:

\`\`\`bash
docker compose up -d
\`\`\`
`;
  } else if (info.hasDocker) {
    dockerSection = `
## 🐳 Docker Setup

Build and run using Docker:

\`\`\`bash
docker build -t ${info.name.toLowerCase()} .
docker run -p 3000:3000 ${info.name.toLowerCase()}
\`\`\`
`;
  }

  const gitCloneUrl = info.git.remoteUrl || `https://github.com/username/${info.name.toLowerCase()}.git`;

  return `<div align="center">

# ${title}

<p align="center">
  <strong>${tagline}</strong>
</p>

${badgeSection}

<!-- Optional Hero Demo / GIF -->
<!-- <img src="./assets/demo.gif" alt="${title} Demo" width="100%"> -->

</div>

<hr />

## ✨ Features

${features.map(f => `- ${f}`).join('\n')}

## 🚀 Quick Start

### 1. Clone the repository

\`\`\`bash
git clone ${gitCloneUrl}
cd ${info.name.toLowerCase()}
\`\`\`

### 2. Install dependencies

\`\`\`bash
${installCmd}
\`\`\`

### 3. Start development server

\`\`\`bash
${devCmd}
\`\`\`
${envSection}${scriptsSection}${dockerSection}
## 🧪 Running Tests

\`\`\`bash
${testCmd}
\`\`\`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'feat: Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📝 License

Distributed under the **${info.license || 'MIT'}** License. See \`LICENSE\` for more information.

<div align="center">

---
⭐ **If you like this project, please give it a star on GitHub!** ⭐

</div>
`;
}
