import { MatchResult } from "../matchres";

export interface TestItem {
    expectedResult:MatchResult;
    content:string;
}

export const testItems:TestItem[] = [{
    expectedResult: MatchResult.NotMatched,
    content: ``,
},{
    expectedResult: MatchResult.NotMatched,
    content: `
**Anything**
abcdefg
`,
},{
    expectedResult: MatchResult.ContentNotChanged,
    content: `
**Describe the bug (Required)**  
e.g. A clear and concise description of what the bug is.

**To Reproduce (Required)**  
Steps to reproduce the behavior:  
e.g.   
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**  
e.g. A clear and concise description of what you expected to happen.

**Error logs**  
e.g. If applicable, add logs to help explain your problem.

**Environment**  
 - OS: [e.g. iOS]
 - Version [e.g. 22]

**Additional context**  
ex) Add any other context about the problem here.
`,
},{
    expectedResult: MatchResult.Matched,
    content: `
**Describe the bug (Required)**  

**To Reproduce (Required)**  
Steps to reproduce the behavior:  
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**  

**Error logs**  

**Environment**  
    - OS: [e.g. iOS]
    - Version [e.g. 22]

**Additional context**  
`,
}];
