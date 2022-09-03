
import { Template } from './template';

const failedContext = `
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
`;
const rightContext = `
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
`;


test('Template test', async()=>{
    let count = 0;
    await expect((async()=>{
        for await (const _ of Template.getAll(`${__dirname}`, 'ISSUE_TEMPLATE')) {}
    })()).rejects.toThrowError();

    for await (const template of Template.getAll(`${__dirname}/test`, 'ISSUE_TEMPLATE')) {
        expect(template.check('')).toEqual(Template.Result.NotMatched);
        expect(template.check(failedContext)).toEqual(Template.Result.HasEgLine);
        expect(template.check(rightContext)).toEqual(Template.Result.Matched);
        count ++;
    }
    expect(count).not.toEqual(0);
});
