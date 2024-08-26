import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';

export async function listFiles(dir) {
  try {
    const files = await fs.promises.readdir(dir, { withFileTypes: true });
    const result = [];

    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        result.push({
          type: 'directory',
          name: file.name,
          path: filePath,
          children: await listFiles(filePath)
        });
      } else {
        result.push({
          type: 'file',
          name: file.name,
          path: filePath
        });
      }
    }

    return result;
  } catch (err) {
    console.error(`Error reading directory: ${dir}`, err);
    return [];
  }
}


export async function openTextFileInDefaultEditor(filePath) {
  try {
    const platform = os.platform();
    let command;

    if (platform === 'darwin') {
      // Mac OS
      command = `open "${filePath}"`;
    } else if (platform === 'linux') {
      // Linux
      command = `xdg-open "${filePath}"`;
    } else {
      console.error('Unsupported operating system:', platform);
      return;
    }

    await exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error opening file:', error);
      } else {
        console.log('File opened successfully.');
      }
    });
  } catch (error) {
    console.error('Error opening file:', error);
  }
}