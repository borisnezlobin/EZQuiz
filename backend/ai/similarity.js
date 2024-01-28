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

function getSimilarities(data){
    if (loaded == true) {
        model.embed([data['answer']]).then(embeddings => {
            const doc1Embedding = embeddings;
            const playerKeys = data['players'].map(i => 'response-' + i);
            Promise.all(playerKeys.map(key => model.embed([String(data[key])])))
            .then(responsesEmbeddings => {
                responsesEmbeddings.forEach((doc2Embedding, index) => {
                    const similarity = cosineSimilarity(Array.from(doc1Embedding.dataSync()), Array.from(doc2Embedding.dataSync()));
                    data[playerKeys[index]] = String(Math.round(similarity * 1000));
                });
                console.log(data);
            });
        });
    }
}

function test(){
    const str = fs.readFileSync("data.json");

    getSimilarities(JSON.parse(str));
}
setTimeout(() => {
    test();
  }, "10000")

function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

console.log('complete');

// function cosim(a, b) {
//     const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
//     const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
//     const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
//     return dotProduct / (magnitudeA * magnitudeB);
// }

// {
//     "players" : ["boris nezbobin", "jarman yan", "canner lei"],
//     "answer" : "he is wearing red T-shirt",
//     "response-boris nezbobin" : "the person wears a red T-shirt",
//     "response-jarman yan" : "the boy is wearing red T-shirts",
//     "response-canner lei" : "red T-shirts the person is wearing"
// }