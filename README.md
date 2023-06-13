# Create and configure ec2 with iam-roles and httpd using aws cdk

## What is aws-cdk? 
read more here  [aws-cdk](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

## How cdk works
This project is created by using 
`cdk init AppName --language=typescript` this command will create a 
folder structure and other needed files. `cdk.json` is the main file which points to entry path for the scripts
in most of the cases it is `/bin/infra.ts`

Other files are usual nodejs project to add/maintain dependencies.

## What all configuration is present in current scripts?
I have listed down all the config.
1. [VPC](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.Vpc.html): It contains code to create a new vpc or lookup a default vpc and use that to create instance.
2. [SecurityGroups](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SecurityGroup.html): Configure security ports enable outgress/ingress traffics
3. [Iam Role](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_iam-readme.html): It also create a new policy and add region based restricted permissions of other aws resources, so that we can access resources such as s3, rds and others without using access and secret key.
4. [AMI](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.AmazonLinuxImage.html): We can select the ami for ec2 instance from various options provided by aws-cdk, pretty much everything can be done which is available in the aws console.
5. [UserData](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.UserData.html): we can attach user data for the instance. Ec2 provides a way, through which we can install all the application libraries that we need to run our project. In this example I am updating libraries and installing httpd with a dummy file.

## How to run it?
[aws-cdk](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html) can be used as CI/CD tool, we can configure pipelines to automate our architecture creation and control all the configuration in one place.

I create `infra` repo for all the project that gets started and use infra scripts to manage infrastructure. More automation fewer worries.

I will the share steps to configure and run cdk on the local machine. 

run `aws-configure` command to configure your terminal to setup keys and region

run `cdk bootstrap` to configure cdk-toolkit in your aws-account, it will take keys from the above account and set up your aws-account
run
run `cdk deploy` to start the deployment of your configuration

run `cdk destroy` to destroy the entire stack when not needed, few things do not gets deleted because of their default retention policy, just watch out for those  

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
