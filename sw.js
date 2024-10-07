const staticAssets = [
  'chooseremedial.html',
    'emergency.html',
    'emergency2.html',
    'emergency3.html',
    'first-aid.html',
    'home.html',
    'home2.html',
    'index.html',
    'login.html',
    'mybookmarks.html',
    'mystory.html',
    'newpassword.html',
    'notification.html',
    'openFirstAid.html',
    'otp.html',
    'poststory.html',
    'profile.html',
    'readStory.html',
    'search.html',
    'signup.html',
    'splashscreen.html',
    'tagSearch.html',
    'welcome.html',
    'images/logo.png',
    'js/functions.js',
    'css/style.css',
    'css/style2.css',
    'fallback.html'
];
self.addEventListener('install', async event => {
    const cache = await caches.open('news-static');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    //event.respondWith(cacheFirst(req))
    const url = new URL(req.url);

    if (url.origin === location.orgin) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function networkFirst(req) {
    const cache = await caches.open('news-dynamic');
    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch {
        const cachedResponses = await cache.match(req);
        return cachedResponses || await caches.match('index.html');
    }
}
async function cacheFirst(req) {
    const cachedResponse = await caches.match(req);
    return cachedResponse || fetch(req);
}