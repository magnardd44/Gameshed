import express from 'express';
import childProcess from 'child_process';

/**
 * Express router containing task methods.
 */
const router = express.Router();

router.post('/run', (req, res) => {
  let stdout = '';
  let stderr = '';
  const docker = childProcess.spawn('docker', [
    'run',
    '--rm',
    'node:latest',
    'node',
    '-e',
    `${req.body.source}`,
  ]);
  docker.stdout.on('data', (data: string) => {
    stdout += data;
  });
  docker.stderr.on('data', (data: string) => {
    stderr += data;
  });
  docker.on('exit', (exitStatus: number) => {
    res.send({ exitStatus: exitStatus, stdout: stdout, stderr: stderr });
  });
});

export default router;
