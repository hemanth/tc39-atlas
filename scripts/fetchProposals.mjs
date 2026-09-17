import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetPath = path.join(__dirname, '../proposals.json');
const TC39_DATASET_URL = 'https://tc39.es/dataset/proposals.json';

async function fetchProposals() {
  console.log(`Fetching latest TC39 proposals from ${TC39_DATASET_URL}...`);
  const response = await fetch(TC39_DATASET_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch proposals: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Fetched data is not a valid JSON array');
  }

  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully fetched and updated proposals.json (${data.length} proposals).`);
}

fetchProposals().catch((err) => {
  console.error('Error fetching proposals:', err);
  process.exit(1);
});
