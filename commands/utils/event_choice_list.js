const Discord = require('discord.js');
const cmd = require('discord.js-commando');
const Pagination = require('discord-paginationembed');
const eventData = eventDatas;

module.exports = class EventChoiceList extends cmd.Command {
	constructor(client) {
		super(client, {
			name: 'event_choice_list',
			aliases: ['el', 'cl', 'event_list', 'choice_list'],
			group: 'utils',
			memberName: 'event_choice_list',
			description: "イベント選択肢",
			examples: ['!event_choice_list ハルウララc ゴールドシチーSSR ビコーSSR ツインターボSSR クリークSSR マーベラスSR'],
			args: [
				{
					key: 'characters',
					prompt: 'キャラクター名を入力してください。',
					type: 'string',
					infinite: true
				}
			]
		});
	}

	run(message, {characters}) {

		const event_datas_array = characters.map((character) => {

			const character_name = character.match(/([ァ-ンヴー]+)/) ? character.match(/([ァ-ンヴー]+)/)[0] : '';
			const character_talent = character.match(/([a-z]{3})/) ? character.match(/([a-z]{3})/)[0] : '';
			const character_rarity = character.match(/([A-Z]+)/) ? character.match(/([A-Z]+)/)[0] : '';
			const character_type = character.match(/([cs])/) ? character.match(/([cs])/)[0] : '';

			return eventData
				.filter((e) => character_name && e.n.indexOf(character_name) !== -1)
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

		});

		if (!event_datas_array.flat()) return message.channel.send('イベントが見つかりませんでした');

		event_datas_array.filter((event_datas_array) => event_datas_array.length).map((event_datas) => {
			console.log('event_datas', event_datas);
			const emb = new Discord.MessageEmbed()
				.setTitle(event_datas[0].n)
				.setDescription(event_datas[0].l)
			event_datas.forEach((e) => {
				if (e.e === 'URAファイナルズ予選の後に') return;
				if (e.e === 'URAファイナルズ準決勝の後に') return;
				if (e.e === 'URAファイナルズ決勝の後に') return;
				if (e.e === 'レース入着') return;
				if (e.e === 'レース勝利！') return;
				if (e.e === 'レース敗北') return;
				if (e.e === '追加の自主トレ') return;
				if (e.e.match(/の後に$/)) return;
				const value = e.choices.map((c, index) => (e.choices.length === 3 ? '上中下' : '上下')[index] + ': ' + c.t.replace(/\[br\]/g, '、')).join('\n');
				emb.addField(e.e, value);
			});
			message.channel.send('', emb);
		});
	}
};
