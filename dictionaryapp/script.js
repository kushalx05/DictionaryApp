const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

// Initially hide the result div
resultDiv.style.display = 'none';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    try {
        // Show the result div and indicate data fetching
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = "Fetching Data...";

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();

        if (data.title && data.title === "No Definitions Found") {
            resultDiv.innerHTML = `<h2>No definitions found for the word "${word}".</h2>`;
            return;
        }

        const meanings = data[0].meanings[0];
        const definitions = meanings.definitions[0];

        resultDiv.innerHTML = `
            <h2><strong>Word: </strong>${data[0].word}</h2>
            <p class="partOfSpeech"><strong>Part of Speech: </strong>${meanings.partOfSpeech}</p>
            <p><strong>Meaning: </strong>${definitions.definition === undefined ? "Not Found" : definitions.definition}</p>
            <p><strong>Example: </strong>${definitions.example === undefined ? "Not Found" : definitions.example}</p>
            <p><strong>Antonyms: </strong>
        `;

        if (definitions.antonyms.length === 0) {
            resultDiv.innerHTML += `<span>Not Found</span>`;
        } else {
            resultDiv.innerHTML += `<ul>`;
            for (let i = 0; i < definitions.antonyms.length; i++) {
                resultDiv.innerHTML += `<li>${definitions.antonyms[i]}</li>`;
            }
            resultDiv.innerHTML += `</ul>`;
        }

        resultDiv.innerHTML += `<br><a href="${data[0].sourceUrls[0]}" target="_blank">Read More</a>`;
        console.log(data);
    } catch (error) {
        resultDiv.innerHTML = `<h2>Error: ${error.message}</h2>`;
    }
};
