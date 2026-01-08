---
title: "Quickstart Hail (English)"
sidebar_position: 4
---

#  

Deploy an [EMR cluster on AWS](https://aws.amazon.com/emr/), with Spark, [Hail](https://hail.is/index.html), [Zeppelin](https://zeppelin.apache.org/) and [Ensembl VEP](https://ensembl.org/info/docs/tools/vep/index.html) using CloudFormation service.

This tool requires the following programs to be previously installed in your computer:\

- Amazon\'s `Command Line Interface (CLI)` utility
- Git

To install the required software open a terminal and execute the following:

For Mac:

``` 
# Installs homebrew
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# Installs AWS CLI
brew install awscli
```

For Debian / Ubuntu (apt-get):

``` 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

sudo apt-get install -y git
```

For Fedora (dnf/yum):

``` 
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

sudo dnf install git # or sudo yum install git
```

For Amazon Linux 2023:

``` 
sudo dnf install git
```

# CloudFormation stack preparation 

1\. Prepare the AWS credentials and apply them in the terminal. \

``` 
Export AWS_DEFAULT_REGION=""
Export AWS_ACCESS_KEY_ID=""
Export AWS_SECRET_ACCESS_KEY=""
Export AWS_SESSION_TOKEN=""
```

2\. Create an S3 bucket in the region where you want to launch this CloudFormation stack.

``` 
aws s3 mb s3:// --region 
```

Download and unzip the content from this repository, then place the downloaded content into the S3 bucket you created earlier.

``` 
Export AWS_BUCKET=
git clone https://github.com/hmkim/quickstart-hail.git
cd quickstart-hail
aws s3 sync . s3://$AWS_BUCKET/quickstart-hail/ --exclude ".git/*"
```

3\. Connect to the Amazon S3 console and check the bucket and directory.

![이미지](/img/omics-on-aws/uaCimage.png)

\

# Run the CloudFormation stack 

1\. Go to the [CloudFormation](https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1) console.\

\![이미지](/img/omics-on-aws/wADscreenshot-2024-06-21-at-10-26-55-pm.png)

2\. Creates a new stack. At this time, select **`With new resources (standard)`**.\

\![이미지](/img/omics-on-aws/M7Hscreenshot-2024-06-21-at-10-27-22-pm.png)

3\. Go to the Amazon S3 console, select `hail-launcher.template.yaml` in the template directory you uploaded earlier, and click **`Copy URL`**. The path is as follows:

** \> quickstart-hail \> templates \> hail-launcher.template.yaml**

![이미지](/img/omics-on-aws/image.png)

When creating a CloudFormation stack, enter this URL and create the stack.

![이미지](/img/omics-on-aws/Whlimage.png)

4\. Proceed with entering information to create a stack.\

Type an name for the stack.

![이미지](/img/omics-on-aws/JI3image.png)

Select a VPC. Select one subnet within the same VPC. For this exercise, select public.

\![이미지](/img/omics-on-aws/Yhguntitled-2.png)

Let\'s set it up to create additional buckets as needed.

Enter the name of the existing bucket where the `quickstart-hail` folder was uploaded, and check the region.

Here, the bucket name `awsimd-us-east-1` was used, and the `Hail S3 bucket name` and `Sagemaker home directory S3 bucket name` were suffixed with `-s3` and `-sm`, respectively. Modify the bucket names as appropriate.\

\![이미지](/img/omics-on-aws/kRNuntitled-3.png)

\![이미지](/img/omics-on-aws/Gn9untitled-4.png)

5\. Finally, press the **`Next`** button to create the stack.

\![이미지](/img/omics-on-aws/el0untitled-5.png)

\![이미지](/img/omics-on-aws/SZ9untitled-6.png)

6\. Check stack creation in CloudFormation.

\![이미지](/img/omics-on-aws/Y8muntitled-7.png)

If the following portfolio appears in the output along with the **`CREATE_COMPLETE`** message in the top stack, you can confirm that it was executed correctly.

\![이미지](/img/omics-on-aws/ejCuntitled-8.png)

# Create an AMI for Hail and VEP 

## Pre-downloading VEP Data and Storing in Bucket 

For VEP, you can pre-download the data and store it in the bucket created or specified through the stack (using the `bucketHail` value from CloudFormation\'s Outputs).\

![이미지](/img/omics-on-aws/jY3image.png)

\![이미지](/img/omics-on-aws/eELuntitled-10.png)

Download VEP data using the wget command:\

``` 
wget ftp://ftp.ensembl.org/pub/release-112/variation/vep/homo_sapiens_vep_112_GRCh37.tar.gz
```

Upload the downloaded file to your bucket: ([I emphasize that this is the value for the `BucketHail` key confirmed in CloudFormation Outputs])\

``` 
aws s3 cp homo_sapiens_vep_112_GRCh37.tar.gz s3:///vep/cache/
```

## AMI Build  

1\. Access the [CodeBuild console](https://us-east-1.console.aws.amazon.com/codesuite/codebuild/projects?region=us-east-1) and initiate the build process for each new AMI. Select Start build \> Start with overrides.

![이미지](/img/omics-on-aws/t6qimage.png)

![이미지](/img/omics-on-aws/zwjimage.png)

2\. In the Environment section, expand Additional configuration and input the required values.\

![이미지](/img/omics-on-aws/Nz5image.png)

![이미지](/img/omics-on-aws/6rnimage.png)

  HAIL_VERSION       0.2.105
  ------------------ ---------
  HTSLIB_VERSION     1.20
  SAMTOOLS_VERSION   1.20

\* For building with hail-vep option (includes VEP installation):\

  ---------------------------------------------------------------------------------------------------
  HAIL_VERSION                        0.2.105
  ----------------------------------- ---------------------------------------------------------------
  HTSLIB_VERSION                      1.20

  SAMTOOLS_VERSION                    1.20

  VEP_VERSION                         107

  **RODA_BUCKET**                     **value for the `BucketHail` key in CloudFormation Outputs\**
  ---------------------------------------------------------------------------------------------------

![이미지](/img/omics-on-aws/rYGimage.png)

3\. Check the build status in CodeBuild\

**Hail (without VEP):** The Hail image build completes in about 20 minutes.

![이미지](/img/omics-on-aws/9Wlimage.png)

![이미지](/img/omics-on-aws/VdYimage.png)

**Hail (VEP)**: The VEP version build takes approximately 1 hour and 38 minutes to complete.\

\![이미지](/img/omics-on-aws/I3Cscreenshot-2024-06-24-at-9-31-00-am.png)

\![이미지](/img/omics-on-aws/KxIscreenshot-2024-06-24-at-9-31-12-am.png)

You can find the \*\*AMI results\*\* in either the AMI menu of [Amazon EC2 console](https://console.aws.amazon.com/ec2/) or CodeBuild logs.

![이미지](/img/omics-on-aws/IgJimage.png)

# **EMR Cluster Setup and Jupyter Environment Configuration** 

## EMR Cluster Setup 

1\. In the CloudFormation service console\'s Outputs tab, click the portfolio.

![이미지](/img/omics-on-aws/9emimage.png)

2\. In the portfolio of AWS Service Catalog, locate the relevant Product, click the Access tab, then select Grant access.\

![이미지](/img/omics-on-aws/qjKimage.png)

3\. Add permissions. Check the user that suits you and grant them access to Hail Products. Search for it, select it, and click Grant access.\

![이미지](/img/omics-on-aws/A2zimage.png)

![이미지](/img/omics-on-aws/0lWimage.png)

4\. After confirming access permissions, navigate to the Product in the Provisioning menu.\

![이미지](/img/omics-on-aws/UvRimage.png)

5\. With permissions granted, you should now see 2 Products listed.\

![이미지](/img/omics-on-aws/ZYiimage.png)

6\. Select the Hail EMR Cluster product and click Launch product.\

\![이미지](/img/omics-on-aws/MLountitled-19.png)

7\. Enter the required launch information.\

Either enter a name manually or click Generate name.\

\![이미지](/img/omics-on-aws/ubMuntitled-20.png)

Specify the Hail AMI you created earlier. You can find the AMI ID in the EC2 service\'s AMIs section (as previously described).\

\![이미지](/img/omics-on-aws/jHsuntitled-21.png)

Input the Cluster name and Hail AMI ID. You can leave all other settings at their default values.\

\![이미지](/img/omics-on-aws/sEGuntitled-22.png)

8\. Click Launch product at the bottom of the page.\

\![이미지](/img/omics-on-aws/nz9screenshot-2024-07-08-at-11-47-56-am.png)

## SageMaker Notebook Setup 

1\. Similarly, select Launch product in the Product menu.\

![이미지](/img/omics-on-aws/p2Eimage.png)

2\. Provide a name for your Hail notebook instance. Keep all other settings at their defaults.\

\![이미지](/img/omics-on-aws/Ro2untitled-24.png)

3\. Click Launch product at the bottom of the page.\

\![이미지](/img/omics-on-aws/PcJscreenshot-2024-07-08-at-11-47-56-am.png)

*\*Note: You can monitor the product deployment progress through CloudFormation.\*

![이미지](/img/omics-on-aws/CrLimage.png)

## numpy reinstall 

The issue occurs when running as it is currently. **As of Mar 14, 2025**

Therefore, it is necessary to check the cluster created by Amazon EMR as shown below, connect to the Primary instance, delete and reinstall the numpy module.

![이미지](/img/omics-on-aws/image.png)

![이미지](/img/omics-on-aws/sxXimage.png)![이미지](/img/omics-on-aws/xd0image.png)

![이미지](/img/omics-on-aws/opximage.png)

``` 
sudo python3 -m pip uninstall -y numpy

sudo python3 -m pip install  numpy -U
```

\

# GWAS Practice using Hail 

1\. Launch your notebook. Find the URL in CloudFormation\'s Outputs tab. Clicking it will automatically connect you to your notebook instance in Amazon SageMaker.\

\![이미지](/img/omics-on-aws/8BOuntitled-26.png)

2\. Select Open JupyterLab to start the notebook interface.\

\![이미지](/img/omics-on-aws/XaHuntitled-27.png)

3\. We\'ll work with two notebooks in this practice session:\

- common-notebooks/plotting-tutorail.ipynb
- common-notebooks/GWAS-tutorial.ipynb

\![이미지](/img/omics-on-aws/G4vscreenshot-2024-06-24-at-3-26-55-pm.png)

Locate your previously created EMR cluster and update the Cluster Name in the second cell.

You can execute notebook cells in sequence by placing your cursor in the cell where you want to begin.

\![이미지](/img/omics-on-aws/S5uuntitled-28.png)

When the tutorial code runs successfully, you should see results similar to these:

\![이미지](/img/omics-on-aws/Eevscreenshot-2024-07-08-at-12-21-50-pm.png)

\![이미지](/img/omics-on-aws/QUfuntitled-29.png)

\![이미지](/img/omics-on-aws/mCzscreenshot-2024-07-08-at-12-22-18-pm.png)

# Additional Information 

## VEP configuration 

In the S3 bucket, select the json file object and click Copy S3 URI.\

\![이미지](/img/omics-on-aws/untitled-30.png)

Ex: vep-configuration-GRCh37.json\

``` 
,
    "vep_json_schema": "Struct],context:String,end:Int32,id:String,input:String,intergenic_consequences:Array[Struct],most_severe_consequence:String,motif_feature_consequences:Array[Struct],regulatory_feature_consequences:Array[Struct],seq_region_name:String,start:Int32,strand:Int32,transcript_consequences:Array[Struct],exon:String,gene_id:String,gene_pheno:Int32,gene_symbol:String,gene_symbol_source:String,hgnc_id:String,hgvsc:String,hgvsp:String,hgvs_offset:Int32,impact:String,intron:String,lof:String,lof_flags:String,lof_filter:String,lof_info:String,minimised:Int32,polyphen_prediction:String,polyphen_score:Float64,protein_end:Int32,protein_start:Int32,protein_id:String,sift_prediction:String,sift_score:Float64,strand:Int32,swissprot:String,transcript_id:String,trembl:String,tsl:Int32,uniparc:String,variant_allele:String}],variant_class:String}"
}
```

You can modify and implement the following content in the **[vep-tutorial](https://github.com/hmkim/quickstart-hail/blob/main/sagemaker/common-notebooks/vep-tutorial.ipynb)** code using the S3 object URI you copied above.

\![이미지](/img/omics-on-aws/screenshot-2024-07-11-at-11-07-00-am.png)

## VEP Plugin Installation 

If you need to modify VEP plugin installations (additions, etc.), you\'ll need to rebuild the AMI. The VEP installation code is in **[vep_install.sh](https://github.com/hmkim/quickstart-hail/blob/main/packer-files/scripts/vep_install.sh)**. Modify this script and rebuild the AMI as needed.

For customizing Hail, VEP tool installation, and AMI building, refer to these resources:

##  

- [Hail AMI Creation via AWS CodeBuild](https://github.com/hmkim/quickstart-hail/blob/main/docs/hail-ami.md)
- [vep-install.md](https://github.com/hmkim/quickstart-hail/blob/main/docs/vep-install.md)
- [Building a Custom Hail AMI](https://github.com/hmkim/quickstart-hail/blob/main/docs/ami-creation.md)

## Dynamically Expanding EMR Cluster EBS (HDFS) Volume  

When working with large datasets, you may find the initially configured cluster volume capacity insufficient. You can dynamically expand the EBS volume by following the guidance in this blog post:\

[[]]

## FAQ 

### Codebuild 

CLIENT_ERROR: error while downloading key ami/packer-files.zip, error: RequestError: send request failed caused by: Get \"https://.s3.amazonaws.com/ami/packer-files.zip\": dial tcp 3.5.30.46:443: i/o timeout for primary source\
