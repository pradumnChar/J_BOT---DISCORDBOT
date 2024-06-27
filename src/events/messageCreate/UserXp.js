// L E V E L I N G     S Y S T E M



const Level = require("../../models/Level");
const LevelXp = require("../../utils/LevelXp");
const cooldown = new Set();
//cooldown is used to stop increaing xp in case user start spamming message
//Set = unqiue id of author
//we set cooldown of 30 sec after user sends a a message and hes xp increase once
function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = async (client, message) => {
  if (!message.inGuild() || message.author.bot || cooldown.has(message.author.id)) return;
  const xpgive = getRandomXp(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };
  try {
    const level = await Level.findOne(query);
    //findone check whether exits or not
    if (level) {
      level.xp += xpgive;
      if (level.xp > LevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;
        message.channel.send(`${message.member} you have level up to ++ ${level.level}**.`);
      }
    //changing in db
    await level.save().catch((e) =>{
        console.log(e.message)
        return;
    })
    cooldown.add(message.author.id);
    setInterval(()=>{
cooldown.delete(message.author.id);
    },30000);
    }
    //levelv not exist in db
    else{
        const newLevel = new Level({
            userId: message.author.id,
            guildId: message.guild.id,
            xp: xpgive
        });
  
    await  newLevel.save();
    cooldown.add(message.author.id);
    setInterval(()=>{
cooldown.delete(message.author.id);
    },30000);
}
  } catch (error) {
    console.error(error);
  }

};
