import { execSync } from 'node:child_process';
import type { GitInfo } from '../types.js';

export function detectGitInfo(cwd: string = process.cwd()): GitInfo {
  try {
    // Check if inside a git repo
    execSync('git rev-parse --is-inside-work-tree', { cwd, stdio: 'ignore' });
  } catch {
    return { isGitRepo: false };
  }

  let remoteUrl: string | undefined;
  let owner: string | undefined;
  let repo: string | undefined;
  let defaultBranch: string | undefined = 'main';

  try {
    const rawRemote = execSync('git config --get remote.origin.url', { cwd, encoding: 'utf-8' }).trim();
    if (rawRemote) {
      remoteUrl = rawRemote;
      // Parse git@github.com:owner/repo.git or https://github.com/owner/repo.git
      const match = rawRemote.match(/github\.com[:/]([^/]+)\/([^/.]+)(?:\.git)?/);
      if (match) {
        owner = match[1];
        repo = match[2];
      }
    }
  } catch {
    // remote might not be set yet
  }

  try {
    const branch = execSync('git branch --show-current', { cwd, encoding: 'utf-8' }).trim();
    if (branch) {
      defaultBranch = branch;
    }
  } catch {
    // fallback default branch
  }

  return {
    isGitRepo: true,
    owner,
    repo,
    remoteUrl,
    defaultBranch
  };
}
