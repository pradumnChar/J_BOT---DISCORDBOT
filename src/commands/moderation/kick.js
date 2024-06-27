const {
  
    ApplicationCommandOptionType,
    PermissionFlagsBits,
  } = require("discord.js");

  module.exports = {
    name: "kick",
    description: "kicks a member from this server",
    options: [
      {
        name: "target-user",
        description: "The target user to kick from this server",
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: "reason",
        description: "The reason for kick",
        type: ApplicationCommandOptionType.String,
      },
    ],
    //permissions for running the command of user
    //permissions for bot to run the command
    //1):User Permissions
  
    permissionsRequired: [PermissionFlagsBits.KickMembers],
    botPermissions: [PermissionFlagsBits.KickMembers],
    //access to bot interaction
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get("target-user").value; //return id
      const reason =
        interaction.options.get("reason")?.value || "No reason specified";
  
      //reply to bot
      await interaction.deferReply();
      const targetUser = await interaction.guild.members.fetch(targetUserId);
      if (!targetUser) {
        await interaction.editReply(
          "Yo..! This User does not exist in this server"
        );
  
        return;
      }
      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          "Watch Your behaviour! This is User is the phooking owner of this god damn server you cant Kick him"
        );
  
        return;
      }
      const targetUserRolePosition = targetUser.roles.highest.position;
      const requestUserRolePosition = interaction.member.roles.highest.position;
      const botRolePosition = interaction.guild.members.me.roles.highest.position;
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "targetUser is Superior role than you, you cannot kick this user"
        );
        return;
      }
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I can't kick this user because they have the same or highet level than me"
        );
        return;
      }
      //Ban the target user
      try {
        await targetUser.kick({ reason });
        await interaction.editReply(
          `User ${targetUser} kicked\nReason: ${reason}`
        );
      } catch (error) {
        console.log(error);
      }
    },
  };
  