const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function estimateCrackTime(password) {
  const charsetSizes = {
    lowercase: 26,
    uppercase: 26,
    digits: 10,
    symbols: 32, // Approximate number of common symbols
  };

  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += charsetSizes.lowercase;
  if (/[A-Z]/.test(password)) charsetSize += charsetSizes.uppercase;
  if (/[0-9]/.test(password)) charsetSize += charsetSizes.digits;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += charsetSizes.symbols;

  const combinations = BigInt(Math.pow(charsetSize, password.length));
  const guessesPerSecond = BigInt(1e9); // 1 billion guesses per second (modern GPU attack estimate)
  const secondsToCrack = combinations / guessesPerSecond;

  function formatTime(seconds) {
    if (seconds < 1) return "Less than a second";
    const units = [
      ["year", 60n * 60n * 24n * 365n],
      ["day", 60n * 60n * 24n],
      ["hour", 60n * 60n],
      ["minute", 60n],
      ["second", 1n],
    ];
    
    for (let [unit, value] of units) {
      if (seconds >= value) {
        let time = Number(seconds / value);
        const magnitudes = ["", " thousand", " million", " billion", " trillion", " quadrillion", " quintillion"];
        let magnitudeIndex = 0;
        while (time >= 1000 && magnitudeIndex < magnitudes.length - 1) {
          time /= 1000;
          magnitudeIndex++;
        }
        return `${time.toFixed(3)} ${magnitudes[magnitudeIndex]} ${unit}${time > 1 ? "s" : ""}`;
      }
    }
  }

  return formatTime(secondsToCrack);
}

rl.question("Enter a password: ", (password) => {
  const crackTime = estimateCrackTime(password);
  console.log(`🔒 Your password would take approximately: ${crackTime} to crack.`);
  console.log("💡 Tip: Use a mix of uppercase, lowercase, numbers, and symbols for better security!");
  //rl.close();
});

