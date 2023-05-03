//Adapted from https://refactoring.guru/design-patterns/memento
//Adapted by Prasanna Vaddkkepurakkal & David Coles
//Infastructure for the Memento
var MementoClass = /** @class */ (function () {
    function MementoClass(state) {
        this.state = state;
        this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    //state name
    MementoClass.prototype.getState = function () {
        return this.state;
    };
    //memento name in "date time / random string" format
    MementoClass.prototype.getMemento = function () {
        return "".concat(this.date, " / (").concat(this.state, ")");
    };
    //state date
    MementoClass.prototype.getDate = function () {
        return this.date;
    };
    return MementoClass;
}());
//Holds the state that may change and allows the state to be saved or restored
var Originator = /** @class */ (function () {
    //takes in a given string and sets it as the state
    function Originator(state) {
        this.state = state;
        console.log("Originator: My initial state is: ".concat(state));
    }
    //does something that changes the state
    //Backup prior or state will be lost
    Originator.prototype.doSomething = function () {
        console.log('Originator: I\'m doing some activity.');
        this.state = this.generateRandomString(30);
        console.log("Originator: and my state has changed to: ".concat(this.state));
    };
    //Just for generating the random string
    Originator.prototype.generateRandomString = function (length) {
        if (length === void 0) { length = 10; }
        var charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array
            .apply(null, { length: length })
            .map(function () { return charSet.charAt(Math.floor(Math.random() * charSet.length)); })
            .join('');
    };
    //saves state in a memento
    Originator.prototype.save = function () {
        return new MementoClass(this.state);
    };
    //Gets passed in a memento that is poppepd off from Caretaker
    Originator.prototype.restore = function (memento) {
        this.state = memento.getState();
        console.log("Originator: My state has changed to: ".concat(this.state));
    };
    return Originator;
}());
//Caretaker class is responsible for the memento's safekeeping
var Caretaker = /** @class */ (function () {
    function Caretaker(originator) {
        this.mementos = [];
        this.originator = originator;
    }
    //saves the state in a memento and pushes it onto the stack
    Caretaker.prototype.backup = function () {
        console.log('\nCaretaker: Saving the current state...');
        //Returns new memento object of current state and pushes to stack
        this.mementos.push(this.originator.save());
    };
    //pops a memento off the stack and gives it to caretaker to set the current memento to
    Caretaker.prototype.undo = function () {
        if (!this.mementos.length) {
            return;
        }
        var memento = this.mementos.pop();
        console.log("Caretaker: Restoring state to: ".concat(memento.getMemento()));
        this.originator.restore(memento);
        console.log('');
    };
    //prints all memeontos in the stack
    Caretaker.prototype.showHistory = function () {
        console.log('Caretaker: Here\'s the list of mementos:');
        for (var _i = 0, _a = this.mementos; _i < _a.length; _i++) {
            var memento = _a[_i];
            console.log(memento.getMemento());
        }
        console.log('');
    };
    return Caretaker;
}());
//Do an initial activity
var originator = new Originator('kevin');
//Allows for the state to be saved
var caretaker = new Caretaker(originator);
caretaker.backup();
originator.doSomething();
caretaker.backup();
originator.doSomething();
caretaker.backup();
originator.doSomething();
caretaker.showHistory();
caretaker.undo();
caretaker.undo();
caretaker.showHistory();
originator.doSomething();
caretaker.backup();
caretaker.showHistory();
