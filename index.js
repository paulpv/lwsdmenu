const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { http, https } = require('follow-redirects');


const urlMenus = new URL('https://www.lwsd.org/students-families/breakfast-and-lunch-menus');
const elementSelectors = {
    'elementary.jpg':'#fsEl_180329 > div > article > a > img',
    'middle-high-breakfast.jpg':'#fsEl_170648 > div > article > a > img',
    'middle-lunch.jpg':'#fsEl_180330 > div > article > a > img',
    'high-lunch.jpg':'#fsEl_176940 > div > article > a > img',

    'elementary-nutrition.pdf':'#fsEl_176327 > div > ul > li:nth-child(1) > a',
    'middle-nutrition.pdf':'#fsEl_176327 > div > ul > li:nth-child(2) > a',
    'high-nutrition.pdf':'#fsEl_176327 > div > ul > li:nth-child(4) > a',
};


async function getImage(name, url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: { 'User-Agent': 'https://github.com/paulpv/lwsdmenu' }
        };        
        https.get(url, options, (response) => {
            const statusCode = response.statusCode;
            if (statusCode != 200) {
                reject(`getImage: response.statusCode=${statusCode}`);
                return;
            }
            const filepath = `./${name}`;
            console.log(`getImage: filepath`, filepath);
            const fileStream = fs.createWriteStream(filepath);
            response.pipe(fileStream);
            fileStream.on('finish', () => {
                console.log(`getImage: Image '${url}' downloaded successfully.`);
                resolve();
            });
        }).on('error', (err) => {
            console.error(`getImage: Failed to download remote image ${url}: ${err}`);
            reject(err);
        });
    });
}

async function getImages(url, selectors) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(async response => {
                const html = response.data;
                const $ = cheerio.load(html);
                const promises = [];
                Object.entries(selectors).forEach(([name, selector]) => {
                    const element = $(selector);
                    //console.log('getImages: element', element);
                    const attr = element.attr()
                    //console.log('getImages: element.attr()=', attr);
                    
                    let imageUrl = null;
                    const dataImageSizes = attr['data-image-sizes'];
                    if (dataImageSizes) {
                        /*
                        <img
                            alt="First page of the PDF file: ESBkfstLunchMenuFaceBaseballMar2023"
                            data-aspect-ratio="1.2941176470588236"
                            data-image-sizes="[
                                {%22url%22:%22https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_1/v1677883915/lwsdorg/tceiscxhyme3gzjonfcq/ESBkfstLunchMenuFaceBaseballMar2023.pdf%22,%22width%22:256},
                                {%22url%22:%22https://resources.finalsite.net/images/f_auto,q_auto,t_image_size_2/v1677883915/lwsdorg/tceiscxhyme3gzjonfcq/ESBkfstLunchMenuFaceBaseballMar2023.pdf%22,%22width%22:512},
                                {%22url%22:%22https://resources.finalsite.net/images/f_auto,q_auto/v1677883915/lwsdorg/tceiscxhyme3gzjonfcq/ESBkfstLunchMenuFaceBaseballMar2023.pdf%22,%22width%22:612}]"
                            style=""
                            src="https://resources.finalsite.net/images/f_auto,q_auto/v1677883915/lwsdorg/tceiscxhyme3gzjonfcq/ESBkfstLunchMenuFaceBaseballMar2023.pdf">
                        */
                        //console.log('getImages: dataImageSizes=', dataImageSizes);
                        const dataImageSizes2 = decodeURIComponent(dataImageSizes);
                        //console.log('getImages: dataImageSizes2=', dataImageSizes2);
                        const dataImageSizes3 = JSON.parse(dataImageSizes2);
                        //console.log('getImages: dataImageSizes3=', dataImageSizes3);
                        const dataItem = dataImageSizes3.find(item => item.width == 512);
                        //console.log('getImages: dataItem=', dataItem);
                        const dataImageUrl = dataItem.url;
                        //console.log('getImages: dataImageUrl=', dataImageUrl);
                        imageUrl = dataImageUrl;
                    } else {
                        /*
                        <a
                            data-file-name="ESNutrientInfoFeb2023.pdf"
                            data-resource-uuid="b3337911-2d56-4541-977a-8e6f9eefbd06"
                            href="/fs/resource-manager/view/b3337911-2d56-4541-977a-8e6f9eefbd06"
                            target="_blank"
                            title="Elementary nutrition information"
                            aria-describedby="audioeye_pdf_message audioeye_new_window_message">Elementary</a>

                            https://www.lwsd.org/fs/resource-manager/view/b3337911-2d56-4541-977a-8e6f9eefbd06
                        */
                        const href = attr['href'];
                        if (href) {
                            imageUrl = url.origin + href;
                        }
                    }
                    console.log('getImages: imageUrl=', imageUrl);
                    if (imageUrl) {
                        promises.push(getImage(name, imageUrl));
                    }
                });
                await Promise.all(promises);
                resolve();
            })
            .catch(error => {
                console.error(`getImages: error`, error);
                reject(error);
            });  
    });
}

function runServer() {
    const server = http.createServer((req, res) => {
        console.log('req.url', req.url);
        const filepath = `.${req.url}`;
        console.log('runServer: filepath', filepath);
        fs.readFile(filepath, (err, data) => {
            if (err) {
                console.error(`runServer: Failed to read local image file: ${err}`);
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }
            /*
            let contentType = null;
            if (filepath.endsWith('.jpg')) {
                contentType = 'image/jpeg';
            } else if (filepath.endsWith('.pdf')) {
                contentType = 'application/pdf';
            }
            if (contentType) { 
                res.writeHead(200, { 'Content-Type': contentType });
            }
            */
            res.end(data);
        });
    });
    server.listen(3000, () => {
        console.log('runServer: Server started on port 3000');
    });
}

async function main() {
    console.log('main: +getImages(...)');
    await getImages(urlMenus, elementSelectors);
    console.log('main: -getImages(...)');
    runServer();
}

main();
