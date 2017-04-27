/**
 * Created by raphael on 10.04.17.
 */
"use strict";
const events = require('events');

const eventEmitter = new events.EventEmitter();

class Person {
    constructor (name) {
        this.name = name;
        try {
            eventEmitter.on('event', () => this.talk());
            //eventEmitter.emit('event');
        } catch (error){
            console.log(error)
        }
    }

    talk (){
        console.log('TALK');
        setTimeout(() => eventEmitter.emit('event'), 500)
    }
}

var a = new Person('A');
setTimeout(() => a.talk(), 1000)