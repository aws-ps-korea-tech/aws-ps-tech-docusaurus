---
title: Troubleshooting for AWS Batch & Nextflow
sidebar_position: 3
---

**CannotPullImageManifestError: Error response from daemon: manifest unknown: manifest unknown **

[\![\](/img/aws-batch/XGOimage.png)](/img/aws-batch/XGOimage.png){target="_blank" rel="noopener"}

[\![\](/img/aws-batch/GyXimage.png)](/img/aws-batch/GyXimage.png){target="_blank" rel="noopener"}

**Solution**

Check your docker image.

[\![\](/img/aws-batch/screenshot-2024-12-26-at-9-41-27-pm.png)](/img/aws-batch/screenshot-2024-12-26-at-9-41-27-pm.png){target="_blank" rel="noopener"}

**bash: aws: command not found**

[\![\](/img/aws-batch/3aiimage.png)](/img/aws-batch/3aiimage.png){target="_blank" rel="noopener"}

**Solution**

Check your container image has the aws cli program.

<https://www.nextflow.io/docs/latest/aws.html#custom-ami>

 

 

**ERROR \~ Pipeline failed. Please refer to troubleshooting docs: <https://nf-co.re/docs/usage/troubleshooting>**

 

[\![\](/img/aws-batch/Dvrimage.png)](/img/aws-batch/Dvrimage.png){target="_blank" rel="noopener"}

Solution

Check the .nextflow.log file content. There may be various causes, but this appears to be because the token has expired. 

[\![\](/img/aws-batch/screenshot-2024-12-29-at-12-23-07-am.png)](/img/aws-batch/screenshot-2024-12-29-at-12-23-07-am.png){target="_blank" rel="noopener"}
