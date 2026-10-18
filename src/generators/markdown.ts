import type { ProjectInfo, ReadmeOptions } from '../types.js';
import { renderModernTemplate } from '../templates/modern.js';
import { renderMinimalTemplate } from '../templates/minimal.js';
import { renderShowcaseTemplate } from '../templates/showcase.js';

export function generateReadme(info: ProjectInfo, options: ReadmeOptions): string {
  switch (options.template) {
    case 'minimal':
      return renderMinimalTemplate(info, options);
    case 'showcase':
      return renderShowcaseTemplate(info, options);
    case 'modern':
    default:
      return renderModernTemplate(info, options);
  }
}
