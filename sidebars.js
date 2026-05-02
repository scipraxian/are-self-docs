/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started',
        'quick-start',
        'will-it-run',
      ],
    },
    'end-to-end',
    {
      type: 'category',
      label: 'The Brain',
      items: [
        'architecture',
        'brain-regions/identity',
        'brain-regions/temporal-lobe',
        'brain-regions/central-nervous-system',
        {
          type: 'category',
          label: 'Frontal Lobe',
          link: { type: 'doc', id: 'brain-regions/frontal-lobe' },
          items: [
            'context-windows',
          ],
        },
        'brain-regions/hippocampus',
        'brain-regions/hypothalamus',
        'brain-regions/parietal-lobe',
        'brain-regions/prefrontal-cortex',
        'brain-regions/peripheral-nervous-system',
        'brain-regions/occipital-lobe',
        'brain-regions/thalamus',
        'brain-regions/synaptic-cleft',
        'brain-regions/neuroplasticity',
        'axoplasm',
      ],
    },
    {
      type: 'category',
      label: 'UI Walkthrough',
      items: [
        'ui/blood-brain-barrier',
        'ui/identity',
        'ui/temporal-lobe',
        'ui/prefrontal-cortex',
        'ui/cns-editor',
        'ui/cns-monitor',
        'ui/frontal-lobe',
        'ui/hippocampus',
        'ui/hypothalamus',
        'ui/pns',
        'ui/environments',
        'ui/modifier-garden',
      ],
    },
    {
      type: 'category',
      label: 'NeuralModifiers',
      items: [
        'neural-modifiers/writing-a-neural-modifier',
      ],
    },
    'openrouter',
    'api-reference',
    'mcp-server',
    {
      type: 'category',
      label: 'Security',
      items: [
        'security',
        'security/data-flow-privacy',
        'security/responsible-ai',
        'security/incident-response',
        'security/sbom',
        'dependency-audit',
      ],
    },
    'scipraxianism',
    'storybook',
    'faq',
    'contributing',
    'style-guide',
    'features',
    {
      type: 'link',
      label: 'Glossary',
      href: 'pathname:///learn/glossary',
    },
    'acknowledgments',
  ],
};

module.exports = sidebars;
