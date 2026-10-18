#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { Command } from 'commander';
import pc from 'picocolors';
import boxen from 'boxen';
import ora from 'ora';
import prompts from 'prompts';

import { detectProject } from './detectors/index.js';
import { generateReadme } from './generators/markdown.js';
import type { ReadmeOptions, TemplateStyle } from './types.js';

const program = new Command();

program
  .name('readmify')
  .description('⚡ Generate breathtaking, production-grade GitHub READMEs in seconds.')
  .version('1.0.0')
  .option('-y, --yes', 'Skip prompts and generate README using auto-detected defaults')
  .option('-t, --template <type>', 'Choose template style (modern, minimal, showcase)', 'modern')
  .option('-o, --output <path>', 'Output file path', 'README.md')
  .option('--force', 'Overwrite existing README without creating a backup')
  .option('--dry-run', 'Print generated markdown to console instead of writing to disk')
  .action(async (cliOptions) => {
    console.log(
      boxen(
        `${pc.bold(pc.cyan('⚡ READMIFY'))}\n${pc.gray('Turn any codebase into a stunning GitHub README in seconds.')}`,
        {
          padding: 1,
          margin: { top: 1, bottom: 1 },
          borderStyle: 'round',
          borderColor: 'cyan'
        }
      )
    );

    const spinner = ora(pc.blue('Scanning codebase & detecting environment...')).start();

    const cwd = process.cwd();
    const info = detectProject(cwd);

    spinner.succeed(
      pc.green(
        `Detected: ${pc.bold(info.language)} ${info.framework ? `(${info.framework})` : ''} • Package Manager: ${pc.bold(info.packageManager)}`
      )
    );

    let template: TemplateStyle = (cliOptions.template as TemplateStyle) || 'modern';
    let title = info.name;
    let tagline = info.description || 'A modern high-performance application.';
    let includeBadges = true;
    let customFeatures: string[] = [];

    // Interactive Mode
    if (!cliOptions.yes && !cliOptions.dryRun) {
      const response = await prompts([
        {
          type: 'text',
          name: 'title',
          message: 'Project Title:',
          initial: title
        },
        {
          type: 'text',
          name: 'tagline',
          message: 'Project Tagline / Catchphrase:',
          initial: tagline
        },
        {
          type: 'select',
          name: 'template',
          message: 'Choose a README Template Style:',
          choices: [
            { title: '🌟 Modern (Hero banner, Shields.io badges, feature grid, quickstart)', value: 'modern' },
            { title: '🖼️  Showcase (Visual layout, architecture diagram, roadmap)', value: 'showcase' },
            { title: '⚡ Minimal (Crisp, zero-fluff developer documentation)', value: 'minimal' }
          ],
          initial: 0
        },
        {
          type: 'confirm',
          name: 'includeBadges',
          message: 'Include official brand badges (Shields.io)?',
          initial: true
        },
        {
          type: 'list',
          name: 'features',
          message: 'Key features (comma-separated, or leave empty for auto-defaults):',
          separator: ','
        }
      ]);

      if (response.title !== undefined) title = response.title.trim() || title;
      if (response.tagline !== undefined) tagline = response.tagline.trim() || tagline;
      if (response.template) template = response.template;
      if (response.includeBadges !== undefined) includeBadges = response.includeBadges;
      if (response.features && response.features.length > 0) {
        customFeatures = response.features.filter((f: string) => f.trim().length > 0);
      }
    }

    const options: ReadmeOptions = {
      title,
      tagline,
      description: tagline,
      template,
      includeBadges,
      includeInstall: true,
      includeEnv: true,
      includeScripts: true,
      includeFeatures: true,
      includeContributing: true,
      includeLicense: true,
      features: customFeatures,
      outputPath: cliOptions.output,
      force: !!cliOptions.force,
      dryRun: !!cliOptions.dryRun
    };

    const markdown = generateReadme(info, options);

    if (cliOptions.dryRun) {
      console.log('\n' + pc.bold(pc.yellow('--- DRY RUN: GENERATED README PREVIEW ---')) + '\n');
      console.log(markdown);
      return;
    }

    const targetFile = path.resolve(cwd, options.outputPath);

    if (fs.existsSync(targetFile) && !options.force) {
      if (!cliOptions.yes) {
        const overwritePrompt = await prompts({
          type: 'select',
          name: 'action',
          message: `${pc.yellow(options.outputPath)} already exists. What would you like to do?`,
          choices: [
            { title: '📦 Backup existing to README.old.md and replace', value: 'backup' },
            { title: '⚠️  Overwrite directly', value: 'overwrite' },
            { title: '💾 Save as README.readmify.md instead', value: 'save_new' },
            { title: '❌ Cancel', value: 'cancel' }
          ],
          initial: 0
        });

        if (overwritePrompt.action === 'backup') {
          const backupPath = path.resolve(cwd, 'README.old.md');
          fs.copyFileSync(targetFile, backupPath);
          console.log(pc.gray(`Existing file backed up to ${pc.bold('README.old.md')}`));
        } else if (overwritePrompt.action === 'save_new') {
          const newPath = path.resolve(cwd, 'README.readmify.md');
          fs.writeFileSync(newPath, markdown, 'utf-8');
          console.log(
            boxen(
              `${pc.green('✔ README generated successfully!')}\nSaved to: ${pc.bold(pc.cyan('README.readmify.md'))}`,
              { padding: 1, borderColor: 'green', borderStyle: 'round' }
            )
          );
          return;
        } else if (overwritePrompt.action === 'cancel' || !overwritePrompt.action) {
          console.log(pc.red('Operation cancelled.'));
          return;
        }
      } else {
        // In --yes mode with existing file and without --force, backup automatically
        const backupPath = path.resolve(cwd, 'README.old.md');
        fs.copyFileSync(targetFile, backupPath);
      }
    }

    fs.writeFileSync(targetFile, markdown, 'utf-8');

    console.log(
      boxen(
        `${pc.green('✔ README created successfully!')}\n` +
          `File: ${pc.bold(pc.cyan(options.outputPath))}\n` +
          `Template: ${pc.magenta(template)}\n\n` +
          `${pc.dim('Pro tip: Push your repo to GitHub and watch your stars grow! ⭐')}`,
        {
          padding: 1,
          borderColor: 'green',
          borderStyle: 'round',
          margin: { top: 1, bottom: 1 }
        }
      )
    );
  });

program.parse(process.argv);
