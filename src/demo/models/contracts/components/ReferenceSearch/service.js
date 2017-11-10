export default class ReferenceSearchService {

    examples = {
      "body": [
        {
          "contractId": "1",
          "name": "example1",
          "_objectLabel": "example1"
        },
        {
          "contractId": "2",
          "name": "example2",
          "_objectLabel": "example2"
        },
        {
          "contractId": "3",
          "name": "example3",
          "_objectLabel": "example3"
        }
      ],
      "headers": {
        "content-range": "items 0-2/3"
      }
    };


    getExamples(params) {
      console.log('params')
      console.log(params)
      if (params.contractId) {
        let items = [];
        if (params.contractId) {
          items = this.examples.body.filter((example) => {
            return example.contractId.includes(params.contractId)
          })
        }
        return Promise.resolve({
          "body": items,
          "headers": {
            "content-range": `items 0-9/${items.length}`
          }
        })
      }
      return Promise.resolve(this.examples)
    }
  }