const path = require('path');
const recursiveRead = require('recursive-readdir');
const {builder: {destination, source}, supportedEntities} = require('config');
const {createFolder, copyFile, isAttachments, isMarkDownFile, isGitKeep} = require('./helpers');
const processMDFile = require('./md-processor');
const timestampsExtractor = require('./timestamps-extractor');

const sourcePath = path.resolve(source);
const errors = [];

recursiveRead(sourcePath)
    .then(files => {
        return files.reduce((structure, filePath) => {
            const [entity, filename] = filePath.replace(sourcePath + '/', '').split('/');
            if (!supportedEntities.includes(entity) || !filename || isGitKeep(filename)) {
                return structure;
            }
            structure[entity] = structure[entity] || []
            structure[entity].push(filePath);

            return structure;
        }, {})
    })
    .then(async (structure) => {
        const timestamps = await timestampsExtractor(sourcePath);
        for (const entity in structure) {
            createFolder(destination, entity);
            for (const filePath of structure[entity]) {
                const fileFolder = `${destination}/${entity}`;
                try {
                    if (isAttachments(entity)) {
                        await copyFile(filePath, fileFolder)
                    }
                    if (isMarkDownFile(filePath)) {
                        await processMDFile(filePath, fileFolder, timestamps)
                    }
                } catch (err) {
                    errors.push({
                        filePath,
                        err
                    })
                }
            }
        }
    })
    .catch(err => {
        errors.push(err);
    })
    .finally(() => {
        if (errors.length) {
            console.error(`ERRORS DURING BUILD`);
            console.error(errors);
            process.exit(1);
        }
        console.info('BUILD SUCCESS')
    })


