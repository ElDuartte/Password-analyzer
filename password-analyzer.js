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

  // If password is empty, return immediately
  if (charsetSize === 0 || password.length === 0) {
    return "Instantly (invalid or empty password)";
  }

  const combinations = BigInt(Math.pow(charsetSize, password.length));
  const guessesPerSecond = BigInt(1e9); // 1 billion guesses per second (modern GPU attack estimate)
  const secondsToCrack = combinations / guessesPerSecond;

  // return formatTime(secondsToCrack);
  return String(secondsToCrack).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}

// Improved formatTime function for even better readability
function formatTime(seconds) {
  const units = [
    ["second", 1],
    ["minute", 60],
    ["hour", 3600],
    ["day", 86400],
    ["year", 31536000],
  ];

  // Ensure `seconds` is a Number (if it’s a BigInt)
  if (typeof seconds === "bigint") {
    seconds = Number(seconds); // Convert BigInt to Number (only safe for smaller values)
  }

  let unit = "second";
  let value = seconds;

  // Find the largest unit
  for (let [name, threshold] of units) {
    if (seconds >= threshold) {
      unit = name;
      value = seconds / threshold;
    } else {
      break;
    }
  }

  const magnitudes = ["", "Thousand", "Million", "Billion", "Trillion", "Quadrillion", "Quintillion"];
  let magnitudeIndex = 0;

  while (value >= 1000 && magnitudeIndex < magnitudes.length - 1) {
    value /= 1000;
    magnitudeIndex++;
  }

  // Round to 2 significant digits
  if (value >= 1e6) {
    value = value.toExponential(2); // Use scientific notation for extremely large numbers
  } else {
    value = parseFloat(value.toFixed(1)); // Otherwise, keep it simple
  }

  return `${value} ${magnitudes[magnitudeIndex]} ${unit}${value > 1 ? "s" : ""}`;
}

// Ask for password input
rl.question("Enter a password: ", (password) => {
  const crackTime = estimateCrackTime(password);
  console.log("---------------------------------------");
  console.log(crackTime)
  console.log("---------------------------------------");
  console.log(`🔒 Your password would take approximately: ${crackTime} to crack.`);
  console.log("💡 Tip: Use a mix of uppercase, lowercase, numbers, and symbols for better security!");
  rl.close();
});
