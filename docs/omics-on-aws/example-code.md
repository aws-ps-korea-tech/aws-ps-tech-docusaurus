---
title: "Example code"
sidebar_position: 0
---

 

Python으로 Nextflow 작성하기

``` 
Import os
from textwrap Import dedent

os.makedirs('workflows/nf/sample', exist_ok=True)

nf = dedent('''
nextflow.enable.dsl = 2

params.greeting = 'hello'
params.addressee = null

if (!params.addressee) exit 1, "required parameter 'addressee' missing"

process Greet  $" | tee output
        """
}

workflow 

''').strip()

with open('workflows/nf/sample/main.nf', 'wt') as f:
    f.write(nf)
```
