import * as core from '@actions/core';
import * as github from '@actions/github';
import { RestEndpointMethods } from '@octokit/plugin-rest-endpoint-methods/dist-types/generated/method-types';
import { Template } from './template';

async function run(): Promise<void> {
    try {
        // Get client and context
        const payload = github.context.payload;
        if (payload.action !== 'opened') {
            console.log('No issue or PR was opened, skipping');
            return;
        }

        if (payload.sender === undefined) {
            throw new Error('Internal error, no sender provided by GitHub');
        }

        if (payload.issue !== undefined) {
            await processEvent('ISSUE_TEMPLATE', payload.issue.body);
            return;
        }

        delete payload.sender;
        console.log(
            `Unexpected event ${Object.keys(payload).join(', ')}. skipping.`
        );
    } catch (error) {
        console.error(error.message);
        core.setFailed(error.message);
        return;
    }
}

async function processEvent(eventType: string, body: string | undefined): Promise<void> {
    if (body === undefined) {
        console.log('no body provided, skipping');
        return;
    }

    let reason:Template.Result = Template.Result.NotMatched;

    console.log('Read templates');
    for await (const template of Template.getAll(eventType)) {
        console.log('check');
        const res = template.check(body);
        if (res === Template.Result.Matched) return;
        if (res === Template.Result.HasEgLine) {
            reason = Template.Result.HasEgLine;
            break;
        }
    }

    console.log('prepare rest api');
    const payload = github.context.payload;
    let message = `@${payload.issue!.user.login} this issue was automatically closed because it did not follow the issue template`;
    
    switch (reason) {
    case Template.Result.HasEgLine:
        message += '\nPlease fill in the form.';
        break;
    case Template.Result.NotMatched:
        message += '\nPlease do not delete required items.';
        break;
    };
    
    // Add a comment to the appropriate place
    const issue = new Issue(createGitHubClient());
    console.log(`Issue number: ${github.context.issue.number}`);
    console.log(`Adding message: ${message.replace(/\n/g, '\n  ')}`);
    issue.comment(message);
    console.log('Closing');
    issue.close();
}

function createGitHubClient():RestEndpointMethods{
    return github.getOctokit(core.getInput('github-token', { required: true })).rest;
}

abstract class GitHubTarget {
    constructor(public readonly client:RestEndpointMethods) {
    }
    
    abstract comment(message:string):Promise<void>;
    abstract close():Promise<void>
}

class Issue extends GitHubTarget {
    async comment(message:string):Promise<void> {
        const issue = github.context.issue;
        await this.client.issues.createComment({
            owner: issue.owner,
            repo: issue.repo,
            issue_number: issue.number,
            body: message
        });
    }
    async close():Promise<void> {
        const issue = github.context.issue;
        await this.client.issues.update({
            owner: issue.owner,
            repo: issue.repo,
            issue_number: issue.number,
            state: 'closed'
        });
    }
}

class PullRequest extends GitHubTarget {
    async comment(message:string):Promise<void> {
        const issue = github.context.issue;
        await this.client.pulls.createReview({
            owner: issue.owner,
            repo: issue.repo,
            pull_number: issue.number,
            body: message,
            event: 'COMMENT'
        });
    }
    async close():Promise<void> {
        const issue = github.context.issue;
        await this.client.pulls.update({
            owner: issue.owner,
            repo: issue.repo,
            pull_number: issue.number,
            state: 'closed'
        });
    }
}
run();
