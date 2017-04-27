'use babel';

import SaveCodeFoldingsView from './save-code-foldings-view';
import {
    CompositeDisposable
} from 'atom';

export default {
    subscriptions: null,

    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        // Register commands
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'save-code-foldings:save': () => this.save()
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'save-code-foldings:load': () => this.load()
        }));

        this.load();
    },

    deactivate() {
        this.save();
        this.subscriptions.dispose();
    },

    serialize() {
        return null;
    },

    save() {
        var fs = require('fs');

        var test = {
            width: Math.round(Math.random() * 1000),
            height: 200,
            coords: {
                x: 11,
                y: 22
            }
        };

        fs.unlink("code-foldings.json", (err) => {
            fs.writeFile("code-foldings.json", JSON.stringify(test), () => {
                if (err) return;
            });
        });
    },

    load() {
        var fs = require('fs');

        // TODO: Implement Loading

        fs.unlink("code-foldings.json", (err) => {
            if (err) return;
        });
    }
};
