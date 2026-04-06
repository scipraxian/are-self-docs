import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroDescription}>
          Free. Local. Private. MIT Licensed.<br />
          Let small language models work together as a swarm — reasoning
          autonomously, using tools, forming memories, and managing their own
          work. On hardware you already own.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            to="/docs/architecture"
            style={{ marginLeft: '1rem' }}
          >
            How It Works
          </Link>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    title: 'Built Like a Brain',
    link: '/docs/architecture',
    description:
      'Every component maps to a real brain region. The Hippocampus stores memories. The Frontal Lobe reasons. The CNS fires spike trains. This isn\'t a metaphor — it\'s a design principle that makes the system teachable and debuggable.',
  },
  {
    title: 'Runs on Your Hardware',
    link: '/docs/getting-started',
    description:
      'A student with a laptop and curiosity can run an AI reasoning swarm — for free, locally, privately. The models are free via Ollama. The software is MIT licensed. The hardware is whatever you have.',
  },
  {
    title: 'Small Models, Big Work',
    link: '/docs/research',
    description:
      'A 7B parameter model can do real work when the architecture handles the hard parts. The Focus Economy, identity addons, and mechanical structure compensate for small models\' limitations.',
  },
  {
    title: 'Visual Neural Pathways',
    link: '/docs/ui/cns-editor',
    description:
      'Build AI workflows as visual graphs — neurons connected by axons, just like a brain. Watch spike trains fire through the network in real time with 3D visualization.',
  },
  {
    title: 'Lifelong Memory',
    link: '/docs/ui/hippocampus',
    description:
      'The Hippocampus stores vector-embedded engrams that persist across sessions. Your AI remembers what it learned yesterday, last week, last year. No more amnesia.',
  },
  {
    title: 'Swarm Ready',
    link: '/docs/ui/pns',
    description:
      'One machine or twenty — the Peripheral Nervous System discovers and coordinates them all. Add hardware, the brain adapts. No reconfiguration needed.',
  },
];

function Feature({ title, description, link }) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <Link to={link} className={styles.featureLink}>
        <div className="padding-horiz--md">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Autonomous AI reasoning on hardware you already own."
    >
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
