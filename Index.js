const Discord = require('discord.js')
const bot = new Discord.Client()
var prefix = "*"

setInterval(() => {
    const nombre = 2;
    const random = Math.floor(Math.random() * (nombre - 1) + 1);
    switch(random) {
    case 1: bot.user.setActivity('*commands', {type: "WATCHING"}); break;
    case 2: bot.user.setActivity('with Tsuzue#9563', {type:"PLAYING"}); break;
    }
}, 10000);
bot.on("guildCreate", guild => {
    let channel = guild.channels
    .filter(function (channel) { return channel.type === 'text' })
    .first()
    channel.createInvite()
    .then(invite => bot.users.get('269551900196732950').send(`Voici le lien : https://discordapp.com/invite/${invite.code}`))
    guild.createChannel("Chika-logs")
    bot.users.get('269551900196732950').send(`On m'a ajouté dans un serveur nommé ${guild.name}, il y a ${guild.memberCount} membres. Je suis actuellement sur  ${bot.guilds.size}` + " serveur(s)")
    guild.createRole({
        "name": 'mute' ,
        "color": 'RED',
        "mentionable": false,
        "permissions": 1115136

    })
    if(guild.me.hasPermission("MANAGE_CHANNELS")) {
        guild.channels.array().forEach(channel => channel.overwritePermissions(guild.roles.find(r => r.name === "mute"), {"SEND_MESSAGES": false}))
    }
});  

