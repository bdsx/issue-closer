
import { Doc } from './doc';
import { testItems } from './test/testitems';

test('Template test', async()=>{
    let count = 0;
    await expect((async()=>{
        for await (const _ of Doc.templates(`${__dirname}`, 'ISSUE_TEMPLATE')) {}
    })()).rejects.toThrowError();

    for await (const template of Doc.templates(`${__dirname}/test`, 'ISSUE_TEMPLATE')) {
        for (const item of testItems) {
            const doc = Doc.parse('testitem', item.content);
            expect(doc.templateCheck(template)).toEqual(item.expectedResult);
        }
        count ++;
    }
    expect(count).not.toEqual(0);
});
