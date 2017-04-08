const elder = require('discord.js-commando');
const pool = require ('../../databaseClient.js');

module.exports = class TestCommand extends elder.Command {

    constructor(client){
        // console.log(client);

        super(client, {
            name:'stand',
            group: 'set',
            memberName:'standcommand',
            description:'Set time the ElderBot will wait for a knock.\t Ex: 10 sec, 5 min',
  			args: [{
    			key: 'int_key',
    			label: 'stand',
    			prompt: 'Set time the ElderBot will wait for a knock:\n',
    			type: 'string',
    			infinite: false,

    			}]
        });
        this.me = client;
    }

    hasPermission(message) {
		return this.client.isOwner(message.author);
	}

    async run(message, args){
        var v = args.int_key.split(" ");
        console.log(v.length);
        if(v.length == 2) {
            var n;
            //if a number
            if(parseInt(v[0])) {
                var m = this.me.toMili(parseInt(v[0]),v[1]);
                console.log(m);
                if(m != -1) {
                    this.me.myStates[2].time = m;
                    pool.connect( (err, client, done) => {
                        client.query('update settings set time = $1 where name = \'knock\'',[m], (err, result) => {
                            done(err);
                            console.log(m);
                            message.reply('Stand Time Updated');

                        });
                    });


                }else { message.reply('I\'m sorry, I couldn\'t understand you.'); }

            } else { message.reply('I\'m sorry, I couldn\'t understand you.'); }

        } else { message.reply('I\'m sorry, I couldn\'t understand you.'); }


    }
}
