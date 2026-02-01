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
    "url": "webpack-runtime-09b198ea841615fc07e2.js"
  },
  {
    "url": "framework-249d733f289d0429e609.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-909185ac39e0e18fce56.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "fea1a7e40a47b755216f11a44afe0e5c"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-9a5d1562692cb053f3c3.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "9f90f92f989659d704e101c639291593"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "d1ea0788af498293f13d0eb66573d105"
  },
  {
    "url": "polyfill-1bb1d5bc2a1b3b1c1ed4.js"
  },
  {
    "url": "546641dfde76ed00139ea2c3eae09499c5f2164a-d03caa1aeacd0cce9442.js"
  },
  {
    "url": "component---src-pages-404-js-8a5ed316b77dd3c4be8a.js"
  },
  {
    "url": "page-data/en/404/page-data.json",
    "revision": "de6ca95adb93bb862bdf1c84253ad16c"
  },
  {
    "url": "page-data/sq/d/1921109229.json",
    "revision": "4cee1bb7f689896baf7e7c50dd89c137"
  },
  {
    "url": "page-data/sq/d/1994492073.json",
    "revision": "934957b4c39aa60521eebc4c84d0671c"
  },
  {
    "url": "page-data/sq/d/2596216473.json",
    "revision": "9ce0a1858dff18701993fbe05e0c4286"
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
    "revision": "5896fdadab2f02c699e19b1464ee626c"
  },
  {
    "url": "page-data/sq/d/507961510.json",
    "revision": "4877e0bc8c121c1f91870095e006f28b"
  },
  {
    "url": "component---src-pages-archive-js-146344ad218372cfd755.js"
  },
  {
    "url": "page-data/en/archive/page-data.json",
    "revision": "7041de4d439c7e84c019a7493304d52b"
  },
  {
    "url": "component---src-pages-index-js-1b9a4ec0717822e081f5.js"
  },
  {
    "url": "page-data/en/page-data.json",
    "revision": "3c8a87f8781852c9ab4869c71f74ec68"
  },
  {
    "url": "page-data/en/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "d3eacb2f8e4ea93dd1a4eea3ceb95b5b"
  },
  {
    "url": "component---src-pages-pensieve-index-js-bb280f22b74bb88a04fa.js"
  },
  {
    "url": "page-data/en/pensieve/page-data.json",
    "revision": "0491bb4cb840a59437c143191eb948e6"
  },
  {
    "url": "page-data/pt/404/page-data.json",
    "revision": "86a2ea1632c0193528ed7f9e9aed4bb5"
  },
  {
    "url": "page-data/pt/archive/page-data.json",
    "revision": "457fd8e6f57c604d9af410cd0b7f410b"
  },
  {
    "url": "page-data/pt/page-data.json",
    "revision": "bdd9814bc3300eccd1f112a7ad884fe7"
  },
  {
    "url": "page-data/pt/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "14b568e74901e6e5489656264c73a538"
  },
  {
    "url": "page-data/pt/pensieve/page-data.json",
    "revision": "132ffcf3e440cec6ab1e8073b0eb9aa6"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "0592274b12dc5bd3f1dfc92f8a2287c9"
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
  if (!resources || !(await caches.match(`/Portfolio/app-d3e5d0b4d74e21cd8281.js`))) {
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
