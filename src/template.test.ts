
import { Template } from './template';
import { testItems } from './test/testitems';

test('Template test', async()=>{
    let count = 0;
    await expect((async()=>{
        for await (const _ of Template.getAll(`${__dirname}`, 'ISSUE_TEMPLATE')) {}
    })()).rejects.toThrowError();

    for await (const template of Template.getAll(`${__dirname}/test`, 'ISSUE_TEMPLATE')) {
        for (const item of testItems) {
            expect(template.check(item.content)).toEqual(item.expectedResult);
        }
        count ++;
    }
    expect(count).not.toEqual(0);
});
