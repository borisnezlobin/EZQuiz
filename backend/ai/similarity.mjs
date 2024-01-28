import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import fs from 'fs';

const model = await use.load();

function getSimilarities(data){
    model.embed([data['answer']]).then(embeddings => {
        const doc1Embedding = embeddings[0];
        const playerKeys = data['players'].map(i => 'response-' + i);
        Promise.all(playerKeys.map(key => model.embed([String(data[key])])))
        .then(responsesEmbeddings => {
            responsesEmbeddings.forEach((doc2Embedding, index) => {
                const dotProduct = doc1Embedding.reduce((accumulator, currentValue) => accumulator + currentValue * doc2Embedding[index], 0);
                const magnitudeA = Math.sqrt(doc1Embedding.reduce((accumulator, currentValue) => accumulator + currentValue * currentValue, 0));
                const magnitudeB = Math.sqrt(doc2Embedding.reduce((accumulator, currentValue) => accumulator + currentValue * currentValue, 0));
                const similarity = dotProduct / (magnitudeA * magnitudeB);
                data[playerKeys[index]] = String(Math.round(similarity * 1000));
            });
            console.log(data);
        });
    });
}

function test(){
    const str = fs.readFileSync("data.json");

    getSimilarities(JSON.parse(str));
}
test();

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