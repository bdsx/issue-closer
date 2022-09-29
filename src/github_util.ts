
import * as fs from 'fs';

export interface TemplateFile {
    name:string;
    content:string;
}

export async function* getAllTemplate(workspace:string, eventType: string): AsyncIterableIterator<TemplateFile> {
    let noTemplate = false;
    try {
        const content = await fs.promises.readFile(`${workspace}/.github/${eventType}.md`, 'utf8');
        yield {name:`${eventType}.md`, content};
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        noTemplate = true;
    }

    const dirpath = `${workspace}/.github/${eventType}`;
    let files: string[];
    try {
        files = await fs.promises.readdir(dirpath);
        files = files.filter(file=>file.endsWith('.md'));
    } catch (err) {
        if (err.code !== 'ENOENT') throw err;
        files = [];
    }
    if (files.length === 0 && noTemplate) throw Error(`${eventType} template not found`);

    for (const file of files) {
        const content = await fs.promises.readFile(`${dirpath}/${file}`, 'utf8');
        yield {name:file, content};
    }
}
