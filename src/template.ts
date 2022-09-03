import * as fs from 'fs';
import * as path from 'path';
import { LineReader } from "./linereader";

export class Template {
    private readonly requiredLines: string[] = [];
    private readonly needToRemoves = new Set<string>();
    private readonly needToRemovesNextLine = new Set<string>();

    constructor(content: string) {
        const lines = new LineReader(content);
        
        let requiredLine = false;

        for (;;) {
            const line = lines.readLine();
            if (line === null) break;
            if (/^\*\*.+\*\*$/.test(line)) {
                if (line.indexOf('(required)') !== -1) {
                    console.log(`required line, target: ${line}`);
                    this.requiredLines.push(line);
                    requiredLine = true;
                } else {
                    requiredLine = false;
                }
                continue;
            } 
            if (requiredLine) {
                if (/^e\.g\..+$/.test(line)) {
                    if (line === 'e.g.') {
                        const nextLine = lines.readLine();                    
                        if (nextLine === null) break;
                        this.needToRemovesNextLine.add(nextLine);
                    } else {
                        this.needToRemoves.add(line);
                    }
                    continue;
                }
                if (/\[e\.g\.[^\]]*\]/.test(line)) {
                    this.needToRemoves.add(line);
                    continue;
                }
            }
        }
    }

    check(content: string): Template.Result {
        const requiredLines = new Set(this.requiredLines);
        const lines = new LineReader(content);
        let hasEgLine = false;
        for (;;) {
            const line = lines.readLine();
            if (line === null) break;
            if (requiredLines.delete(line)) {
                console.log(`required line, pass: ${line}`);
                continue;
            }
            if (this.needToRemoves.has(line)) {
                hasEgLine = true;
                continue;
            }
            if (line === 'e.g.') {
                const nextLine = lines.readLine();
                if (nextLine === null) break;
                if (this.needToRemovesNextLine.has(nextLine)) {
                    hasEgLine = true;
                    continue;
                }
            }
        }
        if (requiredLines.size !== 0) return Template.Result.NotMatched;
        if (hasEgLine) return Template.Result.HasEgLine;
        return Template.Result.Matched;
    }

    static async * getAll(eventType: string): AsyncIterableIterator<Template> {
        const workspace = process.env.GITHUB_WORKSPACE;
        let noTemplate = false;
        try {
            console.log(`read ${workspace}/.github/${eventType}.md`);
            const content = await fs.promises.readFile(`${workspace}/.github/${eventType}.md`, 'utf8');
            console.log(`create template`);
            yield new Template(content);
        } catch (err) {
            console.log(`failed to read`);
            if (err.code !== 'ENOENT') throw err;
            noTemplate = true;
        }
    
        const dirpath = `${workspace}/.github/${eventType}`;
        let files: string[];
        try {
            console.log(`read dirs`);
            files = await fs.promises.readdir(dirpath);
        } catch (err) {
            console.log(`failed to read`);
            if (err.code !== 'ENOENT') throw err;
            files = [];
            return;
        }
        if (files.length === 0 && noTemplate) throw Error(`${eventType} template not found`);
    
        for (const file of files) {
            console.log(`read ${dirpath}/${file}`);
            const content = await fs.promises.readFile(`${dirpath}/${file}`, 'utf8');
            console.log(`create template`);
            yield new Template(content);
        }
        console.log(`done`);
    }
    
}


export namespace Template {
    export enum Result {
        Matched,
        NotMatched,
        HasEgLine,
    }
}
