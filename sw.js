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
    "url": "webpack-runtime-a23cbebfeaaea4bedd1f.js"
  },
  {
    "url": "framework-249d733f289d0429e609.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-909185ac39e0e18fce56.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "b9200b64a58e04265da43bc807764336"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-9a5d1562692cb053f3c3.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "97bbbd4f17415d2a32d221f1e5ca0c4d"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "854a770a2ce584d85fcc6a8a7cd41f76"
  },
  {
    "url": "polyfill-1bb1d5bc2a1b3b1c1ed4.js"
  },
  {
    "url": "546641dfde76ed00139ea2c3eae09499c5f2164a-e10043cd0a16bd49bb93.js"
  },
  {
    "url": "component---src-pages-404-js-8a5ed316b77dd3c4be8a.js"
  },
  {
    "url": "page-data/en/404/page-data.json",
    "revision": "59a316eabaa1c59134d32280d50d07cc"
  },
  {
    "url": "page-data/sq/d/1127135046.json",
    "revision": "a03f6969d2bb50698e98f40e1488685c"
  },
  {
    "url": "page-data/sq/d/1921109229.json",
    "revision": "95277c521e8e1eeb4938116f13c86f71"
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
    "revision": "2bb38d78c2d24f9cb9d440f05e7e2435"
  },
  {
    "url": "component---src-pages-archive-js-146344ad218372cfd755.js"
  },
  {
    "url": "page-data/en/archive/page-data.json",
    "revision": "c014810387d1bde042c3548eb3099fae"
  },
  {
    "url": "component---src-pages-index-js-1b9a4ec0717822e081f5.js"
  },
  {
    "url": "page-data/en/page-data.json",
    "revision": "ca4272cb0096b8a97fe2993e24063f70"
  },
  {
    "url": "page-data/en/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "96b22525aefc0dbd3f748e896ed11c4e"
  },
  {
    "url": "component---src-pages-pensieve-index-js-bb280f22b74bb88a04fa.js"
  },
  {
    "url": "page-data/en/pensieve/page-data.json",
    "revision": "1d2e85e81e36a1a99cf17b7c5fdc2f1c"
  },
  {
    "url": "page-data/pt/404/page-data.json",
    "revision": "0f0859c86d58c3a06b35a3fbe9d45a4b"
  },
  {
    "url": "page-data/pt/archive/page-data.json",
    "revision": "a9f32d4c4764065590df04e6b152b4fd"
  },
  {
    "url": "page-data/pt/page-data.json",
    "revision": "e0f5a900a77333384bc6d3def609e746"
  },
  {
    "url": "page-data/pt/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "3807094e18d79d965f24d9ca52a6f917"
  },
  {
    "url": "page-data/pt/pensieve/page-data.json",
    "revision": "70af39651373c52c8e7686c0d5e9c454"
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
  if (!resources || !(await caches.match(`/Portfolio/app-588fa16bc8ac38b78952.js`))) {
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
