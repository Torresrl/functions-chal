const express = require('express');
const admin = require('firebase-admin');
const cors = require("cors");
const path = require("path");
const upload_image_api = express();
const fileUpload = require("./cloud-function-file-upload");



upload_image_api.use(cors({origin: true}));
fileUpload("/picture", upload_image_api);


upload_image_api.post("/picture", (request, response, next) => {
    //console.log("body json: " + request.files.file[1]);

    uploadImageToStorage(request.files.file[0])
        .then(metadata => {
            response.status(200).json(metadata[request.files.file[0]]);
            next();
        }).catch(error => {
            console.error(error);
            response.status(500).json({error});
            next();
    })

});

const uploadImageToStorage = (file) => {
    const storage = admin.storage();
    //pga jeg ikke klarte å sende navn med backslash måtte jeg improvisere og bytte det med *
    const name = file.originalname.replace(/\*/g, '/');
    return new Promise((resolve, reject) => {
        const fileUpload = storage.bucket().file(name); //file(path in storage)
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: "image/jpg"
            }
        });

        blobStream.on("error", error => reject(error));

        blobStream.on("finish", () => {
            fileUpload.getMetadata()
                .then(metadata => resolve(metadata))
                .catch(error => reject(error));
        });

        blobStream.end(file.buffer);
    });
};



module.exports = upload_image_api;

