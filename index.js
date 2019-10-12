const Discord = require('discord.js')
const client = new Discord.Client()
const morsify = require('morsify');
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


client.login("NjI5NjA5Mzk2NzgzMDIyMDkw.XaIzRA.NWj3qmCXFUPTnWoGj0xIyuo14NI");
