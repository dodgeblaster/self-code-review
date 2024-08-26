import { exec } from 'child_process';
import path from 'path';

async function getLineChanges(gitRepoPath) {
  try {
    // Get the current branch
    const currentBranch = await execPromise(`cd ${gitRepoPath} && git rev-parse --abbrev-ref HEAD`);

    // Get the last commit
    const lastCommit = await execPromise(`cd ${gitRepoPath} && git rev-parse HEAD~1`);

    // Get the diff between the current state and the last commit
    const diffOutput = await execPromise(`cd ${gitRepoPath} && git diff ${lastCommit} HEAD`);

    // Split the diff into added and changed lines
    const addedLines = diffOutput.split('\n').filter(line => line.startsWith('+') && !line.startsWith('+++'));
    const changedLines = diffOutput.split('\n').filter(line => line.startsWith('-') && !line.startsWith('---'));

    // Count the total lines added and changed
    const totalAddedLines = addedLines.length;
    const totalChangedLines = changedLines.length;

    // Return the result as a JSON object
    return {
      totalAddedLines,
      totalChangedLines,
      meetTarget: totalAddedLines + totalChangedLines <= 300 && totalAddedLines <= 150 && totalChangedLines <= 150
    };
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

// Usage example
const gitRepoPath = process.argv[2] || 'LOCATION HERE';
getLineChanges(gitRepoPath).then((result) => {
  if (result) {
    console.log(JSON.stringify(result, null, 2));
  }
});