const {builder: {source}} = require('config');
const path = require('path');
const Markdown = require('markdown-it')({
    typographer: true
});

const {getFileName, readFile, saveFile} = require('./helpers');

const sourcePath = path.resolve(source);

function parseMD(data, timestamps = {}) {
    const json = {
        timestamps: {
            created: Date.now(),
            modified: Date.now(),
            ...timestamps && {
                created: timestamps.created * 1000,
                modified: timestamps.modified * 1000,
            }
        }
    };
    const meta = data.match(/(START_META)([\s\S]*)(END_META)/m);
    if (meta && meta.length) {
        const [fullMeta, , metaString] = meta;
        data = data.replace(fullMeta, '');
        json.meta = JSON.parse(metaString);
    }

    json.html = replaceAttachmentsUrlsToCDN(Markdown.render(data));

    return json;
}

function replaceAttachmentsUrlsToCDN(data) {
    return data.replace(/..\/attachments/g, '[[CDN_URL]]')
}

function parseTimestamps(timestamps, filePath) {
    const filePathChunks = filePath.replace(sourcePath,'').split('/');
    filePathChunks.shift();
    return timestamps[filePathChunks.join('/')];
}

async function processMDFile(filePath, destination, timestamps = []) {
    try {
        const fileName = getFileName(filePath, '.md');
        const mdData = await readFile(filePath);
        const json = parseMD(mdData, parseTimestamps(timestamps, filePath));

        await saveFile(`${destination}/${fileName}.json`, JSON.stringify({...json,slug: fileName}));

        return true;
    } catch (err) {
        console.error('Failed to process MD file', filePath, err);
        throw err;
    }
}

module.exports = processMDFile;