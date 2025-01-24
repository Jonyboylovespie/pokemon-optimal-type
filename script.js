function solveWordle(url) {
    let startIndex = url.indexOf("word=") + 5;
    let endIndex = url.indexOf("&");
    
    let scrambledString = url;
    if (startIndex > 4)
    {
        scrambledString = url.substring(startIndex);
    }
    if (endIndex > startIndex) 
    {
        scrambledString = url.substring(startIndex, endIndex);
    }
    
    document.getElementById('answer').innerHTML = decrypt(scrambledString).toUpperCase();
}

function decrypt(ciphertext) {
    let keyword = "wordle";
    let keywordLength = keyword.length;
    let decryptedText = "";

    for (let i = 0; i < ciphertext.length; i++) {
        let char = ciphertext[i];
        let keywordShift = keyword.charCodeAt(i % keywordLength) - 'a'.charCodeAt(0);
        let decryptedChar = String.fromCharCode(((char.charCodeAt(0) - 'a'.charCodeAt(0) - keywordShift + 26) % 26) + 'a'.charCodeAt(0));
        decryptedText += decryptedChar;
    }

    return decryptedText;
}