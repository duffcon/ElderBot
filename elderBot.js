const discordbot = require('discord.js-commando');


module.exports = class elderBot extends discordbot.Client {
    constructor(prefix, channel, owners){
    	super({
            unknownCommandResponse:false,
            commandPrefix: prefix,
            owner:owners
        });
        this.somechannel = channel;

        this.currentState = 0;
        //timeout for current state
        this.timeoutTebow = null;
        //interval to save state
        this.jesusSaves = null;
        this.saveHowOften = 30000;
        this.who = '';

        //constructor for a state object
        this.elderState = function(save,name,time,next){
            this.save = save;
            this.name = name;
            this.time = time;
            this.next = next;
            this.getTime = function(){
                return this.time;
            };
        }
        //Array of states
        this.myStates = [
            new this.elderState(0, 'init', 0, 1),
            new this.elderState(1, 'walk', 300000, 2),
            new this.elderState(0, 'knock', 60000, 4),
            new this.elderState(0, 'talk', 10000, 4),
            new this.elderState(1, 'sit', 0, 1)
        ];
        //must contain scope of class to access other states
        this.elderState.prototype.self = this;

        // Customize getTimes for specific states here:
        this.myStates[1].getTime = function(){
            var min = 0.3;
            var temp = Math.floor(Math.random() * ((this.time) - (this.time * min)) + (this.time * min));
            this.self.myStates[4].time = (this.time - temp);
            this.self.emit('newsit', this.self.myStates[4].time);
            return temp;
        };


    }
        wakeUp(){

            var initState = 0;
            //If there is time to restore
            if(this.myStates[initState].time)
            {
                this.currentState = this.myStates[initState].next;
                this.timeoutTebow = setTimeout(()=>{this.timeoutHandler()}, this.myStates[initState].time);
            }
            else{
                this.timeoutHandler();
            }
            this.jesusSaves = setInterval(()=>{this.saveHandler()}, this.saveHowOften);
        }

        timeoutHandler(){
            this.emit('timeout' + this.myStates[this.currentState].name);
            this.changeState(this.myStates[this.currentState].next);
        }
        saveHandler(){
            if(this.myStates[this.currentState].save)
            {
                this.emit('saveprogress', this.saveHowOften);
            }
        }
        changeState(newState){
            if(this.timeoutTebow){clearTimeout(this.timeoutTebow);this.timeoutTebow = null;}

            this.currentState = newState;
            this.emit(this.myStates[this.currentState].name) ;
            // console.log('Change State: ' + this.myStates[this.currentState]);
            var temptime = this.myStates[this.currentState].getTime();
            // console.log(temptime);
            if (this.myStates[this.currentState].save) {
                this.emit('setprogress', temptime, this.currentState);
            }
            else {
                this.emit('clearprogress', 0, 1);
            }
            // console.log('currentState: ' + this.myStates[this.currentState].name + '\tWaiting: ' + temptime);
            this.timeoutTebow = setTimeout(()=>{this.timeoutHandler()}, temptime);

        }

        toMili(value, unit){
            var mult;
            if (unit.includes('sec')) {
                mult = (1000)
            } else if (unit.includes('min')) {
                mult = (60 * 1000)
            } else if (unit.includes('hour')) {
                mult = (60 * 60 * 1000)
            } else if (unit.includes('day')) {
                mult = (24 * 60 * 60 * 1000)
            } else if (unit.includes('week')) {
                mult = (7 * 24 * 60 * 60 * 1000)
            } else if (unit.includes('month')) {
                mult = (4 * 7 * 24 * 60 * 60 * 1000)
            } else if (unit.includes('year')) {
                mult = (12 * 4 * 7 * 24 * 60 * 60 * 1000)
            } else {
                return -1;
            }
            return (value * mult);
        }

        toEnglish(value){
            var i;
            var numbers = [1000,60,60,24,7,4,12,100];
            var letters = ['sec', 'min', 'hour', 'day', 'week', 'month', 'year', 'century'];
            for (i = 0; i < numbers.length-1; i++){
                value /= numbers[i];
                // var temp = value / div;
                if(value < numbers[i+1]){
                    break;
                }
            }
            var s = (value.toString() + ' ' + letters[i] + '(s)');
            return s;
        }
}
