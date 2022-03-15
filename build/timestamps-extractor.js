const gitDateExtractor = require('git-date-extractor');

module.exports = (folder) => {
    return gitDateExtractor.getStamps({
        outputToFile: false,
        projectRootPath: folder
    })
}