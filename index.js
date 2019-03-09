const Discord = require('discord.js')
const bot = new Discord.Client()
var prefix = "*"

setInterval(() => {
    const nombre = 6;
    const random = Math.floor(Math.random() * (nombre - 1) + 1);
    switch(random) {
    case 1: bot.user.setActivity('*commandes', {type: "WATCHING"}); break;
    case 2: bot.user.setActivity('taunt Monika', {type:"PLAYING"}); break;
    case 3: bot.user.setActivity("des jeux de sociétés", {type:"PLAYING"}); break;
    }
}, 10000);
bot.on("guildCreate", guild => {
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
    const journal = message.guild.channels.find(channel => channel.name === "chika-logs");
    if (message.author.bot || !message.guild) return;
    if (message.content.startsWith(prefix + 'pdp')) {
        
        let user = message.mentions.users.first();
        let Uav = user.displayAvatarURL;
        message.channel.send(Uav);
    } else if(message.content.startsWith(prefix + "lien")) {
            message.channel.createInvite()
            .then(invite => message.channel.send(`Voici le lien : https://discordapp.com/invite/${invite.code}`))
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
            message.channel.send("Aucun role trouvé avec ce nom");
            return;
        };
            message.guild.member(mentions).addRole(arole);
            message.channel.send(`Le role **${arole}** a bien été ajouté a **${mentions.username}!**`);
        }   else message.channel.send("Tu n'as pas la permission de faire ça")
        }else if (message.content.toLowerCase().startsWith('boi')) {
        message.channel.send({files:['https://cdn.discordapp.com/attachments/533018309524979712/550040716626231300/image0.jpg']});
    }else if(message.content.startsWith(prefix + "mute")) {
        const mention = message.mentions.users.first();
        const arole = message.guild.roles.find(r => r.name === "mute");
        if(message.guild.me.hasPermission("MANAGE_ROLES")) {
            guild.channels.array().forEach(channel => channel.overwritePermissions(guild.roles.find(r => r.name === "mute"), {"SEND_MESSAGES": false}))
                if(mention == null) {
                message.channel.send("Aucune personne trouvée ");
                return;
                }
            }
            message.guild.member(mention).addRole(arole);
            message.channel.send("Membre bien mute !")
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
} else  if (message.content.toLowerCase().includes('hehe boi')) {
    message.channel.send( {files: ["./random/heheboi.gif"]})
} else if (message.content === 'Marie sur Brawlhalla') {
    message.channel.send("La fameuse ...", {files:["https://media.giphy.com/media/12DLBuhDtQCBIk/giphy.gif"]})
} else  if (message.content.toUpperCase() === 'C PO NICE') {
    message.channel.send("c'est toi qui est po nice !")    
} else if(message.content.startsWith(prefix + "cookie")) {
    var number = 5;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    const mention = message.mentions.users.first();
    message.channel.send( `:cookie: ${message.author.username} a donné un cookie pour toi, ${mention} ! :cookie: `, {files: ["./cookies/" + imageNumber + ".png"]})
} else if(message.content.toUpperCase().includes("NUL")) { 
    message.channel.send("NUL NUL NUL NUL NUL", {files:['https://thumbs.gfycat.com/FarJitteryAustraliansilkyterrier-max-1mb.gif']})
} else if(message.content.startsWith (prefix + "ban")) {
    const mention = message.mentions.users.first();
    message.delete();
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    if (mention == null) return;
    if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return;
    let reason = message.content.slice(prefix.length + mention.toString().length + 6);
    message.channel.send (mention.username + " a été ban :shrug: ");
    mention.sendMessage ("t'as été ban de mon serveur parce que " + reason + ":shrug:").then  (d_msg => {
        message.guild.member(mention).ban(reason);
        
    })
} else if(message.content.startsWith(prefix + "kick")) {
    const mention = message.mentions.users.first();
    message.delete();
    if (message.member.hasPermission("ADMINISTRATOR")) return;
    if (mention == null) return;
    if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return;
    let reason = message.content.slice(prefix.length + mention.toString().length + 6);
    message.channel.send (mention.username + " a été kick :shrug:");
    mention.sendMessage ("t'as été kick de mon serveur parce que " + reason + ":shrug:").then  (d_msg => {
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
    message.channel.send("envoyé en MP !")
    message.author.send("Si tu as des questions a posé sur moi , va dans ce serveur ou tu pourras trouver mon créateur et lui demander directement https://discord.gg/5Q9gxeG")

}else if(message.content.startsWith(prefix + "invite")) {
message.channel.send("https://discordapp.com/oauth2/authorize?client_id=548540080097067012&scope=bot&permissions=8")

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
     message.channel.send({files:["https://media1.tenor.com/images/8143d944346ec974bfdfb9cd3209365f/tenor.gif?itemid=10458435"]})
}else if(message.content.startsWith(prefix + "serveur")) {
    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("information sur le serveur")
    .setColor('#5C6B69')
    .setThumbnail(sicon)
    .addField("Le serveur s'appelle ", message.guild.name)
    .addField("Crée le ", message.guild.createdAt)
    .addField("Tu as rejoint le ", message.member.joinedAt )
    .addField("Il y a ", message.guild.memberCount + (" membre(s)"))
    message.channel.send(serverembed);
    }else if(message.content.startsWith(prefix + "qui est")) {
        const mention = message.mentions.users.first();
        var nom = message.content.slice(9);
        let Uav = mention.displayAvatarURL;
        let embed = new Discord.RichEmbed()
        .setDescription(`information sur ${nom}`)
        .setColor('#5C6B69')
        .setThumbnail(Uav)
        .addField("Le compte s'appelle ", mention.username)
        .addField("Compte crée le ", mention.createdAt)
        .addField("Il a rejoint le ",message.guild.member(mention).joinedAt, true)
        message.channel.send(embed);

} else if(message.content.startsWith(prefix + "slap")) {
    var number = 20;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    const mention = message.mentions.users.first();
    message.channel.send( `${mention}, tu te fais taper par ${message.author.username} ! `, {files: ["./slap/" + imageNumber + ".gif"]});
} else if(message.content.startsWith(prefix + "loli")) {
    var number = 20;
    var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
    const mention = message.mentions.users.first();
    message.channel.send({files: ["./loli/" + imageNumber + ".jpg"]})
}else if (message.content.startsWith(prefix + "admin")) {
var embed = new Discord.RichEmbed()
.setColor("#5C6B69")
.setTitle("commandes admins")
.addField("Version Alpha", "Je n'ai pas beaucoup de commandes admins mais j'en aurais d'avantages dans le futur <:emote:553973306177486863> !")
.addField("*ban @user", "Permet de ban un membre du discord")
.addField("*kick @user", "Permet de kick un membre du discord")
.addField("Bienvenue et aurevoir", "quand quelqu'un rentre ou part du serveur, un message sera envoyé dans le salon que je crée!")
.addField("*clear <montant a supprimer>", "pour supprimer un montant de message définit")
.addField("*addrole @user <nom du role>", "pour ajouter un role a un utilisateur")
message.channel.send("Envoyées en mp !")
return message.author.send(embed);
}else if(!journal) {
    message.guild.createChannel("chika-logs");
    message.channel.send("Vous n'aviez pas de channel Chika-logs alors j'en ai crée un <:lewd:553983393742848041> ");
}else if(message.content.startsWith(prefix + "nazi")) {
    let gay = Math.round(Math.random() * 100);
    const mention = message.mentions.users.first();
    if (mention == null) {
        return
        }
    let gayembed = new Discord.RichEmbed()
        .setTitle(`**Je pense que ${mention.username} est ${gay}% Nazi!**`);
    message.channel.send(gayembed);
    }else if(message.content.startsWith(prefix + "love")) {
        let love = Math.round(Math.random() * 100);
        const mention = message.mentions.users.first();
        if (mention == null) { 
            return
        }
        let gayembed = new Discord.RichEmbed()
            .setTitle(`**:heartpulse:${message.author.username} et ${mention.username} sont a ${love}% d'amour!:heartpulse:**`);
        message.channel.send(gayembed);
}else if(message.content.startsWith(prefix + "commandes")) {
    var embed = new Discord.RichEmbed()
    .setTitle("Je suis en version Alpha")
    .setColor("934C4D")
    .setDescription("Mon créateur vient juste de me commencer donc il reste encore pleins de choses a faire que j'apprendrais dans le futur :smile:")
    .addField("Commandes", "Voici une liste de mes commandes")
    .setFooter("Mon prefix est '*'")
    .addField("serveur", "Donne des informations sur le seveur")
    .addField("invite", "Pour avoir mon lien d'invitation pour m'ajouter sur pleins de beaux serveurs :smile:")
    .addField("cookie @user", "Donne un cookie a la personne désignée parce que c'est toujours bien de donner des cookies")    
    .addField("calc" , "Je peux calculer tout ce que vous voulez temps que ça reste linéaire :smile:")
    .addField("slap @user", "Pour frapper les méchants")
    .addField("*pdp @user", "pour admirer sa magnifique photo de profil ou celle de quelqu'un d'autre")
    .addField("Les commandes cachées", "il y a pleins d'autres commandes cachées qui ne necessitent pas le prefix :smile: a toi de les trouver !Un exemple :Sayori")
    .setThumbnail("https://66.media.tumblr.com/0a27a139ead026cb9d9166087ae0ecb9/tumblr_pla7g897Bt1xlkja9o2_250.gif")
    .addField("*support", "Pour contacter mon créateur si tu as des questions a propos de moi")
    .addField("*loli", "Commande pour faire apparaitre pleins de Lolis ... attention la police pourrait arriver...")
    .addField("*hug", "Pour faire des câlins aux gens/bots(les bots aussi ont le droit d'avoir des câlins!) Que tu aimes!")
    message.channel.send("envoyées en mp !, il existe des commandes pour administrateur , pour les avoir : `*admin`")
    message.author.send(embed);
    } else if(message.content.includes(prefix + "hug")) {
        var number = 30;
        var imageNumber = Math.floor (Math.random() * (number -1 + 1)) + 1;
        const mention = message.mentions.users.first();
        message.channel.send( `${message.author.username} te fait un calin , ${mention}. Kawaiiiii ! `, {files: ["./hug/" + imageNumber + ".gif"]});
    }else if(message.content.toLowerCase().includes("je suis noir")) {
            message.channel.send({files:["https://cdn.discordapp.com/attachments/548247199679512576/549309722734362634/image0.jpg"]})
    }else if(message.content.startsWith(prefix + "clear")) {
        const journal = message.guild.channels.find(channel => channel.name === "chika-logs");
                var amount = message.content.slice(6);
                if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
                        message.channel.bulkDelete(amount);
                        journal.send(`${message.author.username} vient de supprimer ${amount} messages`)
                
}else if(message.content.startsWith(prefix + "annonce")) {
        const journal = message.guild.channels.find(channel => channel.name === "chika-logs");
            var annonce = message.content.slice(8);
            if(!message.member.hasPermission("ADMINISTRATOR")) return;
            var embed = new Discord.RichEmbed()
            .setTitle(`nouvelle annonce de ${message.author.username} !`)
            .setDescription(`${annonce}`)
            .setColor("934C4D")
            message.delete()
            journal.send(embed)
            
                }
            
            
                
    
            
            });
bot.on('guildMemberAdd', member => {
const journal = member.guild.channels.find(channel => channel.name === "chika-logs");
var embed = new Discord.RichEmbed()
.setDescription(`${member.displayName} vient d'arriver dans le serveur , bienvenue <:emote:553973306177486863>`)
.setColor("#5C6B69")
.setImage("https://i.redd.it/y07i2h02dog21.gif");
journal.send(embed);
})

bot.on("guildMemberRemove", member => {
const journal = member.guild.channels.find(channel => channel.name === "chika-logs");
if(journal) {
var embed = new Discord.RichEmbed()
.setDescription(`${member.displayName} vient de quitter le serveur `)
.setColor("#5C6B69")
.setImage("https://i.imgur.com/LxG1qGl.gif");
journal.send(embed);
}
});

bot.login('NTQ4NjI5MjM1NzI4NjQ2MTky.D2Vs2g.AbvqiFXsIOlsnkFageJmBvx9nGM');