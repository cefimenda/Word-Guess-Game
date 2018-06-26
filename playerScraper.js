var puppeteer = require('puppeteer');
const util = require('util')

let scrape = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: false}); //opens browser - headless false --> displays action on screen
    const page = await browser.newPage(); //opens page

    await page.goto('https://www.fifa.com/worldcup/players/browser/'); //goes to link
    await page.waitFor(1000); // waits for the page to load - not always necessary
    // Scrape

    const result = await page.evaluate(() => { //takes page and makes it accessible thru DOM
        var players = []
        var i = 0
        while (players.length<736){
            var player = {}
            i += 1;

            //NAME
            var nameElem = document.querySelector("#team-players-by-browser > div > div > div:nth-child("+i+") > a > div > div.fi-p__wrapper-text > div.fi-p__name")
            if (nameElem == undefined || nameElem == null){continue}
            var name = nameElem.innerHTML.split("\n          ")[1].split("\n")[0]

            //NATIONALITY
            var natElem = document.querySelector("#team-players-by-browser > div > div > div:nth-child("+i+") > a > div > div.fi-p__wrapper-text > div.fi-p__country")
            var nat = natElem.innerHTML.split("\n            ")[1].split("\n")[0]

            //POSITION
            var posElem = document.querySelector("#team-players-by-browser > div > div > div:nth-child("+i+") > a > div > div.fi-p__wrapper-text > div.fi-p__role")
            var pos = posElem.innerHTML.split("\n")[1].split(" ")[0]

            //IMAGE
            var imageElem = document.querySelector("#team-players-by-browser > div > div > div:nth-child("+i+") > a > div > div.fi-p__picture > svg > image")
            var image = imageElem.getAttribute("xlink:href")

            player.name = name;
            player.nat = nat;
            player.pos = pos;
            player.image = image;

            players.push(player)
        }
        return players;
    });

    browser.close();     //close browser
    return result;
};

scrape().then((value) => {
    console.log(util.inspect(value, { maxArrayLength: null }))
});

