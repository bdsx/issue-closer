
export class LineReader {
    private index = 0;
    public lineNumber = 0;

    constructor(
        private readonly content:string,
    ) {
    }

    readLine():string|null {
        const next = this.content.indexOf('\n', this.index);
        if (next === -1) {
            this.index = this.content.length;
            return null;
        }
        const out = this.content.substring(this.index, next);
        this.index = next+1;
        this.lineNumber++;
        return out.trim();
    }

    readLinesTo(target:string):string[] {
        const out:string[] = [];
        for (;;) {
            const line = this.readLine();
            if (line === null) break;
            if (line === target) break;
            out.push(line);
        }
        return out;
    }
}
