import store from '@/store/index.js'
import { EventBus } from '@/event'


let token = "oidZHoLMMoAAAAAAAAAAE2v2LFE5PNNdqNEMshrdAeIT6WVndnQ3FQrXeLf_S-ar"

class Dropbox {

    init() {
        let fetch = require("isomorphic-fetch");
        let Dropbox = require("dropbox").Dropbox;
        new Dropbox({
                fetch: fetch,
                accessToken: token
            })
            .filesListFolder({ path: "" })
            .then(console.log, console.error);
    }
    handleAuthClick() {
        let fileData = []
        let options = {
            // Required. Called when a user selects an item in the Chooser.
            success: function(files) {

                for (let i = 0; i < files.length; i++) {
                    fileData.push({
                        drivetype: "DROPBOX",
                        fileName: files[i].name,
                        URL: files[i].link,
                        fileType: ""
                    })
                }
                console.log(fileData)
                store.commit('setImportFiles', fileData)
                EventBus.$emit('fileImport', true)

            },

            // Optional. Called when the user closes the dialog without selecting a file
            // and does not include any parameters.
            cancel: function() {},

            // Optional. "preview" (default) is a preview link to the document for sharing,
            // "direct" is an expiring link to download the contents of the file. For more
            // information about link types, see Link types below.
            linkType: "preview", // or "direct"

            // Optional. A value of false (default) limits selection to a single file, while
            // true enables multiple file selection.
            multiselect: true, // or true

            // Optional. This is a list of file extensions. If specified, the user will
            // only be able to select files with these extensions. You may also specify
            // file types, such as "video" or "images" in the list. For more information,
            // see File types below. By default, all extensions are allowed.

            // Optional. A value of false (default) limits selection to files,
            // while true allows the user to select both folders and files.
            // You cannot specify `linkType: "direct"` when using `folderselect: true`.
            folderselect: false, // or true

            // Optional. A limit on the size of each file that may be selected, in bytes.
            // If specified, the user will only be able to select files with size
            // less than or equal to this limit.
            // For the purposes of this option, folders have size zero.
        };
        console.log("BrowserSupport||", window.Dropbox.isBrowserSupported());
        window.Dropbox.choose(options);

    }

}

export { Dropbox }