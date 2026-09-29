const { execSync } = require('child_process');

const git = 'C:\\Users\\n2257\\git\\cmd\\git.exe';
function run(cmd) {
  console.log('Running:', cmd);
  const out = execSync(`"${git}" ${cmd}`, { stdio: 'pipe' });
  console.log(out.toString());
}

try {
  run('init -b main');
  run('config user.name "Prajavaani Developer"');
  run('config user.email "dev@prajavaani.local"');
  run('add .');
  run('status --short');
  run('commit -m "Initial commit: PRAJAVAANI PRO full-stack civic platform with 13 Indian languages, Sovereign Ashoka Crest, and AI Sahayak"');
  run('log -1 --oneline');
} catch (err) {
  console.error('Error:', err.message);
  if (err.stdout) console.log('Stdout:', err.stdout.toString());
  if (err.stderr) console.error('Stderr:', err.stderr.toString());
}
