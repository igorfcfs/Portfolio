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
    "url": "webpack-runtime-6abe9dcc1613e02b9452.js"
  },
  {
    "url": "framework-249d733f289d0429e609.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-909185ac39e0e18fce56.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "2cb43058f2fd839f007df102589a5dfe"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-9a5d1562692cb053f3c3.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "d3709221118feb76ee7e1c0e82c1930a"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "1d4a282654f13b914b373cd7e563133a"
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
    "url": "546641dfde76ed00139ea2c3eae09499c5f2164a-053a6ebcace86f83a78c.js"
  },
  {
    "url": "component---src-pages-404-js-8edb19dd75b2ebef2628.js"
  },
  {
    "url": "page-data/en/404/page-data.json",
    "revision": "bc4182534228173441bdd5a84de9939c"
  },
  {
    "url": "page-data/sq/d/1127135046.json",
    "revision": "4cff1e48c05f5bba02c17c7394b843bc"
  },
  {
    "url": "page-data/sq/d/1921109229.json",
    "revision": "2c1ea29d085e3e84089b9738b5db3e14"
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
    "revision": "5896fdadab2f02c699e19b1464ee626c"
  },
  {
    "url": "component---src-pages-archive-js-7c5e67f0c84b75d5b057.js"
  },
  {
    "url": "page-data/en/archive/page-data.json",
    "revision": "16be08aab6142097958b1ed713b15784"
  },
  {
    "url": "component---src-pages-index-js-cc48a2e0b5889cca5e1f.js"
  },
  {
    "url": "page-data/en/page-data.json",
    "revision": "fc1aa49e4ef880954c0b2e3f2db2cb83"
  },
  {
    "url": "page-data/en/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "f87b097363c7bae00235ff42fa4fa881"
  },
  {
    "url": "component---src-pages-pensieve-index-js-52918678b7009580713e.js"
  },
  {
    "url": "page-data/en/pensieve/page-data.json",
    "revision": "4f9fd5b0d835c3997b958377b8ddcb48"
  },
  {
    "url": "page-data/pt/404/page-data.json",
    "revision": "52750507aa04218c1eecaeaf5e46c797"
  },
  {
    "url": "page-data/pt/archive/page-data.json",
    "revision": "b92adf9a1acaaaf0a9688207f024d39a"
  },
  {
    "url": "page-data/pt/page-data.json",
    "revision": "63cd99d35037a0c22e87c2d1f9d0f7c5"
  },
  {
    "url": "page-data/pt/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "4d7b4f0ed7e0f9955d5c7c74e315b5cc"
  },
  {
    "url": "page-data/pt/pensieve/page-data.json",
    "revision": "641fe85f5268f2c8dbe6bde78b76ad13"
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
