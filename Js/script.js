const expandDetails = document.querySelector('.expand__details'); 
const timezoneDetails = document.querySelector('.timezone-details');
const showStatus = document.querySelector('.expand__details .show-status');
const arrowUp = document.querySelector('.up');
const arrowDown = document.querySelector('.down');
const refreshQuote = document.querySelector('.fa-sync-alt');
const quote = document.querySelector('.quote');
const quoteAuthor = document.querySelector('.quote-sayer');
const time = document.querySelector('.time');
const main = document.querySelector('.main');
const left = document.querySelector('.left');
const right = document.querySelector('.right');
let locationn;
let timeStandard;

// Get location Time Data
const getCurrentLocation = async() => {
    try {
        const API_URL = `https://ipapi.co/json`;
    
        const response = await fetch(API_URL);
        const currentLocation = await response.json();
        locationn = currentLocation;
    
        getTimeData();
    } catch (err) {
        console.log(err);
    }
};

// Quotes
const getQuote = async() => {
    try {
        const API_URL = 'https://type.fit/api/quotes';
    
        const response = await fetch(API_URL);
        const quote = await response.json();
    
        fillQuote(quote)
    } catch (err) {
        console.log(err)
        quote.innerHTML = '...';
        quoteAuthor.innerHTML = 'Quote unavailable, Try refresh';
    }
}

const fillQuote = (data) => {
    const randomQuote = data[Math.floor(Math.random() * 1000)];

    const { text, author } = randomQuote;

    quote.innerHTML = text;
    quoteAuthor.innerHTML = author;
}

//timezone Data
const getTimeData = async() => {
    try {
        const API_URL = `http://worldtimeapi.org/api/ip`;
        const response = await fetch(API_URL);
        const timeData = await response.json();
        timeStandard = timeData.abbreviation;

        left.innerHTML = `
            <div class="block">
                <p class="title">CURRENT TIMEZONE</p>
                <h1 class="detail timezone">${timeData.timezone}</h1>
            </div>

            <div class="block">
                <p class="title">DAY OF THE YEAR</p>
                <h1 class="detail">${timeData['day_of_year']}</h1>
            </div>
        `;

        right.innerHTML = `
            <div class="block">
                <p class="title">DAY OF THE WEEK</p>
                <h1 class="detail">${timeData['day_of_week'] + 1}</h1>
            </div>

            <div class="block">
                <p class="title">WEEK NUMBER</p>
                <h1 class="detail">${timeData['week_number']}</h1>
            </div>
        `;

    } catch (err) {
        left.innerHTML = `
            <div class="block">
                <p class="title">CURRENT TIMEZONE</p>
                <h1 class="detail">Data Unavailable</h1>
            </div>

            <div class="block">
                <p class="title">DAY OF THE YEAR</p>
                <h1 class="detail">Data Unavailable</h1>
            </div>
        `;

        right.innerHTML = `
            <div class="block">
                <p class="title">DAY OF THE WEEK</p>
                <h1 class="detail">Data Unavailable</h1>
            </div>

            <div class="block">
                <p class="title">WEEK NUMBER</p>
                <h1 class="detail">Data Unavailable</h1>
            </div>
        `;
    }
}

// Get Time
const getTime = () => {
    const timestamp = new Date();
    const hours = timestamp.getHours();
    const twelveHourEquivalent = hours % 12;
    const minutes = timestamp.getMinutes();
    
    let timeOfDay;
    let periodOfDay;
    switch (true) {
        case hours < 6:
            timeOfDay = 'morning';
            periodOfDay = 'AM';
            main.className ='main night';
        case hours < 12:
            timeOfDay = 'morning';
            periodOfDay = 'AM';
            break;
        case (hours >= 12) && (hours < 18):
            timeOfDay = 'afternoon';
            periodOfDay = 'PM';
            main.className= 'main morning';
            break;
        case (hours >= 18) && (hours < 20):
            timeOfDay = 'evening';
            periodOfDay = 'PM';
            main.className = 'main evening';
            break;
        default:
            timeOfDay = 'night';
            periodOfDay = 'PM';
            main.className = 'main night';
            break;
    }


    time.innerHTML = `
        <h3 class='greetings'>
            ${
                timeOfDay === 'evening' || timeOfDay === 'night' ?
               '<i class="fas fa-moon"></i>' :
                '<i class="fas fa-sun"></i>'
            } 
            Good ${timeOfDay}, IT'S CURRENTLY
        </h3>

        <div class="main-time">
            <h1>
                ${twelveHourEquivalent < 10 ? `0${twelveHourEquivalent}` : twelveHourEquivalent}:${minutes < 10 ? `0${minutes}` : minutes}  
            </h1>
            <div>
                <sup>${timeStandard ? timeStandard : '...'}</sup>
                <sub>${periodOfDay}</sub>
            </div>
        </div>

        <h2 class="location">
            In ${locationn !== undefined ? locationn.city : '...'}, ${locationn !== undefined ? locationn.country_name : ''}
        </h2>
    `;
}

expandDetails.addEventListener('click', () => {
    timezoneDetails.classList.toggle('show');
    timezoneDetails.style.maxHeight = !timezoneDetails.style.maxHeight ? `${timezoneDetails.scrollHeight + 58}px` : null;

    arrowUp.classList.toggle('none');
    arrowDown.classList.toggle('none');

    showStatus.innerHTML = showStatus.innerHTML === `MORE` ? 'LESS' : 'MORE'; 

    console.log(timezoneDetails.style.maxHeight);
});

window.addEventListener('load', getCurrentLocation);
refreshQuote.addEventListener('click', getQuote);

setInterval(() => {
    getCurrentLocation();
}, 3600000);

setInterval(() => {
    getQuote();
}, 15000);

setInterval(() => {
    getTime();
}, 1000)
