const {  PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {

  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply('Auto role has not been configured for this server.');
        return;
      }

      await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply('Auto role has been disabled for this server. ');
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-disable',
  description: 'Disable auto-role in this server.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
};