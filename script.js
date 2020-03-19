const STATE = {
    storeID: null
};

function generateHtml(obj) {
    return `
    <div class="game" >
        <div class="gameImg" style="background-image: url(${obj.thumb})">
            
        </div>
       <h2>${obj.title}</h2>
       <ul class="gameObj">
            <li><a class="big" href="https://www.metacritic.com${obj.metacriticLink}" target="_blank">Link to Metacritic to learn more about the game.</a></li>
            <li><p class="bigT" >Is on sale for $${obj.salePrice}.</p></li>
            <li><p class="bigT" >Normal price is $${obj.normalPrice}.</p></li>
            <li><p class="bigT" >You will save ${obj.savings}%.</p></li>
            <li><p class="bigT" >Most of steam rate this game ${obj.steamRatingText}.</p></li>
            <li><p class="bigT" >The steam percetage is ${obj.steamRatingPercent}%.</p></li>
            <li><p class="bigT" >The Metacritic score is ${obj.metacriticScore}%.</p></li>
            <li><p class="bigT" >The deal is rated ${obj.dealRating}/10.</p></li>
            <li><a class="big" href="https://www.cheapshark.com/redirect?dealID=${obj.dealID}" target="_blank">Link to deal.</a></li>
        </ul>
    </div>   
       `;
}

function gameNotFound() {
    return `
    <h2 class="detail">Please make sure you spelled the game correctly Also, make sure the game you are looking for is playable
            on PC. This app will only find games that are on sale for PC(Steam, Uplay, Origin, ETC...).
            </h2>
    `
}

function processGameData(responseData) {
    if (responseData && responseData.length) {
        const gameDataHTML = responseData.map(function (obj) {
            return generateHtml(obj)
        }).join('')
        $('.display').html(gameDataHTML)
    } else {
        $('.display').html(gameNotFound)
    }

}

function getGame(searchTerm) {
    const url = `https://www.cheapshark.com/api/1.0/deals?onSale=1&desc=2&sortBy=Title&title=${searchTerm}`
    fetch(url)
        .then(response => response.json())
        .then(responseJson => processGameData(responseJson));
}

//this is the extra version 2.0 copy when ready
function extraHtml(obj) {
    return `
    <section class="cards">
        <img class="banner" src="https://www.cheapshark.com${obj.images.banner}" alt="store icon">
        <ul class="deals" id="${obj.storeID}">
        </ul>
    </section>
    `
}

function dealsHTML(obj) {
    return `
    <li><div class="leftSide tooltip"><a class="small" href="https://www.cheapshark.com/redirect?dealID=${obj.dealID}" target="_blank">${obj.title}</a>
    <span class="tooltiptext"><img src="${obj.thumb}" class="toolTipImg" /></span>
    </div><div class="rightSide"><del>$${obj.normalPrice}</del><span class="priceBox">$${obj.salePrice}</span></div></li>
    `
}

function processExtra(data) {
    const extaDataHTML = data.map(function (obj) {
        if (obj.isActive !== 1) {
            return
        }
        return extraHtml(obj)
    }).join('')
    $('.info').html(extaDataHTML)
    STATE.stores = data
    deals()
}

function processDeals(dealData, storeID) {
    const dealsDataHTML = dealData.map(function (obj) {
        return dealsHTML(obj)
    }).join('')
    $('#' + storeID).html(dealsDataHTML)
}

function extra() {
    const url2 = `https://www.cheapshark.com/api/1.0/stores`
    fetch(url2)
        .then(response => response.json())
        .then(responseJson => processExtra(responseJson));
}

function deals() {

    STATE.stores.forEach((element) => {
        const url3 = `https://www.cheapshark.com/api/1.0/deals?storeID=${element.storeID}&pageSize=7`
        fetch(url3)
            .then(response => response.json())
            .then(responseJson => processDeals(responseJson, element.storeID));
    });
}


function main() {
    extra()
    $('form').on('submit', function (event) {
        event.preventDefault()
        const searchTerm = $(event.currentTarget).find('#search').val()
        getGame(searchTerm)
    })
}
$(main)