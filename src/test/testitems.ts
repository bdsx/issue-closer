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
},{
    expectedResult: MatchResult.Matched,
    content: `**Describe the bug (Required)**  
e.g. A clear and concise description of what the bug is.
Attempting to use \`bedrockServer.level.getStructureManager()\` fails

**To Reproduce (Required)**  
Steps to reproduce the behavior:  
e.g.   
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error
1.) Attempt to use bedrockServer.level.getStructureManager()

**Expected behavior**  
e.g. A clear and concise description of what you expected to happen.
Getting the structure manager for the server

**Error logs**  
e.g. If applicable, add logs to help explain your problem.
Error: StructureManager is not constructible. it needs to provide the constructor or the destructor for using them
   at abstractClassError (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\nativeclass.ts:968:5)
   at NativeClass.prototype.construct (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\nativeclass.ts:389:13)
   at NativeClass.construct (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\nativeclass.ts:411:9)
   at Level.prototype.getStructureManager (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\bds\\level.ts:144:9)
   at Anonymous function (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\index.ts:19:9)
   at CustomCommandImpl.prototype.execute (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\command.ts:124:21)
   at Anonymous function (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\command.ts:180:13)
   at Anonymous function (Function code:8:1)
   at Anonymous function (Function code:9:1)
   at executeCommand (C:\\Users\\grape\\Documents\\Commissions\\VillagerFactions\\bdsx\\command.ts:29:13)
   at Anonymous function (Function code:9:1)

**Environment**  
 - OS: Windows 11
 - Version 1.19.50.2

**Additional context**  
e.g. Add any other context about the problem here.
`,
}];
