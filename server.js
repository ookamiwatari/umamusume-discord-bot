const cmd = require('discord.js-commando');
const path = require('path');

const vm = require("vm");
const https = require('https');
const req = https.request('https://gamewith-tool.s3-ap-northeast-1.amazonaws.com/uma-musume/uma_event_datas.js', (res) => {
	const data = [];
	res.on('data', (chunk) => { data.push(chunk) });
	res.on('end', () => { new vm.Script(Buffer.concat(data)).runInThisContext(); start(); });
});
req.end();

const express = require('express');
const app = express();
app.get('/', function (req, res) {
	res.send('Hello World');
});
app.listen(process.env.PORT || 8080);


function start () {

	const client = new cmd.CommandoClient({
		commandPrefix: '!',
		unknownCommandResponse: false
	});

	client.registry
		.registerDefaultTypes()
		.registerGroups([['utils', 'Utility']])
		.registerDefaultGroups()
		.registerDefaultCommands()
		.registerCommandsIn(path.join(__dirname, 'commands'));

	client.on('ready', () => {
		console.log(`Logged in as ${client.user.tag}!`);
	});

	client.login(process.env.DISCORD_BOT_TOKEN);

}