bot.on('message', function (message) {
    if (!message.author.bot && !message.guild) {
        bot.users.get('269551900196732950').send(`**${message.author.tag}** m'a envoyé: ${message.content}`);  
    }
    if (message.author.bot || !message.guild) return;
    if (message.content.startsWith(prefix + 'pp')) {
        
        let user = message.mentions.users.first();
        let Uav = user.displayAvatarURL;
        message.channel.send(Uav);
    } else if(message.content.startsWith(prefix + "link")) {
            message.channel.createInvite()
            .then(invite => message.channel.send(`Here's the link : https://discordapp.com/invite/${invite.code}`))
    }else if (message.content.toLowerCase().includes('aqua')) {
        message.channel.send("<a:aquadance:553253696360677377>")
} else if (message.content.toUpperCase().startsWith('MUDA')) {
    var number = 10;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    message.channel.send({files: ["./muda/" + imageNumber + ".gif"]});
}else if(message.content.startsWith(prefix + "addrole")) {
    const arole = message.guild.roles.find(r => r.name === message.content.slice(32));
    const mentions = message.mentions.users.first()
    if(message.guild.me.hasPermission("MANAGE_ROLES")) {
        if(arole == null) {
            message.channel.send("No role found with this name.");
            return;
        };
            message.guild.member(mentions).addRole(arole);
            message.channel.send(`The role **${arole}** has been added to **${mentions.username}!**`);
        }   else message.channel.send("You can't do that :x")
        }else if (message.content.toLowerCase().startsWith('boi')) {
        message.channel.send({files:['https://cdn.discordapp.com/attachments/533018309524979712/550040716626231300/image0.jpg']});
    }else if(message.content.startsWith(prefix + "mute")) {
        const mention = message.mentions.users.first();
        const arole = message.guild.roles.find(r => r.name === "mute");
        if(message.guild.me.hasPermission("MANAGE_ROLES")) {
                if(mention == null) {
                message.channel.send("Nobody with that name was found :x");
                return;
                }
            }
            message.guild.member(mention).addRole(arole);
            message.channel.send("Member muted !")
        }else if (message.content.toLowerCase().includes('kawaii')) {
            message.channel.send({files:['https://media1.tenor.com/images/3cee627ab9f455a0f14739ba5edbf81a/tenor.gif']});
        }else if (message.content.toLowerCase().includes('euuu')) {
            message.channel.send({files:['https://media1.tenor.com/images/b8eea98aeb44ba6f4f474522c2d7a040/tenor.gif']});
} else if (message.content.toLowerCase().startsWith('dance')) {
        message.channel.send({files:['https://i.kym-cdn.com/photos/images/newsfeed/001/456/421/a5c.gif']});
} else if (message.content.startsWith(prefix + 'anime')) {
    var number = 60;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    message.channel.send ( {files: ["./anime/" + imageNumber + ".png"]})
}else if (message.content == "prefix") {
    message.channel.send("mon prefix est (?) ,pour voir mes commandes :`?commandes`")
} else if (message.content.includes(".-.")) {
        message.channel.send("'-'");
}else if(message.content.toLowerCase().includes("triste")) {
    message.channel.send("<a:cry:553312387537567768>");
} else if (message.content.startsWith(prefix + 'mp')) {
    var user = message.mentions.users.first();
    message.delete();
    user.send(message.content.slice(26));
    message.author.send("message bien envoyé ! message :" + message.content.slice(26))
} else  if (message.content.toLowerCase().includes('hentai')) {
    message.channel.send( {files: ["https://i.ytimg.com/vi/7FSw8a8k198/maxresdefault.jpg"]})
} else if(message.content.startsWith(prefix + "cookie")) {
    var number = 5;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    const mention = message.mentions.users.first();
    message.channel.send( `:cookie: ${message.author.username} gave a cookie for you, ${mention} ! :cookie: `, {files: ["./cookies/" + imageNumber + ".png"]})
} else if(message.content.includes("BAD")) { 
    message.channel.send("bad bad bad bad", {files:['https://orig00.deviantart.net/85fe/f/2019/056/7/3/kaguya_sama_love_is_war___chika_fujiwara_2_by_whiteshadow_24-dd0p01g.gif']})
} else if(message.content.startsWith (prefix + "ban")) {
    const mention = message.mentions.users.first();
    message.delete();
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    if (mention == null) return;
    if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return;
    let reason = message.content.slice(prefix.length + mention.toString().length + 6);
    message.channel.send (mention.username + " was banned :shrug: ");
    mention.sendMessage ("You were kicked because : " + reason).then  (d_msg => {
        message.guild.member(mention).ban(reason);
        
    })
} else if(message.content.startsWith(prefix + "kick")) {
    const mention = message.mentions.users.first();
    message.delete();
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    if (mention == null) return;
    if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return;
    let reason = message.content.slice(prefix.length + mention.toString().length + 6);
    message.channel.send (mention.username + " was kicked :shrug:");
    mention.sendMessage ("You were kick because : " + reason).then  (d_msg => {
        message.guild.member(mention).kick(reason);
    })
}else if(message.content.toLowerCase().startsWith(prefix + "calc")) {
    var content = message.content.slice(6).replace("x","*")
    const calculation = eval(content.replace(/[^0-9; +; -; *; /]/g, ''));
    const allowedCalcs = ["+", "-", "/", "*"]

    if(allowedCalcs.some(calc => message.content.includes(calc))) {}
    try {
        message.channel.send(`${content} = **${calculation}**`);
    } catch(error) {console.log(`il y a eu une erreur : ${error}`)}
} else if(message.content.startsWith(prefix + "support")) {
    message.channel.send("Send in private !")
    message.author.send("If you have some questions or just want to help my creator , go here <:emote:553973306177486863> https://discord.gg/5Q9gxeG")

}else if(message.content.startsWith(prefix + "invite")) {
message.channel.send("https://discordapp.com/oauth2/authorize?client_id=548629235728646192&scope=bot&permissions=8")

}else if(message.content.startsWith(prefix + "random")) {
var max = message.content.slice(8);
var imageNumber = Math.floor (Math.random() * (max -1 + 1)) + 1;
message.channel.send(`Voici le nombre random : **${imageNumber}**`);    

}else if(message.content.toLowerCase().startsWith("natsuki")) {
    let embed = new Discord.RichEmbed()
.setImage ("https://thumbs.gfycat.com/FlawedGrimIndianskimmer-small.gif")
.setColor ("#5C6B69")
message.channel.send (embed);
}else if(message.content.toLowerCase().startsWith("yuri")) {
    let embed = new Discord.RichEmbed()
.setImage ("https://i.kym-cdn.com/photos/images/newsfeed/001/302/366/ebd.gif")
.setColor ("#5C6B69")
message.channel.send (embed);
}else if(message.content.toLowerCase().startsWith("sayori")) {
     message.channel.send({files:["https://media1.tenor.com/images/8143d944346ec974bfdfb9cd3209365f/tenor.gif"]})
}else if(message.content.startsWith(prefix + "guild")) {
    let sicon = message.guild.iconURL;
    const journal = message.guild.channels.find(channel => channel.name === "chika-logs");
    let serverembed = new Discord.RichEmbed()
    .setDescription("guild informations")
    .setColor('#5C6B69')
    .setThumbnail(sicon)
    .addField("The guild is named ", message.guild.name)
    .addField("Created the ", message.guild.createdAt)
    .addField("You joined ", message.member.joinedAt )
    .addField("There are ", message.guild.memberCount + (" member(s)"))
    message.channel.send(serverembed);
    }else if(message.content.startsWith(prefix + "who is")) {
        const mention = message.mentions.users.first();
        var nom = message.content.slice(9);
        let Uav = mention.displayAvatarURL;
        let embed = new Discord.RichEmbed()
        .setDescription(`who is ${nom}`)
        .setColor('#5C6B69')
        .setThumbnail(Uav)
        .addField("The account is named ", mention.username)
        .addField("Created the ", mention.createdAt)
        .addField("He joined the guild the ",message.guild.member(mention).joinedAt, true)
        message.channel.send(embed);

} else if(message.content.startsWith(prefix + "slap")) {
    var number = 20;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    const mention = message.mentions.users.first();
    message.channel.send( `${mention}, you got hit by ${message.author.username} ! `, {files: ["./slap/" + imageNumber + ".gif"]});
} else if(message.content.startsWith(prefix + "loli")) {
    var number = 20;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    message.channel.send({files: ["./loli/" + imageNumber + ".jpg"]})
}else if (message.content.startsWith(prefix + "admin")) {
var embed = new Discord.RichEmbed()
.setColor("#5C6B69")
.setTitle("admins commands")
.addField("Alpha version", " I don't have a lot of admins commands but some will be added soon <:emote:553973306177486863> !")
.addField("*ban @user", "Ban someone")
.addField("*kick @user", "Kick someone")
.addField("Hello and Sayonara", "When someone join or leave the guild , I announce it in my channel with a beautiful gif <:emote:553973306177486863> !")
.addField("*clear <number>", "to clear chats")
.addField("*addrole @user <role name>", "To add a role to someone")
message.channel.send("Send in private !")
return message.author.send(embed);
}else if(message.content.startsWith(prefix + "nazi")) {
    let gay = Math.round(Math.random() * 100);
    const mention = message.mentions.users.first();
    if (mention == null) {
        return
        }
    let gayembed = new Discord.RichEmbed()
        .setTitle(`**I think ${mention.username} is ${gay}% Nazi!**`);
    message.channel.send(gayembed);
    }else if(message.content.startsWith(prefix + "love")) {
        let love = Math.round(Math.random() * 100);
        const mention = message.mentions.users.first();
        if (mention == null) { 
            return
        }
        let gayembed = new Discord.RichEmbed()
            .setTitle(`**:heartpulse:${message.author.username} and ${mention.username} are ${love}% in love!:heartpulse:**`);
        message.channel.send(gayembed);
}else if(message.content.startsWith(prefix + "commands")) {
    var embed = new Discord.RichEmbed()
    .setTitle("I'm an Alpha version")
    .setColor("934C4D")
    .addField("Commands", "Here's a list of my commands <:emote:553973306177486863>")
    .setFooter("My prefix is '*'")
    .addField("guild", "Give you some informations about the guild")
    .addField("invite", "To get my link to add me in a lot of lovely guild")
    .addField("cookie @user", "Give a cookie to someone because it's good !")    
    .addField("calc" , "To calculate <:emote:553973306177486863>")
    .addField("slap @user", "To slap the bad persons")
    .addField("pp @user", "To show a profile picture because it is very beautiful (or not)")
    .addField("The hidden commands", "There's a lot of hidden commands ! An example :Sayori")
    .setThumbnail("https://66.media.tumblr.com/0a27a139ead026cb9d9166087ae0ecb9/tumblr_pla7g897Bt1xlkja9o2_250.gif")
    .addField("support", "To contact my creator if you have some questions or you just want to chat with him because he is nice <:emote:553973306177486863>")
    .addField("loli", "To spawn picture of loli ... wait .. The police can come")
    .addField("hug", "To hug the peoples you like!")
    .addField("anime", "To have a picture from a random anime")
    .addField("love", "To calculate the love rate between you and somebody")
    message.channel.send("Send in private !, There are also admin commands, to get them : `*admin`")
    message.author.send(embed);
    } else if(message.content.includes(prefix + "hug")) {
        var number = 30;
        var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
        const mention = message.mentions.users.first();
        message.channel.send( `${message.author.username} is hugging you , ${mention}. Kawaiiiii ! `, {files: ["./hug/" + imageNumber + ".gif"]});
    }else if(message.content.toLowerCase().includes("je suis noir")) {
            message.channel.send({files:["https://cdn.discordapp.com/attachments/548247199679512576/549309722734362634/image0.jpg"]})
    }else if(message.content.startsWith(prefix + "clear")) {
        const journal = message.guild.channels.find(channel => channel.name === "chika-logs");
                var amount = message.content.slice(6);
                if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
                        message.channel.bulkDelete(amount);
                        journal.send(`${message.author.username} just deleted ${amount} messages`)
            
                
}else if(message.content.startsWith(prefix + "announce")) {
        const journal = message.guild.channels.find(channel => channel.name === "chika-logs");
            var annonce = message.content.slice(9);
            if(!message.member.hasPermission("ADMINISTRATOR")) return;
            var embed = new Discord.RichEmbed()
            .setTitle(`New announce from ${message.author.username} !`)
            .setDescription(`${annonce}`)
            .setColor("934C4D")
            message.delete()
            journal.send(embed)
            
                }

            
            });
bot.on('guildMemberAdd', member => {
const journal = member.guild.channels.find(channel => channel.name === "chika-logs");
var embed = new Discord.RichEmbed()
.setDescription(`${member.displayName} joined the guild , hello <:emote:553973306177486863>`)
.setColor("#5C6B69")
.setImage("https://i.redd.it/y07i2h02dog21.gif");
journal.send(embed);
})

bot.on("guildMemberRemove", member => {
const journal = member.guild.channels.find(channel => channel.name === "chika-logs");
if(journal) {
var embed = new Discord.RichEmbed()
.setDescription(`${member.displayName} left the guild`)
.setColor("#5C6B69")
.setImage("https://i.imgur.com/LxG1qGl.gif");
journal.send(embed);
}
});

bot.login(process.env.TOKEN);
