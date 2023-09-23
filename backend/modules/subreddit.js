/**
 * Represents data of a saved subreddit including its name, date from which to filter, and whether it is selected
 */
class Subreddit {
    constructor(subredditName) {
        this.name = subredditName;
        this.date = "dateString"; // datestring
        this.selected = false;
    }

    getName() {
        return this.name;
    }

    getDate() {
        return this.date;
    }

    isSelected() {
        return this.selected;
    }
}

export {Subreddit};