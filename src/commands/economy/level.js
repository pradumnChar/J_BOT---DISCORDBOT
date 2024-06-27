const {
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/Level.js");
const { Font, RankCardBuilder } = require("canvacord");
const LevelXp = require("../../utils/LevelXp");
module.exports = {
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("This Command Runs Inside A Server Only");
      return;
    }
    await interaction.deferReply();
    const mentionUserId = await interaction.options.get("target-user")?.value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);
    const fetchUserLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });
    if (!fetchUserLevel) {
      interaction.editReply(
        mentionUserId
          ? `${targetUserObj.user.tag} doesnt have any level yet. Try again..!.`
          : "You dont have level yet, try increasing level by chatting"
      );
      return;
    }
    let levels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId levelxp"
    );
    levels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });
    let currentRank =
      levels.findIndex((level) => level.userId === targetUserId) + 1;

    const card = new RankCardBuilder()
      .setDisplayName(targetUserObj.user.username) // Big name
      .setUsername(`@${targetUserObj.user.username}`) // small name, do not include it if you want to hide it
      .setAvatar(targetUserObj.user.displayAvatarURL({size: 256})) // user avatar
      .setCurrentXP(fetchUserLevel.xp) // current xp
      .setRequiredXP(100000) // required xp
      .setLevel(fetchUserLevel.level) // user level
      .setRank(currentRank) // user rank
      .setOverlay(90) // overlay percentage. Overlay is a semi-transparent layer on top of the background
      .setStatus(targetUserObj.presence.status) // user status. Omit this if you want to hide it
      .setBackground("#FFC300")
      .setStyles({
        progressbar: {
             thumb: {
                  style: {
                       backgroundColor: "#FFC300",
                  },
             },
        },
   })
  
    Font.loadDefault();
    const data = await card.build({
      format: "png",
    });
    //creates the box type embed
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },
  name: "level",
  description: "Shows your/someone level",
  options: [
    {
      name: "target-user",
      description: "the target user to display",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
