---
title: "Hail on EC2 (옵션)"
sidebar_position: 11
---

앞에서 배운 것들을 토대로 새로운 EC2를 생성하고 접속한 뒤 오픈소스 프로그램인 [Hail](https://hail.is/) 을 설치 및 사용해 봅시다.

**Python3 버전 확인**

``` 
python3 --version
```

Python3는 설치되어 있다면 아래와 같이 pip을 설치합니다.

``` 
curl -O https://bootstrap.pypa.io/get-pip.py

python3 get-pip.py --user
```

Hail 툴 의존성 패키지 및 프로그램 설치

``` 
sudo yum install -y java-11-amazon-corretto-headless
sudo yum groupinstall -y "Development Tools"
sudo yum install -y lapack-devel blas-devel
```

Hail 설치

``` 
pip install hail
```

Hail 테스트

``` 
Import hail as hl
mt = hl.balding_nichols_model(n_populations=3,
                              n_samples=10,
                              n_variants=100)
mt.show()
```

\-\--

**참고문서**

- https://hail.is/docs/0.2/install/try.html
- 
- https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/compile-software.html
