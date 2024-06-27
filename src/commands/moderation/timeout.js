//timeout server, user
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
//ms to conv into human readble form
module.exports = {
  name: "timeout",
  description: "Timeout a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Duration of Timeout",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "Reason of Timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],

  //permissionsreq
  permissionRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("result")?.value || "No reason provided";

    await interaction.deferReply();
    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("This user doesnt exist in the server");
      return;
    }
    if (targetUser.user.bot) {
      await interaction.editReply("I cant timeout a bot Sir!!!!");
      return;
    }
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Provide a valid timeout duration");
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration cannot be less than 5 seconds or more than 28 days"
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;
    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "targetUser is Superior role than you, you cannot timeout this user"
      );
      return;
    }
    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I can't timeout this user because they have the same or highet level than me"
      );
      return;
    }
    //timeout the target user
    try {
      //conv ms into human readable
      const { default: pretty } = await import("pretty-ms"); //pretty does not support coommn js directly
      //to check if user is already timeout
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);

        await interaction.editReply(
          `User ${targetUser} timeout has been updated : ${pretty(msDuration, {
            verbose: true,
          })}}`
        );
        return;
      }
      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `${targetUser} was timed out : ${pretty(msDuration, {
          verbose: true,
        })}.\nReason: ${reason}`
      );
    } catch (error) {
      console.log(error);
    }
  },
};
