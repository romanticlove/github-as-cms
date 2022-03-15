const fs = require('fs');
const {builder} = require("config");

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        })
    })
}

function saveFile(destination, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(destination, data, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(true)
        })
    })
}

function copyFile(filePath, destination) {
    const fileName = getFileName(filePath);
    return new Promise((resolve, reject) => {
        fs.copyFile(filePath, destination + `/${fileName}`, (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(true);
        });
    })
}

function getFileName(path, cutExtension = '') {
    return [...path.split('/')].reverse()[0].replace(cutExtension, '');
}

function createFolder(path, folderName) {
    const folderPath = `${path}/${folderName}`;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    return folderPath
}

function isGitKeep(path) {
    return path.includes('.gitkeep');
}

function isMarkDownFile(path) {
    return path.indexOf('.md') === path.length - 3;
}

function isAttachments(folder) {
    return folder === builder.attachmentsFolder;
}

module.exports = {
    saveFile,
    readFile,
    copyFile,
    getFileName,
    isGitKeep,
    isMarkDownFile,
    isAttachments,
    createFolder,
}