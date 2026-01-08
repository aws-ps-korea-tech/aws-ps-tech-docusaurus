---
title: "Troubleshooting for AWS Batch & Nextflow"
sidebar_position: 3
---

**CannotPullImageManifestError: Error response from daemon: manifest unknown: manifest unknown **

![이미지](/img/aws-batch/XGOimage.png)

![이미지](/img/aws-batch/GyXimage.png)

**Solution**

Check your docker image.

![이미지](/img/aws-batch/screenshot-2024-12-26-at-9-41-27-pm.png)

**bash: aws: command not found**

![이미지](/img/aws-batch/3aiimage.png)

**Solution**

Check your container image has the aws cli program.

**ERROR \~ Pipeline failed. Please refer to troubleshooting docs: **

![이미지](/img/aws-batch/Dvrimage.png)

Solution

Check the .nextflow.log file content. There may be various causes, but this appears to be because the token has expired. 

![이미지](/img/aws-batch/screenshot-2024-12-29-at-12-23-07-am.png)
