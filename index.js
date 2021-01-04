const puppeteer = require('puppeteer');
var fs = require('fs');
function run() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://www.tripadvisor.com/Restaurants-g188045-Switzerland.html');
            //   await page.screenshot({path: 'example.png'});
            // let numberofPages = await page.evaluate(() => {
            //     let numbers = 0;
            //     let itemNumbers = document.querySelectorAll('div.pageNumbers a');
            //     itemNumbers.forEach((items)=>{
            //         numbers = items.innerText;
            //     });
            //     return numbers
            //     // itemNumbers.forEach((item) => {
            //     //     console.log(item);
            //     // });
            // });
            // console.log(numberofPages);
            // let urls = await page.evaluate(() => {
            //     let results = [];
            //     let items = document.querySelectorAll('div.geo_name a');
            //     items.forEach((item) => {
            //         console.log(item);
            //         results.push({
            //             url: `https://www.tripadvisor.com` + item.getAttribute('href'),
            //             text: item.innerText,
            //         });
            //     });
            //     return results;
            // });
            // urls.forEach((url) => {
            // const page2 = await browser.newPage();
            // await page2.goto('https://www.tripadvisor.com/Restaurants-g188113-Zurich.html');
            // let restaurantsName = await page2.evaluate(() => {
            //     let restuarants = [];
            //     let restaurantsLinks = document.querySelectorAll('div.wQjYiB7z span a');
            //     restaurantsLinks.forEach((item) => {
            //         restuarants.push({
            //             restaurantLink: `https://www.tripadvisor.com` + item.getAttribute('href'),
            //             resturantName: item.innerText
            //         });
            //     });
            //     return restuarants
            // });
            // restaurantsName.forEach((urls) => {
                const page3 = await browser.newPage();
                await page3.goto('https://www.tripadvisor.com/Restaurant_Review-g188113-d812740-Reviews-Angkor-Zurich.html');
                let restaurantDetails = await page3.evaluate(()=>{
                    let resDetails = [];
                    let resName = document.querySelector('div._1hkogt_o h1').innerText
                    let res = document.querySelectorAll('div._36TL14Jn')
                    resDetails.push({
                        name: resName,
                        address: res[0].innerText,
                        website: res[2].querySelector('span a').href,
                        email: res[3].querySelector('span a').href,
                        phoneNumber: res[4].querySelector('a').href
                    });
                    return resDetails
                });
                console.log(restaurantDetails);
                var data=`NAME\tADDRESS\tWEBSITE\tEMAIL\tPHONENUMBER\n`;
                for (var i = 0; i < restaurantDetails.length; i++) {
                    data=data+restaurantDetails[i].name+'\t'+restaurantDetails[i].address+'\t'+restaurantDetails[i].website+'\t'+restaurantDetails[i].email+'\t'+restaurantDetails[i].phoneNumber+'\n';
                 }
                fs.appendFile('DataColected.xls', data, (err) => {
                    if (err) throw err;
                    console.log('File created');
                 });
            // });
            // });

            await browser.close();
        }
        catch (err) {
            console.log(err);
        }
    })
};
run().then(console.log).catch(console.error)