/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

const sidebars = {
  docs: [
    {type: 'doc', id: 'index', label: 'English guide index'},
    {type: 'doc', id: 'getting-started/index', label: 'Start by goal'},
    {
      type: 'category',
      label: 'Healthcare and life sciences',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'sectors/healthcare-life-sciences',
          label: 'Field guide',
        },
        {
          type: 'doc',
          id: 'amazon-bio-discovery-ai/amazon-bio-discovery-ai',
          label: 'AI antibody design',
        },
        {
          type: 'doc',
          id: 'omics-on-aws/aws-healthomics/aws-healthomics-nf-coresarek-390',
          label: 'Run nf-core/sarek',
        },
        {
          type: 'doc',
          id: 'omics-on-aws/aws-healthomics/vpc-connected-workflows-s3',
          label: 'VPC-connected workflows',
        },
        {
          type: 'doc',
          id: 'omics-on-aws/aws-healthomics-ksh',
          label: 'Concurrency and storage cost',
        },
      ],
    },
  ],
};

module.exports = sidebars;
