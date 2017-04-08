const elder = require('./elderBot.js');
var pool = require('./databaseClient.js');

var bot = new elder('!', 'channel_id', ['user_id']);

bot.login('token');
// Register Commands
bot.registry.registerGroup('set', 'Set');
bot.registry.registerGroup('other', 'Other');
bot.registry.registerDefaultTypes();
bot.registry.registerDefaultGroups();
bot.registry.registerDefaultCommands({prefix: false, eval_: false, commandState: false});
bot.registry.registerCommandsIn(__dirname + '/commands');


/**********************************************


Default discord.js events


***********************************************/
bot.on('ready', () => {
    console.log('ElderBot is ready to go');
    bot.user.setPresence({
        status:'dnd',
        game:{name:'Bible Study'}
    });

    pool.connect( (err, client, done) => {
        //Does BOM database exist, if not, exit
        client.query("select to_regclass('bom')", (err, result) => {
            done(err);
            if(result.rows[0].to_regclass == null){
                console.log('Don\'t have my book');
                process.exit();
            }
            //Does Settings database exist, if not create it
            client.query("select to_regclass('settings')", (err, result) => {
                done(err);
                // console.log(result.rows[0].to_regclass == null);
                if(result.rows[0].to_regclass == null){

                    firstDay();
                }
                else {

                    loadSettings();
                }
            });
        });
    });
});


bot.on('message', (message) => {

    if (message.author.bot == false ) {

        if(bot.myStates[bot.currentState].name == 'knock'){
            if (message.content.startsWith('open')){

                message.channel.sendMessage('Would you like to learn about our lord and savior Jesus Christ?');
                bot.who = message.author;
                bot.changeState(3);
            }
        }

        else if((bot.myStates[bot.currentState].name == 'talk') && (message.author == bot.who)){
                if( message.content.startsWith('yes') || message.content.startsWith('y') ){

                    pool.connect((err, client, done) => {
                        //Select Random verse from BOM database
                        client.query('select book, chapter, index, verse from bom order by random() limit 1', (err, result) => {
                            done(err);
                            var v = result.rows[0];

                            message.channel.sendMessage('\0\n"' + v.verse + '"' + '\n' + v.book + ' ' + v.chapter + ':' + v.index);
                            message.channel.sendMessage('Thank you for your time.');
                            bot.changeState(4);
                        });
                    });
                }

                else if( message.content.startsWith('no') || message.content.startsWith('n') ){
                        message.channel.sendMessage("Sorry to bother you, have a wonderful rest of your day.");
                        bot.changeState(4);
                }
        }
    }
});


/**********************************************


State machine events


***********************************************/
bot.on('knock', ()=>{
    // console.log('start knock');
    clearInterval(bot.progress);
    bot.user.setPresence({
        status:'online',
        game:{name:''}
    });
    bot.user.setPresence({
        status:'online',
        game:{name:null}
    });
    bot.channels.get(bot.somechannel).sendMessage('*** *knock* ** * *** *knock* ** *');
})


bot.on('walk', ()=>{
    // console.log('start walk');
    bot.user.setPresence({
        status:'dnd',
        game:{name:'Bible Study'}
    });
})

bot.on('sit', ()=>{
    // console.log('start walk');
    bot.user.setPresence({
        status:'dnd',
        game:{name:'Bible Study'}
    });
})

bot.on('timeouttalk', ()=>{
    bot.channels.get(bot.somechannel).sendMessage('The lord needs me goodbye');

})


/**********************************************


Events to save progress


***********************************************/
bot.on('saveprogress', (interval) => {
    pool.connect((err, client, done) => {
        //Does settings database exist, if so load it into mysettings
        client.query('update settings set time=time-$1 where name=\'init\'', [interval], (err, result) => {
            done(err);

        });
    });
})

bot.on('setprogress', (time,state) =>{
    pool.connect((err, client, done) => {
        //Does settings database exist, if so load it into mysettings
        client.query('update settings set (time,state)=($1,$2)  where name=\'init\'', [time, state], (err, result) => {
            done(err);
        });
    });
})


bot.on('clearprogress', (time,state) =>{
    pool.connect((err, client, done) => {
        //Does settings database exist, if so load it into mysettings
        client.query('update settings set (time,state) = ($1,$2) where name=\'init\'',[time,state], (err, result) => {
            done(err);
        });
    });
})

/**********************************************


Load state settings or create settings database


***********************************************/
//Create settings database
function firstDay(){
pool.connect((err, client, done) => {
    //Does settings database exist, if so load them
    client.query('create table if not exists settings(index serial, name varchar(10) primary key, time integer default 0, state integer default 1)', (err, result) => {
        done(err);
        var save = "(";
        for (var i = 0; i < bot.myStates.length-1; i++){
            save += "'" + bot.myStates[i].name + "'," + bot.myStates[i].time + "),(";
        }
        save += "'" + bot.myStates[i].name + "'," + bot.myStates[i].time + ")";

        client.query("insert into settings(name,time) values" + save, (err, result) => {
            done(err);

            startBot();

        });
    });
});
}

function loadSettings() {
    pool.connect((err, client, done) => {
        client.query('select * from settings order by index asc', (err, result) => {
            done(err);

            for (var i = 0; i < result.rowCount; i++) {
                bot.myStates[i].time = result.rows[i].time;
            }
            var initState = 0;
            bot.myStates[initState].next = result.rows[initState].state;

            // console.log('previous progress: time: ' + result.rows[initState].time + ' state: ' + result.rows[initState].state);
            startBot();

        });
    });
}

/**********************************************


GO GO GO!


***********************************************/
function startBot(){
    bot.wakeUp();
    // process.exit();
}
