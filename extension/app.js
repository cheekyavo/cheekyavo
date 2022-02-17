$(function() {

    // Get listing details
    const listingDetails = getListingDetails();

    if (listingDetails.title) {
        const cachedResult =  getCachedResult(listingDetails);

        // Delay to allow follow page render
        setTimeout(() => {
            setUpHtml(listingDetails);
            cachedResult ? addFinalPrice(cachedResult.price) : startPriceSearch(listingDetails);
        }, 2000);

    }

});

function getCachedResult(listingDetails) {
    if (localStorage) {
        const lsCache = localStorage.getItem('avo-cache');
        const cache = lsCache ? JSON.parse(lsCache) : [];
        const cachedResult = cache.find(item => item.title === listingDetails.title);
        return cachedResult;
    }
}

function getListingDetails() {

    listingDetails = {};

    listingDetails['type'] = window.location.hostname.includes('realestate') ? 're' : 'tm';

    if (window.location.href.includes('rural')) { listingDetails['propertyCategory'] = 'rural'; }
    if (window.location.href.includes('residential')) { listingDetails['propertyCategory'] = 'residential'; }
    if (window.location.href.includes('business')) { listingDetails['propertyCategory'] = 'business'; }
    if (window.location.href.includes('commercial')) { listingDetails['propertyCategory'] = 'commercial'; }

    if (listingDetails.type === 'tm') {

        listingDetails.title = encodeURIComponent($('.tm-property-listing-body__title')?.text()?.trim()?.toLowerCase());
        const location = $('.tm-property-listing-body__location').text().trim().split(',');
        listingDetails.region = location[location.length - 1].trim().toLowerCase().replace(' ', '-');
        listingDetails.district = location[location.length - 2].trim().toLowerCase().replace(' ', '-');
        listingDetails.suburb = location[location.length - 3].trim().toLowerCase().replace(' ', '-');
        listingDetails['anchor'] = '.tm-property-listing-body__price';

    } else {

        listingDetails.title = encodeURIComponent($('div[data-test="listing-subtitle"]')?.text()?.trim()?.toLowerCase());
        listingDetails.region = $('a[data-test="breadcrumbs__region"]').text().trim().toLowerCase().replace(' ', '-');
        listingDetails.district = $('a[data-test="breadcrumbs__district"]').text().trim().toLowerCase().replace(' ', '-');
        listingDetails.suburb = $('a[data-test="breadcrumbs__suburb"]').text().trim().toLowerCase().replace(' ', '-');
        listingDetails['anchor'] = 'div[data-test="page-section"]';

    }

    return listingDetails;

}

function setUpHtml(listingDetails) {

    // Set some global styles
    $('head').append(`

        <style>

            #cheeky-avo {

                font-size: 18px;
                font-weight: 400;
                margin-top: 10px;

            }

            #cheeky-avo #cheeky-loader {

                width: 20px;
                height: 20px;
                border-radius: 100%;
                position: relative;
                display: inline-block;
                margin-right: 6px;
                margin-bottom: -3px;
            
            }
            
            #cheeky-avo #cheeky-loader:after {
                content: '';
                background: transparent;
                width: 140%;
                height: 140%;
                position: absolute;
                border-radius: 100%;
                top: -20%;
                left: -20%;
                opacity: 0.7;
                box-shadow: rgba(0, 0, 0, 0.6) -2px -3px 1px -1px;
                animation: rotate 1s infinite linear;
            }

            #cheeky-avo #cheeky-loader img {
                width: 18px;
                height: 18px;
                margin-left: 1px;
            }

            #cheeky-avo #cheeky-logo-loaded {
                height: 18px;
                width: 18px;
                margin-right: 7px;
                margin-bottom: -1px;
                display: inline-block;
            }

            #cheeky-avo #cheeky-content #cheeky-progress {
                // color: blue;
            }

            #cheeky-avo #cheeky-content #cheeky-error {
                color: red;
            }

            #cheeky-avo #cheeky-content #cheeky-success {
                color: green;
            }

            #cheeky-avo #cheeky-content #cheeky-price {
                margin-left: 6px;
            }

            @keyframes rotate {

                0% {
                  transform: rotateZ(0deg);
                }
            
                100% {
                  transform: rotateZ(360deg);
                }
            }

        </style>

    `);

    // Add cheeky container
    $(listingDetails.anchor).first().append(`

        <div id="cheeky-avo">

            <div id="cheeky-loader">
                <img src="data:image/png;base64, ${logo}"/>
            </div>

            <span id="cheeky-content">
                <span id="cheeky-progress">
                    Checking between
                </span>
                <span id="cheeky-price">
                    $${'0'.toLocaleString('en')} and $${'10000000'.toLocaleString('en')}
                </span>
            </span>

        </div>
    `);
}

