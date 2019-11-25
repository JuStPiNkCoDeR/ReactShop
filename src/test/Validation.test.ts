import Validation from '../ts/Validation';

describe('Validation', () => {
   it('encode HTML correctly', () => {
       let input = 'Странный';

       let output = Validation.convertHTMLtoText(input);

       console.log(output);
   });
});