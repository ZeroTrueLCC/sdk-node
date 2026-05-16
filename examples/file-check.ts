import ZeroTrue from '../src';
import * as fs from 'fs';

async function main() {
  const client = new ZeroTrue({
    apiKey: 'zt_your_api_key_here',
  });

  try {
    // Example 1: Check file by path
    console.log('Example 1: Check file by path');
    const check1 = await client.checks.createFromFile('./examples/test-image.png', {
      isPrivateScan: true,
      isDeepScan: false,
    });
    console.log('Check created:', check1.id);

    // Example 2: Check file from Buffer
    console.log('\nExample 2: Check file from Buffer');
    const buffer = fs.readFileSync('./examples/test-image.png');
    const check2 = await client.checks.createFromBuffer(buffer, 'test-image.png');
    console.log('Check created:', check2.id);

    // Example 3: Check file from Stream
    console.log('\nExample 3: Check file from Stream');
    const stream = fs.createReadStream('./examples/test-image.png');
    const check3 = await client.checks.createFromStream(stream, 'test-image.png');
    console.log('Check created:', check3.id);

    // Wait for first check result
    console.log('\nWaiting for result...');
    const result = await client.checks.wait(check1.id);

    console.log('\nResult:');
    console.log('- AI Probability:', result.ai_probability + '%');
    console.log('- File:', result.original_filename);
    console.log('- Size:', result.size_mb + ' MB');
    console.log('- Resolution:', result.resolution);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
