import spacy_universal_sentence_encoder
import json

nlp = spacy_universal_sentence_encoder.load_model('en_use_lg')


jsonFile = open("data.json", "r")
data = json.load(jsonFile)
jsonFile.close()

doc_1 = nlp(data['answer'])
for i in data['players']:
    key = 'response-' + i
    doc_2 = nlp(str(data[key]))
    data[key] = str(int(doc_1.similarity(doc_2)*1000))

jsonFile = open("data.json", "w+")
jsonFile.write(json.dumps(data))
jsonFile.close()

# {
#     "players" : ["boris nezbobin", "jarman yan", "canner lei"],
#     "answer" : "he is wearing red T-shirt",
#     "response-boris nezbobin" : "the person wears a red T-shirt",
#     "response-jarman yan" : "the boy is wearing red T-shirts",
#     "response-canner lei" : "red T-shirts the person is wearing"
# }

print('complete')