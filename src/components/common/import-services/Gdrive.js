import store from '@/store/index.js'
import { EventBus } from '@/event'

let CLIENT_ID = "132812694418-7vkkkrnajn1tcgb8ntt4vvp2d8nrjgrd.apps.googleusercontent.com";
let API_KEY = "AIzaSyCdsb5naspS1iCEBGNK46osebEyNed56W8";
// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/drive.file";
let APP_ID = "quickstart-1593602534120";
let GoogleAuth = ""
let GoogleUser = ""
let fileData = []


class GDrive {

    gdriveSdkInit() {
        gapi.load("client:auth2:picker", this.initClient);
    }

    initClient() {

        gapi.client
            .init({
                //  apiKey: this.API_KEY,
                client_id: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            })
            .then(
                function() {
                    // Listen for sign-in state changes.
                    GoogleAuth = gapi.auth2.getAuthInstance();
                    GoogleUser = GoogleAuth.currentUser.get();
                },
                function(error) {
                    console.log("Drive Error||", error)
                }
            );
    }
    handleAuthClick() {
        if (!GoogleUser.hasGrantedScopes(SCOPES)) {
            GoogleUser.grant({
                scope: SCOPES
            }).then(this.displayPicker, function(err) {
                // Handle error/declined auth...
            });
        } else {
            this.displayPicker();
        }
    }
    displayPicker() {
        fileData = []
            // Fetch current token
        let authResponse = GoogleUser.getAuthResponse(true);
        fileData.authtoken = authResponse.access_token ? authResponse.access_token : ""
        var view = new google.picker.View(google.picker.ViewId.DOCS);
        var picker = new google.picker.PickerBuilder()
            .enableFeature(google.picker.Feature.SUPPORT_DRIVES)
            .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
            .setAppId(APP_ID)
            .setOAuthToken(authResponse.access_token)
            .addView(view)
            .setDeveloperKey(API_KEY)
            .setCallback(this.pickerCallback)
            .build();
        picker.setVisible(true);
    };

    /**
     * Called when a file is picked. This function gathers metadata from
     * the picked documents and from calling get on the fileId.
     */
    pickerCallback(data) {
        if (data && data.docs && data.docs.length) {
            for (let i = 0; i < data.docs.length; i++) {
                let document = data[google.picker.Response.DOCUMENTS][i];
                // The following information is passed to the callback, while other has to be
                // retrieved by calling files.get() on a file (below)
                let fileName = document[google.picker.Document.NAME];
                let URL = document[google.picker.Document.URL];
                let lastModifiedDate = document[google.picker.Document.LAST_EDITED_UTC];
                let date = new Date(lastModifiedDate);
                let fileId = document[google.picker.Document.ID];
                let fileType = document[google.picker.Document.TYPE];
                fileData.push({
                    drivetype: "GDRIVE",
                    fileName: fileName,
                    URL: URL,
                })


                // Called to get the lastModifyingUser
                gapi.client.drive.files
                    .get({
                        fileId: fileId,
                        fields: "lastModifyingUser"
                    })
                    .then(
                        function(response) {

                            console.log(
                                "Last Modified User: " +
                                response.result.lastModifyingUser.displayName
                            );
                        },
                        function(err) {
                            // Handle error...
                        }
                    );
            }
            appendPre(fileData);
        }
    }

}

function appendPre(data) {
    console.log("FileData", data)
    store.commit('setImportFiles', data)
    EventBus.$emit('fileImport', true)

}
export { GDrive }