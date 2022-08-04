function generateRandomKey(length = 10) {
  const randomSelection = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const chars = [
    "0123456789",
    "ABCDEFGHIJKLMNOPQRSTWXYZ",
    "abcdefghijklmnopqrstwxyz",
  ];

  let result = [];

  for (let i = 0; i < length; i++) {
    result.push(randomSelection(randomSelection(chars)));
  }

  return result.join("");
}

export { generateRandomKey };
