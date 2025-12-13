const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const xButton = document.getElementById('X');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show loading
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide loading
function complete() {
    loader.hidden = true;
    quoteContainer.hidden = false;
}

// Get Quote From API
async function getQuotes() {
    loading();
    const apiUrl = 'https://dummyjson.com/quotes/random';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Use correct fields for dummyjson API
        quoteText.textContent = data.quote;
        authorText.textContent = data.author || 'Unknown';

        // Reduce font size for long quotes
        if (data.quote.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }

        complete();
    } catch (error) {
        console.log('Error fetching quote:', error);
        quoteText.textContent = 'Something went wrong.';
        authorText.textContent = '';
        complete();
    }
}

// X Quote
function xQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const xUrl = `https://x.com/intent/post?text=${encodeURIComponent(quote + " - " + author)}`;
    window.open(xUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuotes);
xButton.addEventListener('click', xQuote);

// On Load
getQuotes();
