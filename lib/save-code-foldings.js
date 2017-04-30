'use babel';

import {
    CompositeDisposable,
    File,
    TextEditor
} from 'atom';

export default {
    subscriptions: null,
    file: null,

    activate(state) {
        this.file = new File("code-foldings.json");
        this.file.create();

        this.subscriptions = new CompositeDisposable();
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
        if (typeof editor === "undefined" && editor == null) {
            console.log("editor undefined");
            return;
        }

        this.file.read().then((response) => {
            let codeFoldings = {};

            try {
                codeFoldings = JSON.parse(response);
            } catch (err) {
                this.file.write(JSON.stringify({ files: [] }));
                codeFoldings = { files: [] };
            }

            if (typeof codeFoldings !== "undefined" && codeFoldings !== null) {
                let path = editor.getBuffer().getUri();

                let newFolding = null;
                let oldFoldings = null;

                let foundFile = codeFoldings.files.find((file) => { return file.path === path; });
                if (typeof foundFile !== "undefined") oldFoldings = foundFile.foldings;

                for (i = 0; i < editor.getBuffer().getLineCount(); ++i) {
                    if (editor.isFoldedAtBufferRow(i) && editor.isFoldableAtBufferRow(i)) {
                        if (oldFoldings !== null) {
                            if (!oldFoldings.includes(i)) {
                                newFolding = i;
                                console.log("Folding: " + (i + 1));
                                break;
                            }
                        } else {
                            newFolding = i;
                            console.log("Folding: " + (i + 1));
                            break;
                        }
                    }
                }

                if (newFolding !== null) {
                    let foundFile = codeFoldings.files.find((file) => { return file.path === path; });
                    if (typeof foundFile !== "undefined") {
                        codeFoldings.files[codeFoldings.files.indexOf(foundFile)].foldings.push(newFolding);
                    } else {
                        let foldings = new Array();
                        foldings.push(newFolding);
                        codeFoldings.files.push({ path, foldings });
                    }

                    console.log(codeFoldings);
                    this.file.write(JSON.stringify(codeFoldings));
                }
            }
        });
    },

    load() {
        this.file.read().then((response) => {
            let codeFoldings = {};

            if (typeof codeFoldings !== "undefined" && codeFoldings != null) {
                try {
                    codeFoldings = JSON.parse(response);
                } catch (err) {
                    if (err instanceof SyntaxError) {
                        this.file.write(JSON.stringify({ files: [] }));
                        codeFoldings = { files: [] };
                    }
                }

                // Get all opened TextEditors
                let editors = atom.workspace.getTextEditors();

                // Loop through all editors
                for (let i = 0; i < editors.length; ++i) {
                    let foundFile = codeFoldings.files.find((file) => { return file.path === editors[i].getBuffer().getUri(); });

                    if (typeof foundFile !== "undefined") {
                        for (let i2 = 0; i2 < foundFile.foldings.length; ++i2) {
                            editors[i].foldBufferRow(foundFile.foldings[i2 + 1]);
                            console.log("folded " + (i2));
                        }
                    }
                }
            }
        });
    }
};
