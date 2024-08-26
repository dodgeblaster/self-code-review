


import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

const gitRepoPath = 'LOCATION HERE';

// Set the path to the repository you want to get information about
const repoPath = path.join(gitRepoPath);

// Function to get the repository information
export async function getRepoInfo() {
  try {
    // Get the repository name
    const repoName = path.basename(repoPath);

    // Get the current branch
    const branchOutput = await execCommand(`cd ${repoPath} && git rev-parse --abbrev-ref HEAD`);
    const branch = branchOutput.trim();

    // Get the last commit hash
    const commitOutput = await execCommand(`cd ${repoPath} && git rev-parse HEAD`);
    const commit = commitOutput.trim();

    // Get the last commit message
    const messageOutput = await execCommand(`cd ${repoPath} && git log -1 --pretty=%B`);
    const message = messageOutput.trim();

    // Get the number of commits
    const countOutput = await execCommand(`cd ${repoPath} && git rev-list --count HEAD`);
    const commitCount = parseInt(countOutput.trim());

    // Get the Git diff between the current state and the last commit
    const diffOutput = await execCommand(`cd ${repoPath} && git diff HEAD~1 HEAD`);
    const diffFiles = await parseDiffOutput(diffOutput);

    // Format the information as a JSON object
    return {
      name: repoName,
      branch,
      commit,
      message,
      commitCount,
      diff: diffFiles
    };
  } catch (error) {
    console.error('Error getting repository information:', error);
    return null;
  }
}

// Helper function to execute a command and return the output
async function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Helper function to parse the Git diff output
async function parseDiffOutput(diffOutput) {
  const files = diffOutput.trim().split('diff --git');
  const diffFiles = await Promise.all(files.map(async (file) => {
    if (!file.trim()) {
      return null;
    }

    const lines = file.trim().split('\n');
    const [, filePath] = lines[0].split(' ');
    const originalContent = await getOriginalFileContent(filePath);
    const updatedContent = fs.readFileSync(path.join(repoPath, filePath.substring(2)), 'utf8');

    let status = '';
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('---')) {
        status = 'deleted';
      } else if (line.startsWith('+++')) {
        status = 'added';
      } else if (line.startsWith('@@ ')) {
        status = 'modified';
      }
    }

    return {
      path: filePath.substring(2),
      status,
      original: originalContent || '',
      updated: updatedContent
    };
  }));

  return diffFiles.filter(Boolean);
}

// Helper function to get the original file content
async function getOriginalFileContent(filePath) {
  try {
    return await execCommand(`cd ${repoPath} && git show HEAD~1:${filePath.substring(2)}`);
  } catch (error) {
    return null;
  }
}

// // Call the getRepoInfo function and log the result
// getRepoInfo().then((repoInfo) => {
//   if (repoInfo) {
//     console.log(JSON.stringify(repoInfo, null, 2));
//   }
// });