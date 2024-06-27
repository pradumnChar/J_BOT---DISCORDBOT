
module.exports = {
    name: 'ping',
    description: 'Replies with the bot ping!',
  
    callback: async (client, interaction) => {
      await interaction.deferReply();
  
      const reply = await interaction.fetchReply();
  
      const ping = reply.createdTimestamp - interaction.createdTimestamp;
  
      interaction.editReply(
        `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`
      );
    },
  };
  // //exporting a obj 
// module.exports={
//     name: 'ping',
//     description: "Replies with bot ping!",
//     callback: async(client, interaction) =>{
//         //SENDING A INITIAL DEFER REPLY FOR OUr BOT TO RESPONSE
//         await interaction.deferReply();
//         //timestamp of defer reply
//         const reply = await interaction.fetchReply();
//         //reply has info about reply
//         const ping = reply.createdTimeStamp - interaction.createdTimeStamp;
//         //sending back the ping
//         interaction.editReply(`Client ${ping}ms ! Websocket: ${client.ws.ping}ms`);
//     }
// }