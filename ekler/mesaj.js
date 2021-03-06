const ayarlar = require('../ayarlar.json');
const db = require('quick.db')
var renk = "ORANGE"

module.exports = async message => {
  var prefix = db.get(`sunucular.${message.guild.id}.prefix`)
  if(!prefix) prefix = "g!"
  if(!message.guild) return false;
  let client = message.client;
  if (message.author.bot) return;
  let command;
  let params;
  let perms = client.elevation(message);
    
  var etiketpref = new RegExp(`^<@!?${client.user.id}>`);
  var test = String(message.content.match(etiketpref))
  var u;
  if(message.content.startsWith(test)) {
    command = message.content.split(' ')[1]
    params = message.content.split(' ').slice(2);
    u = "çalış"
  } else {
    if(message.content.startsWith(prefix)) {
    command = message.content.split(' ')[0].slice(prefix.length);
    params = message.content.split(' ').slice(1);
    u = "çalış"
  }}
  if(u !== "çalış") return;
  
  const dil = (require('./dil.js')(message, command, prefix))
  var karaliste = db.get(`karaliste.${message.author.id}`)
  if(karaliste === "aktif") return false;
  
  var ck = db.get(`sunucular.${message.guild.id}.kanallar.${message.channel.id}.calismakanal`)
  if(ck === "aktif") return;
  
  console.log(`${message.author.tag} adlı kullanıcı ${command} adlı kodu kullandı`)
  
  const DBL = require("dblapi.js");
  const dbl = new DBL(ayarlar.dbltoken, client);
  
  let cmd;
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
  }
  if (cmd) {
    if (cmd.conf.permLevel > perms) {
      if(cmd.conf.permLevel === 1) return message.channel.send(dil.yazılar.yetki.mesajy)
      if(cmd.conf.permLevel === 2) return message.channel.send(dil.yazılar.yetki.atma)
      if(cmd.conf.permLevel === 3) return message.channel.send(dil.yazılar.yetki.yasaklama)
      if(cmd.conf.permLevel === 4) return message.channel.send(dil.yazılar.yetki.syonet)
      if(cmd.conf.permLevel === 5) return message.channel.send(dil.yazılar.yetki.yonetici)
    } else return cmd.run(client, message, params, dil, renk, dbl, perms);
  }

}