import type { ProjectInfo, ReadmeOptions } from '../types.js';
import { generateBadges } from '../generators/badges.js';

export function renderShowcaseTemplate(info: ProjectInfo, options: ReadmeOptions): string {
  const badges = options.includeBadges ? generateBadges(info) : [];
  const badgeSection = badges.length > 0 ? `<p align="center">\n  ${badges.join('\n  ')}\n</p>\n` : '';

  const title = options.title || info.name;
  const tagline = options.tagline || (info.description ? info.description : 'Next-generation developer tool.');

  const features = options.features.length > 0 ? options.features : [
    '⚡ **Real-Time Execution**: Instant feedback with zero waiting.',
    '🎯 **Precision Focused**: Built specifically to eliminate cognitive friction.',
    '🧩 **Extensible**: Seamlessly integrates into your existing workflows and pipelines.'
  ];

  return `<div align="center">

# ${title}

### *${tagline}*

${badgeSection}

[![Demo](https://via.placeholder.com/800x400.png?text=Interactive+Product+Demo+or+Screenshot)](#)

[Explore Documentation](#) • [Report Bug](https://github.com/issues) • [Request Feature](https://github.com/issues)

</div>

---

## 🌟 Highlights

${features.map(f => `### ${f}`).join('\n\n')}

## 🏗️ Architecture

\`\`\`mermaid
flowchart LR
    A[Input / Trigger] --> B[Core Engine]
    B --> C[(State / Storage)]
    B --> D[Output / UI]
\`\`\`

## 🚀 Getting Started

\`\`\`bash
# 1. Install
npm install ${info.name.toLowerCase()}

# 2. Run
npx ${info.name.toLowerCase()}
\`\`\`

## 🗺️ Roadmap

- [x] Initial release & core architecture
- [ ] Plugin ecosystem support
- [ ] Cloud synchronization & dashboard
- [ ] Enterprise SSO & RBAC

## 📄 License

This project is licensed under the ${info.license || 'MIT'} License - see the [LICENSE](LICENSE) file for details.
`;
}
