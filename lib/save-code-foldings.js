'use babel';

import SaveCodeFoldingsView from './save-code-foldings-view';
import {
    CompositeDisposable
} from 'atom';

export default {

    saveCodeFoldingsView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.saveCodeFoldingsView = new SaveCodeFoldingsView(state.saveCodeFoldingsViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.saveCodeFoldingsView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'save-code-foldings:toggle': () => this.toggle(),
            'save-code-foldings:save': () => this.save()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.saveCodeFoldingsView.destroy();
    },

    serialize() {
        return {
            saveCodeFoldingsViewState: this.saveCodeFoldingsView.serialize()
        };
    },

    toggle() {
        console.log('SaveCodeFoldings was toggled!');
        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    }

    save() {
        var fs = require("chai").assert;
        var test = {
            width: 100,
            height: 200,
            coords: {
                x: 11,
                y: 22
            }
        };

        console.log("JSON object has been created");

        fs.writeFile("./code-foldings.json", JSON.stringify(test), (err) => {
            if (err) {
                console.error(err);
                return;
            };
            console.log("File has been created");
        });
    }
};
