import React from 'react'
import { graphql } from 'gatsby'
import { mapEdgesToNodes, filterOutDocsWithoutSlugs, cn } from '../lib/helpers'
import Fade from 'react-reveal'
import Image from 'gatsby-image'
import BlogPostPreviewGrid from '../components/blog-post-preview-grid'
import Container from '../components/container'
import GraphQLErrorList from '../components/graphql-error-list'
import ProjectPreviewGrid from '../components/project-preview-grid'
import SEO from '../components/seo'
import Layout from '../containers/layout'
import SiteIntro from '../components/site-intro'
import { node } from 'prop-types'

export const query = graphql`
  query IndexPageQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      keywords
    }

    projects: allSanityProject(limit: 5, sort: { fields: [startedAt], order: DESC }) {
      edges {
        node {
          id
          mainImage {
            asset {
              _id
              metadata {
                lqip
                dimensions {
                  aspectRatio
                }
              }
              fluid(maxHeight: 337) {
                ...GatsbySanityImageFluid
              }
            }
            crop {
              _key
              _type
              top
              bottom
              left
              right
            }
            hotspot {
              _key
              _type
              x
              y
              height
              width
            }
            alt
          }
          title
          _rawExcerpt
          slug {
            current
          }
          betaProject
          highlights
          technology
          client
          role
        }
      }
    }

    posts: allSanityPost(limit: 6, sort: { fields: [publishedAt], order: DESC }) {
      edges {
        node {
          id
          publishedAt
          mainImage {
            crop {
              _key
              _type
              top
              bottom
              left
              right
            }
            hotspot {
              _key
              _type
              x
              y
              height
              width
            }
            asset {
              _id
            }
            alt
          }
          title
          _rawExcerpt
          slug {
            current
          }
        }
      }
    }
  }
`

const IndexPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site
  // const postNodes = (data || {}).posts
  //   ? mapEdgesToNodes(data.posts).filter(filterOutDocsWithoutSlugs)
  //   : []
  const projectNodes = (data || {}).projects
    ? mapEdgesToNodes(data.projects).filter(filterOutDocsWithoutSlugs)
    : []

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO title={site.title} description={site.description} keywords={site.keywords} />
      <Container page="home">
        <section>
          <SiteIntro />
        </section>
        <section id="latest-projects">
          {projectNodes && (
            <ProjectPreviewGrid
              title="Latest projects"
              nodes={projectNodes}
              browseMoreHref="/projects/"
            />
          )}
        </section>
        {/* <section id='latest-posts'>
          {postNodes && (
            <BlogPostPreviewGrid
              title='Latest blog posts'
              nodes={postNodes}
              browseMoreHref='/blog/'
            />
          )}
        </section> */}
      </Container>
    </Layout>
  )
}

export default IndexPage
