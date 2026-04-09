import { Helmet } from 'react-helmet-async'

type Props = {
  readonly title: string
  readonly description: string
  readonly path: string
}

const SITE_NAME = '内装材料カリキュレーター'
const BASE_URL = 'https://naiso.simtool.dev'

export function PageHead({ title, description, path }: Props) {
  const fullTitle = path === '/' ? SITE_NAME : `${title} | ${SITE_NAME}`
  const url = `${BASE_URL}${path}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ja_JP" />
      <meta property="og:image" content={`${BASE_URL}/ogp.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${BASE_URL}/ogp.png`} />
    </Helmet>
  )
}
