import Head from 'next/head'
import Link from 'next/link';

import Layout from '@components/Layout';
import Header from '@components/Header';
import Container from '@components/Container';
import Button from '@components/Button';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

import styles from '@styles/Page.module.scss'

export default function Category({ category, products }) {
  console.log('category', category)
  console.log('products', products)
  return (
    <Layout>
      <Head>
        <title>{ category.name }</title>
        <meta name="description" content="Generated by create next app" />
      </Head>

      <Container>
        <h1>{ category.name }</h1>

        <h2>Products</h2>

        <ul className={styles.products}>
          {products.map(product => {
            return (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`}>
                  <a >
                    <div className={styles.productImage}>
                      <img width={product.image.width} height={product.image.height} src={product.image.url} alt="" />
                    </div>
                    <h3 className={styles.productTitle}>
                      {product.name}
                    </h3>
                    <p className={styles.productPrice}>
                      ${product.price.toFixed(2)}
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

export async function getStaticProps({params}) {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/cle4724kv0alm01us2m2thvt1/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageCategory($slug: String = "") {
        category(where: {slug: $slug}) {
          id
          name
          slug
          products {
            id
            image
            name
            price
            slug
          }
        }
      }
   `,
      variables: {
      slug: params.categorySlug
    }
  })
  const category = data.data.category;
  return {
    props: {
      category,
      products: category.products
    }
  }
}

export async function getStaticPaths({locales}) {
  const client = new ApolloClient({
    uri: 'https://api-sa-east-1.hygraph.com/v2/cle4724kv0alm01us2m2thvt1/master',
    cache: new InMemoryCache(),
  });

  const data = await client.query({
    query: gql`
      query PageCategories {
        categories {
          id
          slug
        }
      }
   `
  })
  
  const paths = data.data.categories.map(category => {
    return {
      params: {
        categorySlug: category.slug
      }
    }
  })

  return {
    paths: [
      ...paths,
      ...paths.flatMap(path => {
        return locales.map(locale => {
          return {
            ...path,
            locale
          }
        })
      })
    ],
    fallback: false
  }
}