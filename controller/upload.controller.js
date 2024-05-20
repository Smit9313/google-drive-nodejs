const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");


const KEY_FILE_PATH = path.join("some-service-account.json");

const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: SCOPES,
})

exports.getFileDetails = async (req, res) => {

    try {

        const { file } = req;

        const { data } = await google.drive({ version: "v3", auth: auth }).files
            .create({
                media: {
                    mimeType: file.mimeType,
                    body: fs.createReadStream(file.path)
                },
                requestBody: {
                    name: file.originalname,
                    parents: ["1x7Gn5kFagQZDryQ8THmoJRxaH_9xAwI_"]   //folder id in which file should be uploaded
                },
                fields: "id,name"
            })

        console.log(`File uploaded successfully -> ${JSON.stringify(data)}`);

        res.json({ status: 1, message: "success", file_id: data.id, file_name: data.name });

    } catch (error) {

        console.log(error);
        res.json({ status: -1, message: "failure", err: error.message });

    }
}