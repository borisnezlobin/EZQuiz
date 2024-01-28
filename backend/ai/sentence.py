import spacy_universal_sentence_encoder
import json

nlp = spacy_universal_sentence_encoder.load_model('en_use_lg')


with open("replayScript.json", "r+") as jsonFile:
    data = json.load(jsonFile)

    doc_1 = nlp(data['answer'])
    for i in data['players']:
        key = 'response-' + i
        doc_2 = nlp(str(data[key]))
        data[key] = doc_1.similarity(doc_2)

    jsonFile.seek(0)
    json.dump(data, jsonFile)
    jsonFile.truncate()