/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-e6831682415e2fc53da9.js"
  },
  {
    "url": "framework-249d733f289d0429e609.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-909185ac39e0e18fce56.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "9beace5a599aacc909221b71672e6ff1"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-9a5d1562692cb053f3c3.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "bdd32bfbedcd1e82d8c3816516a53d2b"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "fc4fec6a228a4c867b36fc0a5b5383e3"
  },
  {
    "url": "polyfill-1bb1d5bc2a1b3b1c1ed4.js"
  },
  {
    "url": "d9067523-bc2e2120bc5afd67012e.js"
  },
  {
    "url": "cb355538-178bc024ee0354330138.js"
  },
  {
    "url": "546641dfde76ed00139ea2c3eae09499c5f2164a-9c60aa38911fb53ee7f2.js"
  },
  {
    "url": "component---src-pages-404-js-8edb19dd75b2ebef2628.js"
  },
  {
    "url": "page-data/en/404/page-data.json",
    "revision": "9d56957546e563bc4c11155732faa238"
  },
  {
    "url": "page-data/sq/d/1127135046.json",
    "revision": "14695ad3684f6c88ab4c7a2edeb32d64"
  },
  {
    "url": "page-data/sq/d/1921109229.json",
    "revision": "ba9b900ad164426baabed3f27fcb2741"
  },
  {
    "url": "page-data/sq/d/1994492073.json",
    "revision": "934957b4c39aa60521eebc4c84d0671c"
  },
  {
    "url": "page-data/sq/d/2596216473.json",
    "revision": "02514eca5a96ee9d8119a8c0c6075bbd"
  },
  {
    "url": "page-data/sq/d/3208555609.json",
    "revision": "c284503a8513d5546cc4bec617d6b7d8"
  },
  {
    "url": "page-data/sq/d/3825832676.json",
    "revision": "0977d3b7d9f6075f2926e785d873c570"
  },
  {
    "url": "page-data/sq/d/3933733069.json",
    "revision": "2bb38d78c2d24f9cb9d440f05e7e2435"
  },
  {
    "url": "component---src-pages-archive-js-ab6fc295fd53d1c80875.js"
  },
  {
    "url": "page-data/en/archive/page-data.json",
    "revision": "93fdf1dd1f6749e2f6e43623cb9834f9"
  },
  {
    "url": "component---src-pages-index-js-cc48a2e0b5889cca5e1f.js"
  },
  {
    "url": "page-data/en/page-data.json",
    "revision": "bde216f6867036f1d7088526fa5126b5"
  },
  {
    "url": "page-data/en/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "a3f3b4b3521e66389b9a8d55f526d7b5"
  },
  {
    "url": "component---src-pages-pensieve-index-js-2561cb98ec0f600f428f.js"
  },
  {
    "url": "page-data/en/pensieve/page-data.json",
    "revision": "34d20d9c4a999de30b2025122677b488"
  },
  {
    "url": "page-data/pt/404/page-data.json",
    "revision": "d66220313c85f3af16903e3482138798"
  },
  {
    "url": "page-data/pt/archive/page-data.json",
    "revision": "ef3c44dbf385c3c031438b7857966d54"
  },
  {
    "url": "page-data/pt/page-data.json",
    "revision": "cb4e1ca052ae0dc825b0d269107515bd"
  },
  {
    "url": "page-data/pt/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "af9ae9879f22310e95a0cb9d23569df8"
  },
  {
    "url": "page-data/pt/pensieve/page-data.json",
    "revision": "b71227a7a956e123efbd793ea8985beb"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "8d09907b16d50cacf646ce9ffb974fa5"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^/Portfolio`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/Portfolio/app-9d0a3f8353c544bb7f9e.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/Portfolio/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
