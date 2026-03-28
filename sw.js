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
    "url": "webpack-runtime-3ed46e890aee6dff90fe.js"
  },
  {
    "url": "framework-249d733f289d0429e609.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-909185ac39e0e18fce56.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "633466a84b4eafa0998d61b8a9ce4dd5"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-9a5d1562692cb053f3c3.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "97678572661eb7279c37baa9c9c83e5d"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "3cf3fa3d8f63a43f5a31b3261770f693"
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
    "url": "546641dfde76ed00139ea2c3eae09499c5f2164a-9f4535481cc24d106a2c.js"
  },
  {
    "url": "component---src-pages-404-js-8edb19dd75b2ebef2628.js"
  },
  {
    "url": "page-data/en/404/page-data.json",
    "revision": "ae23f15339058bb83872ba8fa09daa7b"
  },
  {
    "url": "page-data/sq/d/1127135046.json",
    "revision": "f0770305c6257fc95163816ecc5b0a6c"
  },
  {
    "url": "page-data/sq/d/1921109229.json",
    "revision": "2933d12244fa496d1962a5cc1d8c3744"
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
    "revision": "f7a4463258ee8d201699931c3b24f8ab"
  },
  {
    "url": "page-data/sq/d/3933733069.json",
    "revision": "99af142ebfbbf85a5a77d1338c0ee1df"
  },
  {
    "url": "component---src-pages-archive-js-c1a0326558dd2cf6deed.js"
  },
  {
    "url": "page-data/en/archive/page-data.json",
    "revision": "8473e467367181676e3c8ce227b6b7db"
  },
  {
    "url": "component---src-pages-index-js-cc48a2e0b5889cca5e1f.js"
  },
  {
    "url": "page-data/en/page-data.json",
    "revision": "585e7ce0b1f220ad5517a4fd92c09af5"
  },
  {
    "url": "page-data/en/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "e111a626fabb0a0a81e76b11a5f04694"
  },
  {
    "url": "component---src-pages-pensieve-index-js-f4f58be33cab975a8867.js"
  },
  {
    "url": "page-data/en/pensieve/page-data.json",
    "revision": "de9908e27068d519ddfeefc1968236fe"
  },
  {
    "url": "page-data/pt/404/page-data.json",
    "revision": "b4e25fb0a252f14146f8884d07be3fdc"
  },
  {
    "url": "page-data/pt/archive/page-data.json",
    "revision": "995e6457e078378c0ccd86f115788c4d"
  },
  {
    "url": "page-data/pt/page-data.json",
    "revision": "a23b442d55fe99bce67321c6b72fe1ca"
  },
  {
    "url": "page-data/pt/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "8bca855046a2e987c26a36d769b7fc25"
  },
  {
    "url": "page-data/pt/pensieve/page-data.json",
    "revision": "43d6c4e69cfe3a86d82ee90a9804e16d"
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
