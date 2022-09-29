import { getAllTemplate } from './github_util';
import { LineReader } from "./linereader";
import { MatchResult } from './matchres';

export class Template {
    private readonly requiredLines: string[] = [];
    private readonly needToRemoves = new Set<string>();
    private readonly needToRemovesNextLine = new Set<string>();

    constructor(public readonly name:string, content: string) {
        const lines = new LineReader(content);
        
        let requiredLine = false;

        for (;;) {
            const line = lines.readLine();
            if (line === null) break;
            if (/^\*\*.+\*\*$/.test(line)) {
                if (line.toLocaleLowerCase().indexOf('(required)') !== -1) {
                    this.requiredLines.push(line);
                    requiredLine = true;
                } else {
                    requiredLine = false;
                }
                continue;
            } 
            if (requiredLine) {
                if (line.startsWith('e.g.') || line.startsWith('ex)')) {
                    if (line === 'e.g.' || line === 'ex)') {
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

    check(content: string): MatchResult {
        const requiredLines = new Set(this.requiredLines);
        const lines = new LineReader(content);
        let hasEgLine = false;
        for (;;) {
            const line = lines.readLine();
            if (line === null) break;
            if (requiredLines.delete(line)) {
                continue;
            }
            if (this.needToRemoves.has(line)) {
                hasEgLine = true;
                continue;
            }
            if (line === 'e.g.' || line === 'ex)') {
                const nextLine = lines.readLine();
                if (nextLine === null) break;
                if (this.needToRemovesNextLine.has(nextLine)) {
                    hasEgLine = true;
                    continue;
                }
            }
        }
        if (requiredLines.size !== 0) return MatchResult.NotMatched;
        if (hasEgLine) return MatchResult.ContentNotChanged;
        return MatchResult.Matched;
    }

    static async * getAll(workspace:string, eventType: string): AsyncIterableIterator<Template> {
        for await (const {name, content} of getAllTemplate(workspace, eventType)) {
            yield new Template(name, content);
        }
    }
    
}
