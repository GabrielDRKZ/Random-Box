
function getArgsByMessage(message, prefix) {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  return { args, command };
}


function getRandomElement(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function getManyRandomElement(arr, count = 1) {
  const items = [];

  for (let i = 0; i < count; i++) {
    items.push(getRandomElement(arr));
  }

  return items;
}

module.exports = {
  getArgsByMessage,
  getRandomElement,
  getManyRandomElement,
};
