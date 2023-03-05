
const { http, https } = require('follow-redirects');

const url = 'https://www.lwsd.org/fs/resource-manager/view/b3337911-2d56-4541-977a-8e6f9eefbd06'

const options = {
    headers: { 'User-Agent': 'https://github.com/paulpv/lwsdmenu' }
};

https.get(url, options, (response) => {
    //console.log('getImage: response', response);
    console.log('getImage: response.statusCode', response.statusCode);
})
.on('error', (err) => {
    console.error(`Failed to download remote image ${url}: ${err}`);
});
