const elder = require('discord.js-commando');
const pool = require ('../../databaseClient.js');

module.exports = class TestCommand extends elder.Command {

    constructor(client){
        // console.log(client);

        super(client, {
            name:'int',
            group: 'set',
            memberName:'intcommand',
            description:'Set interval the ElderBot will knock.\t Ex: 5 min, 1 week',
  			args: [{
    			key: 'int_key',
    			label: 'interval',
    			prompt: 'Set interval the ElderBot will knock:\n',
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

        if(v.length == 2) {
            var n;
            //if a number
            if(parseInt(v[0])) {
                var m = this.me.toMili(parseInt(v[0]),v[1]);

                if(m != -1) {
                    this.me.myStates[1].time = m;
                    pool.connect( (err, client, done) => {
                        client.query('update settings set time = $1 where name = \'walk\'',[m], (err, result) => {
                            done(err);

                            this.me.changeState(1);
                            message.reply('Interval Updated');
                        });
                    });


                }else { message.reply('I\'m sorry, I couldn\'t understand you.'); }

            } else { message.reply('I\'m sorry, I couldn\'t understand you.'); }

        } else { message.reply('I\'m sorry, I couldn\'t understand you.'); }


    }
}
