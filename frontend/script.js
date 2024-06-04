const API_URL = window.ENV.API_URL;
const PORT = window.ENV.PORT;

document.getElementById('shortenButton').addEventListener('click', async () => {
    const longUrl = document.getElementById('longUrl').value;
    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }


    // making API Call to shorten URL
    const response = await fetch('${API_URL}:${PORT}/api/v1/data/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl })
    });


    const data = await response.json();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p>Shortened URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a></p>
        <button onclick="copyToClipboard('${data.shortUrl}')">Copy to Clipboard</button>
        <p>Type: ${data.type}</p>
    `;
});

function copyToClipboard(text) {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    alert('Copied to clipboard');
}