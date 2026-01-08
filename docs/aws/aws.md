---
title: "AWS 계정 안전하게 지키기"
sidebar_position: 0
---

### [[ ]] 

[AWS Well-Architected](https://www.aws-ps-tech.kr/AWS%20Well-Architected%20%20helps%20cloud%20architects%20build%20a%20secure,%20high-performing,%20resilient,%20and%20efficient%20infrastructure%20for%20their%20applications%20and%20workloads.%20The%20Security%20Baseline%20Workshop%20aligns%20to%20the%20security%20pillar%20%20%20of%20the%20AWS%20Well-Architected%20Framework.%20The%20security%20pillar%20describes%20how%20to%20take%20advantage%20of%20cloud%20technologies%20to%20protect%20data,%20systems,%20and%20assets%20in%20a%20way%20that%20can%20improve%20your%20security%20posture.%20This%20helps%20you%20meet%20your%20business%20and%20regulatory%20requirements%20by%20following%20current%20AWS%20recommendations.%20%20You%20can%20assess%20your%20adherence%20to%20Well-Architected%20best%20practices%20using%20the%20Well-Architected%20Tool%20%20%20in%20your%20AWS%20account.%20%20Security%20and%20compliance%20are%20a%20shared%20responsibility%20between%20AWS%20and%20the%20customer.%20The%20shared%20responsibility%20model%20%20is%20often%20described%20by%20saying%20that%20AWS%20is%20responsible%20for%20the%20security%20of%20the%20cloud%20(that%20is,%20for%20protecting%20the%20infrastructure%20that%20runs%20all%20the%20services%20offered%20in%20the%20AWS%20Cloud),%20and%20you%20are%20responsible%20for%20the%20security%20in%20the%20cloud%20(as%20determined%20by%20the%20AWS%20Cloud%20services%20that%20you%20select).%20In%20the%20shared%20responsibility%20model,%20implementing%20the%20security%20controls%20in%20this%20document%20is%20part%20of%20your%20responsibility%20as%20a%20customer.) helps cloud architects build a secure, high-performing, resilient, and efficient infrastructure for their applications and workloads. The Security Baseline Workshop aligns to the [security pillar](https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html) of the AWS Well-Architected Framework. The security pillar describes how to take advantage of cloud technologies to protect data, systems, and assets in a way that can improve your security posture. This helps you meet your business and regulatory requirements by following current AWS recommendations.

You can assess your adherence to Well-Architected best practices using the [Well-Architected Tool](https://console.aws.amazon.com/wellarchitected/) in your AWS account.

Security and compliance are a shared responsibility between AWS and the customer. The [shared responsibility model](http://aws.amazon.com/compliance/shared-responsibility-model/) \
is often described by saying that AWS is responsible for the security of the cloud (that is, for protecting the infrastructure that runs all the services offered in the AWS Cloud), and you are responsible for the security in the cloud (as determined by the AWS Cloud services that you select). In the shared responsibility model, implementing the security controls in this document is part of your responsibility as a customer.

![이미지](/img/aws/module-0-image-2.jpg)

### [[1. MFA on Root account]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

[[슈퍼 권한이 있는 Root Account는 비밀번호는 특히 중요합니다. 사고로 비밀번호가 노출 되더라도 MFA 를 설정해 놓으면 로그인 시 MFA 장치가 없는 경우 최종 로그인이 실패하기 때문에 더 안전하게 AWS 계정을 지킬 수 있습니다.]]

[[간혹, 다른 사이트에서 사용하는 계정의 비밀번호와, Root Account의 비밀번호가 동일하게 이용하시다가, 다른 사이트 사용자 계정의 비밀번호가 노출되어 Root Account가 침해되는 사례가 있었습니다.]]

[[[Action Plan - Protect the Root User 구성 가이드 ]]](https://catalog.workshops.aws/startup-security-baseline/en-US/b-securing-your-account/2-protect-root-user)

[[[10분안에 정복하는 안전한 계정 관리를 위한 IAM 모범 사례 ]]](https://www.youtube.com/watch?v=pDg7qxQMNFo)

[[[​]]]

### [[2. Amazon S3 Bucket Permissions]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

[[공개 액세스 권한이 있거나, Any Authenticated AWS User 에 대한 액세스를 허용하는 S3 버킷을 확인합니다.]]

[[공개 액세스 접근으로 노출된 S3는 IAM \> Access Analyzer 메뉴에서 확인하시기 바랍니다. 의도되지 않은 경우 권한을 제한 하는 것을 권장합니다.]]

[[관리자 권한을 가지고 있지 않은 경우, S3 Bucket 생성, 삭제, 설정 변경 권한을 제한하시기 바랍니다.]]

[[[Action Plan - Prevent Public Access to Private S3 Buckets 구성 가이드]]](https://catalog.workshops.aws/startup-security-baseline/en-US/b-securing-your-account/6-block-public-access-s3)

[[[Action Plan - 공개 액세스 접근으로 노출된 S3 버킷 확인]]](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-analyzer.html)

[[[​]]]

### [[3. Security Groups - Specific Ports Unrestricted]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

[[필요한 IP 주소로만 액세스를 제한하시기 바랍니다.]]

[[더 제한적인 규칙을 만든 후에는 지나치게 허용되는 규칙을 삭제해야 합니다. 예를 들어 SSH 액세스 허용을 위한 22 Port라던가, MySQL 3306 Port등은 불특정 다수 (0.0.0.0/0) 에 규칙은 실제 접근이 필요한 IP만 구별하여 설정하시고, 해당 설정은 삭제하시기 바랍니다.]]

### [[4. CloudTrail]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

[[감사 목적으로 Trail 정보를 S3에 저장합니다. ]]

[[[Action Plan - Turn CloudTrail On 구성가이드]]](https://www.aws-ps-tech.kr/%EA%B0%90%EC%82%AC%20%EB%AA%A9%EC%A0%81%EC%9C%BC%EB%A1%9C%20Trail%20%EC%A0%95%EB%B3%B4%EB%A5%BC%20S3%EC%97%90%20%EC%A0%80%EC%9E%A5%ED%95%A9%EB%8B%88%EB%8B%A4.%20%20Action%20Plan%20-%20Turn%20CloudTrail%20On%20%EA%B5%AC%EC%84%B1%EA%B0%80%EC%9D%B4%EB%93%9C)

[[[​]]]

### [[5. IAM Password Policy]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

[[IAM User의 비밀번호 복잡도를 설정하여, 강력한 비밀번호로 설정할 수 있도록 강제화 할 수 있습니다.]]

[[[Action Plan - Set a password policy to ensure strong passwords 구성가이드](https://catalog.workshops.aws/startup-security-baseline/en-US/b-securing-your-account/3-create-multiple-users/2-2-create-iam-users#set-a-password-policy-to-ensure-strong-passwords)\
]]

[[[​]]]

### [[6. IAM Access key rotation]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

[[최근 보안 사고는 해커가 AWA Account 탈취한 후, 몇 개월 동안 꾸준하게 고객의 정보를 수집하여 다각도로 피해를 주는 사례들이 늘어나고 있습니다. 이러한 해킹 사고는 일단 AWS Account가 침해 되더라도 고객이 이를 인지하지 못하는 경우가 있습니다. 주기적 비밀번호 변경 이외에도, IAM Access Key를 주기적으로 만료하고 새로 생성하여 사용하는 것을 권장합니다. 관리가 소홀하여 해당 Access Key와 Secret Access Key가 노출 되었다 하더라도 이러한 관리로 이 키 관련 정보를 무효화할 수 있습니다.]]

[[[AWS Config를 활용한 Access Key 자동 교환 구성하기 ]]](https://aws.amazon.com/blogs/mt/managing-aged-access-keys-through-aws-config-remediations/)[[[​]]]

[[[AWS Credential Report 로 AWS Account에서 발행한 전체 Access Key 상태 확인하는 방법 ]][[[​]]]](https://aws.amazon.com/blogs/mt/managing-aged-access-keys-through-aws-config-remediations/)

[[[​]]]

\

>  
> [[Note, AWS 계정을 파트너사에서 관리하는 경우 관련 설정이 파트너사 별로 다를 수 있으니 이런 경우, 파트너사로 문의하시기 바랍니다.]]
> 

### [[참고 자료]]![이미지](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdib3g9IjAgMCAxNiAxNiIgcHJlc2VydmVhc3BlY3RyYXRpbz0ieE1pZFlNaWQgbWVldCIgcm9sZT0icHJlc2VudGF0aW9uIiBzdHlsZT0idmVydGljYWwtYWxpZ246IG1pZGRsZTsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsiPjwvc3ZnPg==) 

**[[쉽게 활용 해 볼 수 있는 AWS IAM 모범 사례를 참고하시면 좋습니다.]]**

[[[10분안에 정복하는 안전한 계정 관리를 위한 IAM 모범 사례 (Youtube) ]]](https://www.youtube.com/watch?v=pDg7qxQMNFo)

[[[​]]]

**[[AWS 계정 안전하게 지키기 위해서 꼭 보셔야 하는 문서들입니다.]]**

[[[AWS Perspective Guidance on Baseline Security ]]](https://docs.aws.amazon.com/prescriptive-guidance/latest/aws-startup-security-baseline/controls-acct.html)

[[[​]]]

**[[AWS 계정 안전하게 지키기 Tip 에 대해서 항목별로 적용하는 방법은 아래 링크를 참고하시기 바랍니다.]]**

[[[Security Baseline - Basic Playbook ]][[[​]]]](https://catalog.workshops.aws/startup-security-baseline/en-US)
