const { Client, GatewayIntentBits } = require("discord.js");
const { getUserProfile, getRandomBoxes } = require("./db");

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const { getArgsByMessage } = require("./utils");

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = process.env.PREFIX ?? "!";

const client = new Client({
  // Intents para receber as mensagens do bots.
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

if (!DISCORD_TOKEN) {
  console.log("Token não encontrado!");
  process.exit(1);
}

if (!PREFIX) {
  console.log("Prefix não encontrado!");
  process.exit(1);
}

client.on("ready", () => console.info(`${client.user.tag} está online!`));

client.on("messageCreate", async (message) => {
  // Ignora mensagens de bots.
  if (message.author.bot) return;
  // Ignora mensagens que não começam com o prefixo.
  if (!message.content.startsWith(PREFIX)) return;

  const { command, args } = getArgsByMessage(message, PREFIX);

  if (command === "caixa") {
    const count = parseInt(args[0] ?? 1);

    if (Number.isNaN(count)) {
      message.channel.send("Quantidade inválida! Use um número inteiro.");
      return;
    }

    const boxes = await getRandomBoxes(message.author.id, count);
    const boxesNames = boxes.map((box, index) => `**${index + 1} ›** \`${box.money.toLocaleString()} ${box.name}\` ( **Raridade ›** \`${box.raridade}\` )`);
      
    const boxCountMessage = `**${message.author.tag}** você abriu ${boxes.length} caixas!`;

    message.channel.send(`${boxCountMessage}\n\n${boxesNames.join("\n")}`);
  }

  if (command === "ping") {
    message.channel.send("Pong!");
  }

  if (command === "reset") {
      await db.set(`${message.author.id}.money`, 0);
      await db.set(`${message.author.id}.mana`, 0);
    message.channel.send("Resetado");
  }
    
  if (command === "profile") {
    const profile = await getUserProfile(message.author.id);
    if (!profile) {
      message.channel.send(`${message.author} você ainda não tem perfil!`);
    } else {
      message.channel.send(`${message.author} você tem ${profile.money} money e ${profile.mana} mana!`);
    }
  }
});

(async () => {
  console.log("[+] Starting...");
  await client.login(DISCORD_TOKEN);
})();
