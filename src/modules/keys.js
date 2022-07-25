export function generateRandomKey(length = 10) {
  let randomSelection = (array) =>
    array[Math.floor(Math.random() * array.length)];

  let chars = [
    "0123456789",
    "ABCDEFGHIJKLMNOPQRSTWXYZ",
    "abcdefghijklmnopqrstwxyz",
  ];

  let result = "";

  for (let i = 0; i < length; i++) {
    result += randomSelection(randomSelection(chars));
  }

  return result;
}
