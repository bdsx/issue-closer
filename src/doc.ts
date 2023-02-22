import { LineReader } from "./linereader";
import { getAllTemplate } from "./github_util";
import { MatchResult } from "./matchres";

function removeFromArray<T>(array:T[], filter:(item:T)=>boolean):void {
    let srcidx = 0;
    while (srcidx < array.length) {
        if (filter(array[srcidx])) {
            srcidx++;
            continue;
        }
        let dstidx = srcidx++;
        while (srcidx < array.length) {
            const src = array[srcidx++];
            if (filter(src)) {
                array[dstidx++] = src;
            }
        }
        array.length = dstidx;
        break;
    }
}
function arrayEquals(array1:any[], array2:any[]):boolean {
    const n = array1.length;
    if (n !== array2.length) return false;
    for (let i=0;i<n;i++) {
        if (array1[i] !== array2[i]) return false;
    }
    return true;
}

export class Doc {
    public readonly items:Doc.Item[] = [];

    constructor(public readonly name:string) {
    }

    findItem(subject:string):Doc.Item|null {
        for (const item of this.items) {
            if (item.subject === subject) return item;
        }
        return null;
    }

    removeItems(filter:(item:Doc.Item)=>boolean):void {
        removeFromArray(this.items, filter);
    }

    templateCheck(template:Doc):MatchResult {
        for (const templateItem of template.items) {
            const item = this.findItem(templateItem.subject);
            if (item === null) return MatchResult.NotMatched;
            if (item.contentEquals(templateItem)) { // content not changed
                return MatchResult.ContentNotChanged;
            }
        }
        return MatchResult.Matched;
    }

    static parse(name:string, content:string):Doc {
        const doc = new Doc(name);
        const lines = new LineReader(content);
        let item:Doc.Item|null = null;

        for (;;) {
            let line = lines.readLine();
            if (line === null) break;
            line = line.trim();
            if (line === '') continue;
            if (/^\*\*.+\*\*\?$/.test(line) || line.startsWith('#')) {
                item = new Doc.Item(line);
                doc.items.push(item);
            } else {
                if (item === null) continue;
                item.lines.push(line);
            }
        }
        return doc;
    }
    
    static async * templates(workspace:string, eventType: string): AsyncIterableIterator<Doc> {
        for await (const {name, content} of getAllTemplate(workspace, eventType)) {
            const doc = Doc.parse(name, content);
            doc.removeItems(item=>{
                const required = item.subject.toLocaleLowerCase().indexOf('(required)') !== -1;
                return required;
            });
            yield doc;
        }
    }
}

export namespace Doc {
    export class Item {
        public readonly lines:string[] = [];

        constructor(public readonly subject:string) {
        }

        contentEquals(other:Item):boolean {
            return arrayEquals(this.lines, other.lines);
        }
    }
}