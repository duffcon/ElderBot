const elder = require('discord.js-commando');
const pool = require ('../../databaseClient.js');

module.exports = class TestCommand extends elder.Command {

    constructor(client){
        super(client, {
            name:'settings',
            group: 'other',
            memberName:'settingscommand',
            description:'Timeout settings',

        });
        this.me = client;
    }

    // hasPermission(message) {
	// 	return this.client.isOwner(message.author);
	// }

    async run(message, args){
    var i;
    var m = '\0\n';

    m += 'Interval:\t' + this.me.toEnglish(this.me.myStates[1].time) + '\n'
    m += 'Stand:   \t' + this.me.toEnglish(this.me.myStates[2].time) + '\n'

    message.reply(m);



    }
}
