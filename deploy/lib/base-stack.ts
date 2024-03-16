import {Stack, CfnElement} from 'aws-cdk-lib';

/**
 * A base stack class that implements custom logical name
 * allocation. Adds a prefix if it is defined in the "prefix"
 * context key.
 *
 * Use `cdk --context prefix=PREFIX` to set the prefix.
 */
export class BaseStack extends Stack {
    public getAppStage(): string {
        const prefix = this.node.tryGetContext('prefix');
        return prefix ? prefix : '';
    }

    public allocateLogicalId(element: CfnElement) {
        const orig = super.allocateLogicalId(element);
        return this.getAppStage() + orig;
    }
}