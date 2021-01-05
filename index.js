const puppeteer = require('puppeteer');
var fs = require('fs');
async function run() {
    return new Promise(async (resolve, reject) => {
        try {

            var data = '';

            let resData = [];
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto('https://www.tripadvisor.com/Restaurants-g188057-Geneva.html');
            let numberOfPages = await page.evaluate(() => {
                let res = document.querySelectorAll('a.pageNum')
                let numPages = parseInt(res[5].innerText);
                return numPages
            });
            for (var j = 0; j < numberOfPages; j++) {
                console.log('Page Number:', j);
                let resLinks = await page.evaluate(() => {
                    let results = []
                    let restaurantsLinks = document.querySelectorAll('div.wQjYiB7z span a');
                    restaurantsLinks.forEach((item) => {
                        results.push({
                            links: item.getAttribute('href')
                        });
                    });
                    return results
                });

                try {
                    for (var i = 0; i < resLinks.length; i++) {
                        const page1 = await browser.newPage();
                        await page1.goto(`https://www.tripadvisor.com` + resLinks[i].links);
                        resData = await page1.evaluate(() => {
                            let resDetails = [];
                            let address, website, email, phoneNumber
                            let resName = document.querySelector('div._1hkogt_o h1').innerText
                            let res = document.querySelectorAll('div._1ud-0ITN')
                            address = res[1].querySelectorAll('._13OzAOXO')[0].innerText
                            website = res[1].querySelectorAll('._13OzAOXO')[2].querySelector('a').href

                            try {
                                res1 = document.querySelectorAll('div._3jdfbxG0')[1]
                                if (res1.querySelector('a').href) {
                                    email = res1.querySelector('a').href
                                }
                            }
                            catch (err) {
                                email = null
                            }

                            phoneNumber = res[1].querySelectorAll('._13OzAOXO')[1].querySelector('a').href
                            resDetails.push({
                                name: resName,
                                address: address,
                                website: website,
                                email: email,
                                phoneNumber: phoneNumber
                            });

                            return resDetails

                        });
                        await page1.close();

                        data = data + resData[0].name + '\t' + resData[0].address + '\t' + resData[0].website + '\t' + resData[0].email + '\t' + resData[0].phoneNumber + '\t' + `https://www.tripadvisor.com` + resLinks[i].links + '\n';
                    }

                } catch (err) {
                    console.log(err);
                }



                // console.log(resLinks);
                await page.click('div.unified a.next', { waitUntil: 'domcontentloaded' });
            }
            fs.appendFile('DataColected.xls', data, (err) => {
                if (err) throw err;
                console.log('File created');
            });
            await browser.close();
        }
        catch (err) {
            console.log(err);
        }
    });
};
run().then(console.log).catch(console.error)