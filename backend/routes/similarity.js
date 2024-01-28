require('@tensorflow/tfjs');
const tf = require('@tensorflow/tfjs-node');
const use = require('@tensorflow-models/universal-sentence-encoder');
const fs = require('fs');

var loaded = false;
var model = use.load();
model.then((m) => {
    model = m;
    loaded = true
});

function getSimilarities(answer, response){
    if (loaded == true) {
        var score = 0;
        model.embed([answer]).then(embeddings => {
            const doc1Embedding = embeddings;
            model.embed([response]).then(responsesEmbeddings => {
                const similarity = cosineSimilarity(Array.from(doc1Embedding.dataSync()), Array.from(doc2Embedding.dataSync()));
                score = Math.round(similarity * 1000);
            });
        });
        return score;
    }
}

function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

console.log('complete');