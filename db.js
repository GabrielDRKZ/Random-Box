const { getRandomElement, getManyRandomElement } = require("./utils");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

const rawBoxes = [
  {
    raridade: "comum",
    max: 10,
    min: 5,
    id: 0,
    name: "money",
  },
  {
    raridade: "natal",
    max: 20,
    min: 10,
    id: 0,
    name: "mana",
  },
  {
    raridade: "Ano Novo",
    max: 0,
    min: 0,
    id: 1,
    name: "vip",
  },
];

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Box {
  constructor(options) {
    this.raridade = options.raridade;
    this.max = options.max;
    this.min = options.min;
    this.id = options.id;
    this.name = options.name;
  }
    
  get money() {
    if (!this._value) {
      this._value = randomIntFromInterval(this.min, this.max);
    }

    return this._value;
  }
    
}

async function getRandomBoxes(userId, count = 1) {
  let money = 0;
  let mana = 0;
    
  const boxes = getManyRandomElement(rawBoxes, count).map(
    (box) => new Box(box)
  );

  for (let i = 0; i < boxes.length; i++) {
    money += boxes[i].money;
    mana += boxes[i].mana;
      
  }

  if (money > 0) {
    await db.add(`${userId}.money`, money);
  }

  if (mana > 0) {
    await db.add(`${userId}.mana`, mana);
  }
    
  return boxes;
}

async function getUserProfile(userId) {
  const user = await db.get(`${userId}`);
  return user
}

module.exports = {
  getRandomBoxes,
  getUserProfile,
};
