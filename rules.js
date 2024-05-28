

class Start extends Scene {
    create() {
        //this.engine.setTitle("Title goes here"); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
        //this.engine.gotoScene(Location, this.engine.storyData.Locations.Kresge);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        
        if(locationData.AddKeys) { // If scene provides key(s), add them to the key array. Keys should only be added in scenes the player only visits once
            for(let key of locationData.AddKeys) {
                console.log(typeof(key));
                if(!this.engine.keys.includes(key.Key)){
                    this.engine.keys.push(key.Key);
                }
            }
        }
        if(locationData.RemoveKeys) { // If scene removes key(s), remove them from the key array. Keys should only be removed in scenes the player only visits once
            for(let key of locationData.RemoveKeys) {
                console.log(typeof(key));
                if(this.engine.keys.includes(key.Key)){
                    let targ = this.engine.keys.indexOf(key.Key);
                    this.engine.keys.splice(targ, 1);
                }
            }
        }
        
        this.engine.show(locationData.Body); // Shows the main body text of the location

        if(locationData.LockedText) { // If scene contains text locked behind a key, and the key is possesed, display the text
            for(let text of locationData.LockedText) {
                console.log(this.engine.keys);
                if(this.resolveKeys(text)){
                    this.engine.show(text.Text);
                }
            }
        }

        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                console.log(typeof(choice));
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }

        if(locationData.LockedChoices) { // If scene contains choice(s) locked behind a key, and the key is possesed, display the text
            for(let choice of locationData.LockedChoices) {
                console.log(typeof(choice));
                if(this.resolveKeys(choice)){
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        }
    }

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            if(choice.Type == "Travel"){
                this.engine.gotoScene(Location, choice.Target);
            }
            else{ //was originally going to use multiple "choice types", moved away from this implementation
                this.engine.gotoScene(Interaction, choice.Target);
            }
        } else {
            this.engine.gotoScene(End);
        }
    }

    resolveKeys(lock){ //has support for text and options that have multiple keys and "unkeys." Options are only unlocked if the player has all of the keys and none of the unkeys.
        let unlocked = true;
        for(let key of lock.Keys){
            if(key.Key){
                if(!this.engine.keys.includes(key.Key)){
                    unlocked = false;
                    break;
                } 
            } else {
                if(this.engine.keys.includes(key.UnKey)){
                    unlocked = false;
                    break;
                }
            }
        }
        return(unlocked);
    }
}

class Interaction extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        this.engine.gotoScene(Location, locationData.Parent);
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'LAIKA.json');