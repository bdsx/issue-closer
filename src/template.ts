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
            if (requiredLines.delete(line)) continue;
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
}

export namespace Template {
    export enum Result {
        Matched,
        NotMatched,
        HasEgLine,
    }
}
