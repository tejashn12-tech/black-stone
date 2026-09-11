const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('/.aistudio/artifacts/brain/a93222c5-daa2-49d9-99ae-07d8de06e932/.system_generated/logs/transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lastUserMsg = '';
  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      // check if user message containing "Monthly Total Collection"
      const text = JSON.stringify(obj);
      if (text.includes('Monthly Total Collection')) {
        lastUserMsg = text;
      }
    } catch (e) {}
  }
  
  fs.writeFileSync('extracted_user_turn.json', lastUserMsg, 'utf8');
  console.log("Extracted turn length:", lastUserMsg.length);
}

processLineByLine();
