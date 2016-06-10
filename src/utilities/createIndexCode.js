import _ from 'lodash';
import fs from 'fs';
import path from 'path';

const safeVariableName = (fileName) => {
    const indexOfDot = fileName.indexOf('.');

    if (indexOfDot === -1) {
        return fileName;
    } else {
        return fileName.slice(0, indexOfDot);
    }
};

const buildExportBlock = (files, directoryPath) => {
    let importBlock;

    importBlock = _.map(files, (fileName) => {
        let block = safeVariableName(fileName);

        if( directoryPath ){
            const absolutePath = path.resolve(directoryPath, fileName);
            const isDirectory = fs.statSync(absolutePath).isDirectory();

            if( isDirectory ){
                block = '* as ' + block;                      
            }
        }

        return 'export ' + block + ' from \'./' + fileName + '\';';
    });

    importBlock = importBlock.join('\n');

    return importBlock;
};

export default (filePaths, directoryPath) => {
    let code;

    code = '\'create index\';\n\n';

    if (filePaths.length) {
        const sortedFilePaths = filePaths.sort();
        code += buildExportBlock(sortedFilePaths, directoryPath) + '\n\n';
    }

    return code;
};
