const elder = require('discord.js-commando');
const pool = require ('../../databaseClient.js');

module.exports = class TestCommand extends elder.Command {

    constructor(client){
        super(client, {
            name:'sprint',
            group: 'other',
            memberName:'sprintcommand',
            description:'Make the bot sprint to your door',

        });
        this.me = client;
    }

    hasPermission(message) {
		return this.client.isOwner(message.author);
	}

    async run(message, args){
    if(this.me.currentState == 3 ){
        message.reply('I am already here...')
    }
    if(this.me.currentState == 1 || this.me.currentState == 4){
        this.me.changeState(2);
    }





    }
}
