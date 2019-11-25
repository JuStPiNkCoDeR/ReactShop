import HTMLTricks from './HTMLTricks';

function checkMIME(required: string, file: File): boolean {
    let isValide: boolean = true;

    if (file) {
        let neededType = required.split('/');
        let fileType = file.type.split('/');

        for (let i = 0; i < neededType.length; i++) {
            let part = neededType[i].toLowerCase();
            if (part === '*') continue;

            if (part !== fileType[i]) isValide = false;
        }
    } else isValide = false;

    return isValide;
}

export default {
    convertHTMLtoText(str: string): string {
        return HTMLTricks.encodeHTML(str);
    },
    checkMIMEType(cond: string, files: Array<File> | File): Array<File> | File | null {
        let valideFiles: Array<File> | File | null = null;

        if (Array.isArray(files)) {
            valideFiles = [];
            for (let i = 0; i < files.length; i++) {
                let file = files[i];

                if (checkMIME(cond, file)) valideFiles.push(file);
            }
        } else
            if (checkMIME(cond, files)) valideFiles = files;

        return valideFiles;
    }
}