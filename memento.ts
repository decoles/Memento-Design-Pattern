//Adapted from https://refactoring.guru/design-patterns/memento
//Adapted by Prasanna Vaddkkepurakkal & David Coles

//For memento data storage
interface Memento {
    getDate(): string;
    getState(): string;
    getMemento(): string; //gets memento content
}

//Infastructure for the Memento
class MementoClass implements Memento {
    private state: string;
    private date: string;

    constructor(state: string) {
        this.state = state;
        this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    //state name
    public getState(): string {
        return this.state;
    }

    //memento name in "date time / random string" format
    public getMemento(): string {
        return `${this.date} / (${this.state})`;
    }

    //state date
    public getDate(): string {
        return this.date;
    }
}

//Holds the state that may change and allows the state to be saved or restored
class Originator {
    private state: string; //state that may change, for simplicisty

    //takes in a given string and sets it as the state
    constructor(state: string) {
        this.state = state;
        console.log(`Originator: My initial state is: ${state}`);
    }

    //does something that changes the state
    //Backup prior or state will be lost
    public doSomething(): void {
        console.log('Originator: I\'m doing some activity.');
        this.state = this.generateRandomString(30);
        console.log(`Originator: and my state has changed to: ${this.state}`);
    }

    //Just for generating the random string
    private generateRandomString(length: number = 10): string {
        const charSet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        return Array
            .apply(null, { length })
            .map(() => charSet.charAt(Math.floor(Math.random() * charSet.length)))
            .join('');
    }

    //saves state in a memento
    public save(): Memento {
        return new MementoClass(this.state);
    }

    //Gets passed in a memento that is poppepd off from Caretaker
    public restore(memento: Memento): void {
        this.state = memento.getState();
        console.log(`Originator: My state has changed to: ${this.state}`);
    }
}

//Caretaker class is responsible for the memento's safekeeping
class Caretaker {
    private mementos: Memento[] = [];
    private originator: Originator;

    constructor(originator: Originator) {
        this.originator = originator;
    }

    //saves the state in a memento and pushes it onto the stack
    public backup(): void {
        console.log('\nCaretaker: Saving the current state...');
        //Returns new memento object of current state and pushes to stack
        this.mementos.push(this.originator.save()); 
    }

    //pops a memento off the stack and gives it to caretaker to set the current memento to
    public undo(): void {
        if (!this.mementos.length) {
            return;
        }
        const memento = this.mementos.pop();
        console.log(`Caretaker: Restoring state to: ${memento.getMemento()}`);
        this.originator.restore(memento);
        console.log('');

    }

    //prints all memeontos in the stack
    public showHistory(): void {
        console.log('Caretaker: Here\'s the list of mementos:');
        for (const memento of this.mementos) {
            console.log(memento.getMemento());
        }
        console.log('');
    }
}

//Do an initial activity
const originator = new Originator('kevin');
//Allows for the state to be saved
const caretaker = new Caretaker(originator);
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

