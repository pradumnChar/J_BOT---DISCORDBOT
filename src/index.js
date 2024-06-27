require("dotenv").config();
//adding otenv environment variable for
//we use client class from discordjs in order to interact with bot
const { Client, IntentsBitField} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const mongoose = require("mongoose");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try{
    mongoose.set('strictQuery', false);
  await mongoose.connect(process.env.mongo_url);
  console.log("Connected to DB");
  eventHandler(client);
  client.login(process.env.discord_bot_token);

} catch(err) {
  console.error(err);
}})();















//intents is used to specify what bot will do how to react recive message for exmaple
//client is the bot
//specify intent to yr bot how will it recive things
//references prop of client clss ie is login
//to login bot
// client.on("ready", () => {
//   console.log("Bot Has Logged In", `${client.user.username}`);
//   client.user.setActivity({
//     name: "IM ON!!!!",
//     type: ActivityType.Streaming,
//     url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//   })
// });

//to create interaction ie event that going to triiger when slash commands is on

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;
//   if (interaction.commandName === "hey") {
//     interaction.reply("hey....");
//   }
//   if (interaction.commandName === "add") {
//     num1 = interaction.options.get("first-number").value;
//     num2 = interaction.options.get("second-number").value;
//     interaction.reply(num1 + num2);
//   }
//   if (interaction.commandName === "embed") {
//     const embed = new EmbedBuilder()
//       .setTitle("Embed title")
//       .setDescription("Embed description")
//       .setColor("DarkPurple")
//       .setImage('https://i.imgur.com/AfFp7pu.png')
//       .setTimestamp();
//     interaction.reply({ embeds: [embed] });
//   }
// try {
//   if(!interaction.isButton()) return;
//   await interaction.deferReply({ ephemeral: true });


// const role = interaction.guild.roles.cache.get(interaction.customId);
// if(!role){
//   interaction.editReply({
//     content: "Couldn't find role",
//   })
//   return;
// }
// const hasRole= interaction.member.roles.cache.has(role.id);
// if(hasRole){
//   await interaction.member.roles.remove(role);
//   await interaction.editReply(`the role ${role} was removed`);
//   return;
// }
// await interaction.member.roles.add(role);
// await interaction.editReply(`the role ${role} has been added`);

// } catch (error) {
//   console.error(error);
// }
// });
// //response from bottt
// client.on("messageCreate", (message) => {
//   console.log(`[${message.author.tag}]: ${message.content}`);
//   if (message.author.bot) {
//     return;
//   }
//   if (message.content === "Hello") {
//     message.reply("Hey, This is J_BOT!");
//   }
//   if(message.content === "embed")
//     {
//         const embed = new EmbedBuilder()
//         .setTitle("Embed title")
//         .setDescription("Embed description")
//         .setColor('DarkGold')
//         .setImage('https://i.imgur.com/AfFp7pu.png')
//         .setTimestamp();
    

// message.channel.send({ embeds: [embed] });
//     }
// });