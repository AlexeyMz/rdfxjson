import * as SparqlJs from 'sparqljs';
import * as Ramp from '../../src/index';
import { AlexanderTheThirdDescendants, Prefixes } from './wikidata-common';

const query = Ramp.generateQuery({
  shape: AlexanderTheThirdDescendants,
  prefixes: Prefixes,
  unstable_onEmit: (shape, subject, out) => {
    // Add FILTER(LANG(?var) = "en") to fetch only english labels
    if (shape.type === 'literal' && shape.language) {
      out.push({
        type: 'filter',
        expression: {
          type: 'operation',
          operator: '=',
          args: [
            {
              type: 'operation',
              operator: 'lang',
              args: [subject],
            },
            `"${shape.language}"` as SparqlJs.Term
          ]
        }
      });
    }
  }
});

const generator = new SparqlJs.Generator();
const queryString = generator.stringify(query);

console.log('# Execute the following query at https://query.wikidata.org/');
console.log(queryString);
