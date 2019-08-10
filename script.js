//const url = `http://www.cheapshark.com/api/1.0/deals?storeID=6&desc=2&title=`
// const api = ``
// fix the space problem on search
function generateHtml(obj) {
    console.log(obj)
    return `
    <div class="game" >
        <div class="gameImg" style="background-image: url(${obj.thumb})">
            
        </div>
       <h2>${obj.title}</h2>
       <ul>
            <li><a href="https://www.metacritic.com${obj.metacriticLink}" target="_blank">Link to Metacritic to learn more about the game.</a></li>
            <li><p>Is on sale for $${obj.salePrice}.</p></li>
            <li><p>Normal price is $${obj.normalPrice}.</p></li>
            <li><p>You will save ${obj.savings}%.</p></li>
            <li><p>Most of steam rate this game ${obj.steamRatingText}.</p></li>
            <li><p>The steam percetage is ${obj.steamRatingPercent}%.</p></li>
            <li><p>The Metacritic score is ${obj.metacriticScore}%.</p></li>
            <li><p>The deal is rated ${obj.dealRating}/10.</p></li>
            <li><a href="http://www.cheapshark.com/redirect?dealID=${obj.dealID}" target="_blank">Link to deal.</a></li>
        </ul>
    </div>   
       `
}

function processGameData(responseData) {
    const gameDataHTML = responseData.map(function (obj) {
        return generateHtml(obj)
    }).join('')
    $('.display').html(gameDataHTML)
}

function getGame(searchTerm) {
    const url = `https://www.cheapshark.com/api/1.0/deals?&desc=2&title=${searchTerm}`

    fetch(url)
        .then(response => response.json())
        .then(responseJson => processGameData(responseJson));
}


function main() {
    $('form').on('submit', function (event) {
        event.preventDefault()
        const searchTerm = $(event.currentTarget).find('#search').val()
        getGame(searchTerm)
    })
}

$(main)