#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Ec2Stack } from '../lib/ec2-stack';

const app = new cdk.App();
new Ec2Stack(app, 'InfraStack', {
    description: 'ec2 instance with iam roles and cfn url',
    stackName: 'ec2-instance-iam-role-example',
    env: {
        region: 'us-east-2',
    }
});
