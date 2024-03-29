import {
  UniversalSentenceEncoder,
  load,
} from "@tensorflow-models/universal-sentence-encoder";
import "@tensorflow/tfjs";

var loaded = false;
let model: UniversalSentenceEncoder;

async function getSimilarities(answer, response) {
  if (!loaded) {
    console.log("loading model...");
    model = await load();
    loaded = true;
    console.log("model loaded!");
  }

  const embeddings1 = await model.embed([answer]);
  const embeddings2 = await model.embed([response]);

  const similarity = cosineSimilarity(
    Array.from(embeddings1.dataSync()),
    Array.from(embeddings2.dataSync()),
  );

  console.log("similarity: " + similarity);
  return Math.max(0, Math.round(similarity * 1000));
}

function cosineSimilarity(a, b) {
  const dotProduct = a.reduce((sum, value, index) => sum + value * b[index], 0);
  const magnitudeA = Math.sqrt(
    a.reduce((sum, value) => sum + value * value, 0),
  );
  const magnitudeB = Math.sqrt(
    b.reduce((sum, value) => sum + value * value, 0),
  );
  return dotProduct / (magnitudeA * magnitudeB);
}

console.log("complete");

export { cosineSimilarity, getSimilarities };
