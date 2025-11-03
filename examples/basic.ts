import ZeroTrue from '../src';

async function main() {
  // Initialize client
  const client = new ZeroTrue({
    apiKey: process.env.ZEROTRUE_API_KEY!,
  });

  try {
    // Create a check
    console.log('Creating check...');
    const check = await client.checks.create({
      input: {
        type: 'text',
        value: 'This is a sample text to check for AI generation.',
      },
    });

    console.log('Check created:', check.id);
    console.log('Status:', check.status);

    // Wait for result
    console.log('\nWaiting for result...');
    const result = await client.checks.wait(check.id);

    console.log('\nResult:');
    console.log('- Status:', result.status);
    console.log('- AI Probability:', result.ai_probability + '%');
    console.log('- Human Probability:', result.human_probability + '%');
    console.log('- Result Type:', result.result_type);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