function addFinalPrice(price) {
    try {
        $("#cheeky-progress").remove();
        $("#cheeky-price").remove();
        $("#cheeky-loader").remove();

        $('#cheeky-avo').prepend(`
            <img id="cheeky-logo-loaded" src="data:image/png;base64, ${logo}"/>
        `);

        $('#cheeky-content').append(`
            <span id="cheeky-success">
                Cheeky price discovered:
            </span>
            <span id="cheeky-price">
                <strong>$${price.toLocaleString('en')}</strong>
            </span>
        `);

    } catch (error) {
        $("#cheeky-progress").remove();
        $("#cheeky-price").remove();
        $("#cheeky-loader").remove();

        $('#cheeky-avo').prepend(`
            <img id="cheeky-logo-loaded" src="data:image/png;base64, ${logo}"/>
        `);

        $('#cheeky-content').append(`
            <span id="cheeky-error">
                Error processing this listing
            </span>
        `);

    }
}

async function startPriceSearch(listingDetails) {
    const result = await getListingPrice(listingDetails, 0, 10000000);

    const price = result.min;

    if (localStorage) {
        // Cache the price for future reference
        const lsCache = localStorage.getItem('avo-cache');
        const cache = lsCache ? JSON.parse(lsCache) : [];
        cache.push({'title': listingDetails.title, price: price});
        localStorage.setItem('avo-cache', JSON.stringify(cache));
    }

    addFinalPrice(price);
}

async function checkListingPrice(listingDetails, min, max) {

    let url;

    if (listingDetails.type === 're') {

        url = `www.realestate.co.nz/${listingDetails.propertyCategory}/sale/${listingDetails.region}/${listingDetails.district}/${listingDetails.suburb}?k="${listingDetails.title}"&minp=${min}&maxp=${max}`;

    } else {

        url = `https://www.trademe.co.nz/a/property/residential/sale/${listingDetails.region}/${listingDetails.district}/${listingDetails.suburb}/search?price_min=${min}&price_max=${max}&search_string=${listingDetails.title}`;

    }

    const data = await $.get(url).promise();
    const isValid = !data.toLowerCase().includes('showing 0 results') && !data.toLowerCase().includes('nothing to see here');

    if (isValid) { return { isValid, min, max }; }

    await delay(60000)
    return { isValid: false };

}

async function getListingPrice(listingDetails, min, max) {

    try {

        const promises = [];

        if (min === max) {

            promises.push(this.checkListingPrice(listingDetails, min, min));

        } else if ((max - min) === 1000) {

            promises.push(this.checkListingPrice(listingDetails, min, min));
            promises.push(this.checkListingPrice(listingDetails, max, max));

        } else {

            let numberOfLookups = 5;
            let increment = Math.round((max - min) / 5);

            if (increment % 1000 !== 0) {
                increment = 1000;
                numberOfLookups = Math.round((max - min) / 1000);
            }

            for (let index = 0; index < numberOfLookups; index++) {

                const newMin = index === 0 ? min : min + (increment * index);
                const newMax = increment + newMin;
                promises.push(this.checkListingPrice(listingDetails, newMin, newMax));

            }

        }

        // Get first valid result
        const results = await Promise.race(promises);

        $("#cheeky-progress").remove();
        $("#cheeky-price").remove();

        $('#cheeky-content').append(`
            <span id="cheeky-progress">
                Checking between
            </span>
            <span id="cheeky-price">
                $${results?.min?.toLocaleString('en')} and $${results?.max?.toLocaleString('en')}
            </span>
        `);

        if (results.isValid && (results.max - results.min) === 0) { // Last iteration of the recursion

            return results;

        } else if (results.isValid && (results.max - results.min) !== 0) { // Need to go deeper for the price

            return this.getListingPrice(listingDetails, results.min, results.max);

        } else {

            console.error('No Results Found');
            throw new Error('No Results Found');

        }

    } catch (error) {

        console.error(error);
        throw new Error('No Results Found');

    }

}

const delay = ms => new Promise(res => setTimeout(res, ms));

const logo = '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';
