require('dotenv').config()

module.exports = {
  flags: {
    DEV_SSR: false
  },
  plugins: [
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
      }
    },
    {
      // ATTENTION: Match the theme name with the theme you're using
      resolve: '@elegantstack/gatsby-theme-flexiblog-news',
      options: {
        sources: {
          contentful: true,
          local: false
        }
      }
    },
    
  ],
  // Customize your site metadata:
  siteMetadata: {
    //General Site Metadata
    title: 'Train Sim Depot',
    name: 'TrainSimDepot',
    description: 'Train Sim Depot is the new news site for Train Simulator, Train Sim World 2 and other train simulators. Providing the most up to date news out on the internet.',
    address: '157 Coldnailhurst Avenue',
    email: 'gareth@trainsimdepot.net',
    phone: '07933334833',

    //Site Social Media Links
    social: [
      {
        name: 'Github',
        url: 'https://github.com/gatsbyjs'
      },
      {
        name: 'Twitter',
        url: 'https://twitter.com/gatsbyjs'
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/trainsimdepot/'
      }
    ],

    //Header Menu Items
    headerMenu: [
      {
        name: 'Home',
        slug: '/'
      },
     
      {
        name: 'Contact',
        slug: '/contact'
      },
      {
        name: 'About',
        slug: '/About'
      },
      {
        name: 'TS News',
        slug: '/category/train-simulator/'
      },
      {
        name: 'Railway News',
        slug: '/category/railway-news/'
      }
    ],

    //Footer Menu Items (2 Sets)
    footerMenu: [
      {
        title: 'Quick Links',
        items: [
          {
            name: 'Advertise with us',
            slug: '/contact'
          },
          {
            name: 'About Us',
            slug: '/about'
          },
          {
            name: 'Contact Us',
            slug: '/contact'
          }
        ]
      },
      {
        title: 'Legal Stuff',
        items: [
          {
            name: 'Privacy Notice',
            slug: '/'
          },
          {
            name: 'Cookie Policy',
            slug: '/'
          },
          {
            name: 'Terms Of Use',
            slug: '/'
          }
        ]
      }
    ]
  }
}
