export const SEO_DEFAULTS = {
  siteName: 'Edeh Chinedu Daniel',
  siteUrl: 'https://edehchinedu.dev',
  twitterHandle: '@EdehChinedu20',
  defaultTitle: 'Edeh Chinedu Daniel — Full-Stack Software Engineer & Digital Creator | Nigeria',
  defaultDescription:
    'Edeh Chinedu Daniel is a Full-Stack Software Engineer, IoT builder, ' +
    'and Digital Creator based in Nigeria. Building performant web ' +
    'applications, smart IoT systems, and open-source tools with React, ' +
    'Node.js, Three.js & TypeScript.',
  defaultOgImage: 'https://edehchinedu.dev/og-default.jpg',
  defaultOgImageAlt:
    'Edeh Chinedu Daniel — Full-Stack Software Engineer & Digital Creator',
  locale: 'en_NG',
  twitterCardType: 'summary_large_image',
  themeColor: '#080808',
} as const

export const PERSON_SCHEMA_BASE = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://edehchinedu.dev/#person',
  name: 'Edeh Chinedu Daniel',
  alternateName: 'RabbitDaCoder',
  url: 'https://edehchinedu.dev',
  email: 'edehchinedu59@gmail.com',
  jobTitle: 'Full-Stack Software Engineer & Digital Creator',
  description:
    'Full-Stack Software Engineer and IoT builder based in Nigeria. ' +
    'Founder of DroineTech. Lead Developer at HydroSense.',
  image: 'https://edehchinedu.dev/og-default.jpg',
  sameAs: [
    'https://github.com/RabbitDaCoder',
    'https://linkedin.com/in/edehchinedu20',
    'https://www.youtube.com/@rabbitdacoder',
    'https://x.com/EdehChinedu20',
  ],
  knowsAbout: [
    'React', 'Node.js', 'TypeScript', 'Three.js', 'GSAP',
    'PostgreSQL', 'Go', 'Docker', 'IoT', 'REST API',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Enugu',
    addressCountry: 'NG',
  },
} as const
