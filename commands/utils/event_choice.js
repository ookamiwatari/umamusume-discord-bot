const Discord = require('discord.js');
const cmd = require('discord.js-commando');
const Pagination = require('discord-paginationembed');
const eventData = eventDatas;

module.exports = class EventChoice extends cmd.Command {
	constructor(client) {
		super(client, {
			name: 'event_choice',
			aliases: ['e', 'c', 'event', 'choice'],
			group: 'utils',
			memberName: 'event_choice',
			description: "イベント選択肢",
			examples: ['!event_choice ハルウララ かっくいいね！'],
			args: [
				{
					key: 'character',
					prompt: 'キャラクター名を入力してください。',
					type: 'string'
				},
				{
					key: 'event_title',
					prompt: 'イベント名を入力してください。',
					type: 'string',
					default: ''
				}
			]
		});
	}

	run(message, {character, event_title}) {

		const character_name = character.match(/([ァ-ンヴー]+)/) ? character.match(/([ァ-ンヴー]+)/)[0] : '';
		const character_talent = character.match(/([a-z]{3})/) ? character.match(/([a-z]{3})/)[0] : '';
		const character_rarity = character.match(/([A-Z]+)/) ? character.match(/([A-Z]+)/)[0] : '';
		const character_type = character.match(/([cs])/) ? character.match(/([cs])/)[0] : '';

		let event_datas = eventData
			.filter((e) => character_name && e.n.indexOf(character_name) !== -1)
			.filter((e) => e.e.indexOf(event_title) !== -1 || e.k.indexOf(event_title) !== -1)
			.filter((e) => {
				if (!character_talent) return true;
				const m = e.l.match(/([スピスタパワ根性賢さ]+)/);
				if (!m) return false;
				return {'スピ': 'spd', 'スタ': 'stm', 'パワ': 'pow', '根性': 'gut', '賢さ': 'wiz'}[m[0]] === character_talent;
			})
			.filter((e) => {
				if (!character_rarity) return true;
				const m = e.l.match(/([A-Z]+)/);
				if (!m) return false;
				return e.l.match(/([A-Z]+)/)[0] === character_rarity;
			}).filter((e) => {
				if (!character_type) return true;
				return e.c === character_type;
			});

		if (!event_datas.length) {
			event_datas = eventData.filter((e) => e.e.indexOf(character) !== -1 || e.k.indexOf(character) !== -1);
		}

		const embeds = event_datas.map((e) => {
			const emb = new Discord.MessageEmbed()
				.setTitle(e.e)
				.setDescription(e.n + '(' + e.l + ')')
				.setImage('https://img.gamewith.jp/article/thumbnail/rectangle/' + e.a +'.png');
			e.choices.forEach((c) => {
				if (!c.t) c.t = '不明';
				emb.addField(c.n, c.t.replace(/\[br\]/g, '、'));
			});
			return emb;
		});

		if (!embeds.length) {
			message.channel.send('イベントが見つかりませんでした');
		} else if (embeds.length < 2) {
			message.channel.send('', embeds[0]);
		} else {
			new Pagination.Embeds()
				.setArray(embeds)
				.setChannel(message.channel)
				.setPageIndicator(true)
				.setDisabledNavigationEmojis(['jump', 'delete'])
				.setTimeout(24 * 60 * 60 * 1000)
				.build();
		}

	}
};
