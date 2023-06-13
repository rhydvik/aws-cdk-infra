import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam'
import {PolicyStatement} from "aws-cdk-lib/aws-iam";

export class Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this is not working as of now, so create a file manually in console
    // const cfnKeyPair = new ec2.CfnKeyPair(this, 'MyCfnKeyPair', {
    //   keyName: 'ec2-iam-example',
    //   tags: [{
    //     key: 'key',
    //     value: 'value',
    //   }],
    // });


    // create a vpc first so that we can create an instance inside that vpc
    const vpc = new ec2.Vpc(this, 'VPC', {
      natGateways: 0,
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'dawn',
        subnetType: ec2.SubnetType.PUBLIC
      }]
    });


    // allow ssh configuration
    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc,
      description: 'Allow SSH (TCP port 22) in',
      allowAllOutbound: true
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access')


    // iam role
    const role = new iam.Role(this, 'ec2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    })

    // creating/attaching policy to roles which will go to ec2 instance config
    role.addToPolicy(new PolicyStatement({
      resources: ['*'],
      actions: ['s3:*', 'rds:*'],
      conditions: {
        StringEquals: {
          'aws:RequestedRegion': 'us-east-2'
        }
      }
    }))


    // ami selection
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.ARM_64
    });

    // ec2 creation
    const ec2Instance = new ec2.Instance(this, 'instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      machineImage: ami,
      role: role,
      keyName: 'ec2-iam-example',
      securityGroup: securityGroup,
    });

    new cdk.CfnOutput(this, 'IP Address', { value: ec2Instance.instancePublicIp });
    // new cdk.CfnOutput(this, 'Download Key Command', { value: 'aws secretsmanager get-secret-value --secret-id ec2-ssh-key/ec2-iam-example/private --query SecretString --output text > cdk-key.pem && chmod 400 cdk-key.pem' })
    new cdk.CfnOutput(this, 'ssh command', { value: `ssh -i ec2-iam-example -o IdentitiesOnly=yes ec2-user@` + ec2Instance.instancePublicIp })
  }
}
