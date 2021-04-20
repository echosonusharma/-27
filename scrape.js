const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

const url = "https://en.wikipedia.org/wiki/List_of_serial_killers_in_the_United_States";

const url2 = "https://en.wikipedia.org/wiki/List_of_serial_killers_by_number_of_victims";


const headerOptions = {
    authority: 'en.wikipedia.org',
    method: 'GET',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    'cache-control': 'no-cache',
    dnt: 1,
    pragma: 'no-cache',
    'sec-fetch-site': 'cross-site',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': 1,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
}

const serialKillerList = async () => {
    const x = await fetch(url, {
        Headers: headerOptions
    });
    const html = await x.text();
    const $ = cheerio.load(html);

    const x1 = await fetch(url2, {
        Headers: headerOptions
    });
    const html2 = await x1.text();
    const $1 = cheerio.load(html2);

    const nameArr = new Array;

    $('tr td:first-child').each((i, item) => {
        const name = $(item).text();
        const rev = name.split(/\s/).reverse().join(' ').replace(',', '').trimStart();
        nameArr.push(rev.replace(/\s/gm, '-'))
    });

    $1('tr td:first-child').slice(3).each((i, item) => {
        const name = $1(item).text();
        nameArr.push(name.trim().replace(/\s/gm, '-'))
    });

    var file = fs.createWriteStream('Killers.txt');
    file.on('error', function (err) {
        console.log(err);
    });
    nameArr.forEach(function (v) { file.write(v + '\n'); });
    file.end();
    // console.log('once');
}

// setInterval(serialKillerList, 2 * 60 * 1000);

serialKillerList();
