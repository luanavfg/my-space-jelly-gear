import Head from 'next/head'
import Link from 'next/link';
import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';
import styles from '@styles/Page.module.scss';
import { buildImage } from '@lib/cloudinary';

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Home({ home, products }) {
  const { heroTitle, heroText, heroLink, heroBackground } = home
  return (
    <Layout>
      <Head>
        <title>Space Jelly Gear</title>
        <meta name="description" content="Get your Space Jelly gear!" />
      </Head>

      <Container>
        <h1 className="sr-only">Space Jelly Gear</h1>

        <div className={styles.hero}>
          <Link href={heroLink}>
            <a>
              <div className={styles.heroContent}>
                <h2>{heroTitle}</h2>
                <p>{heroText}</p>
              </div>
              <img className={styles.heroImage} src={buildImage(heroBackground.public_id).toURL()} width={heroBackground.width} heigth={heroBackground.height} alt="" />
            </a>
          </Link>
        </div>

        <h2 className={styles.heading}>Featured Gear</h2>

        <ul className={styles.products}>
          {products.map(product => {
            const imageUrl = buildImage(product.image.public_id).resize('w_900,h_900').toURL();
            return (
              <li key={product.slug}>
                <Link href={`/products/${product.slug}`}>
                  <a>
                    <div className={styles.productImage}>
                      <img width={product.image.width} height={product.image.height} src={imageUrl} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      { product.name }
                    </h3>
                    <p className={styles.productPrice}>
                      ${ product.price }
                    </p>
                  </a>
                </Link>
                <p>
                  <Button
                    className="snipcart-add-item"
                    data-item-id={product.id}
                    data-item-price={product.price}
                    data-item-url={`/products/${product.slug}`}
                    data-item-image={product.image.url}
                    data-item-name={product.name}
                  >
                    Add to Cart
                  </Button>
                </p>
              </li>
            )
          })}
        </ul>
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/cle4724kv0alm01us2m2thvt1/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageHome($locale: Locale!) {
        page(where: {slug: "home"}) {
          id
          heroLink
          heroText
          heroTitle
          name
          slug
          heroBackground
          localizations(locales: [$locale]) {
            heroText
            heroTitle
            locale
          }
        }
        products(where: {categories_some: {slug: "featured"}}) {
          id
          name
          price
          slug
          image
          id
        }
      }
   `,
    variables: {
      locale
    }
  })

  let home = data.data.page

  if (home.localizations.length > 0) {
    home = {
      ...home,
      ...home.localizations[0]
    }
  }
  const products = data.data.products

  return {
    props: {
      home,
      products
    }
  }
}