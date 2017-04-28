'use babel';

import SaveCodeFoldingsView from './save-code-foldings-view';
import {
    CompositeDisposable,
    File
} from 'atom';

export default {
    subscriptions: null,
    file: null,

    activate(state) {
        this.file = new File("code-foldings.json");
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register commands
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'save-code-foldings:save': () => this.save()
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'save-code-foldings:load': () => this.load()
        }));

        atom.workspace.observeTextEditors((editor) => editor.onDidChange(() => this.save(editor)));
    },

    deactivate() {
        this.subscriptions.dispose();
    },

    serialize() {
        return null;
    },

    save(editor) {
        if (typeof editor === "undefined") {
            console.log("editor undefined");
            return;
        }

        this.file.read().then((response) => {
            let codeFoldings = {};

            try {
                codeFoldings = JSON.parse(response);
            } catch (err) {
                if (err instanceof SyntaxError) {
                    this.file.write(JSON.stringify({ files: [] }));
                    codeFoldings = { files: [] };
                }
            }

            if (typeof codeFoldings !== "undefined") {
                let foldings = [];

                for (i = 1; i <= editor.getBuffer().getLineCount(); ++i) {
                    if (editor.isFoldedAtBufferRow(i)) {
                        foldings.push(i);
                    }
                }

                if (foldings.length > 0) {
                    let path = editor.getBuffer().getUri();

                    let foundFile = codeFoldings.files.filter((file) => { return file.path === path });
                    if (foundFile.length > 0) {
                        codeFoldings.files[codeFoldings.files.indexOf(foundFile[0])] == { path, foldings };
                    } else {
                        codeFoldings.files.push({ path, foldings });
                    }

                    console.log("codeFoldings");
                    console.log(codeFoldings);

                    this.file.write(JSON.stringify(codeFoldings));
                }
            }
        });
    },

    load() {
        // let editor
        // if (editor = atom.workspace.getActiveTextEditor()) {
        //     editor.toggleFoldAtBufferRow(4);
        // }

        this.file.read().then((result) => console.log(result));
    }
};
