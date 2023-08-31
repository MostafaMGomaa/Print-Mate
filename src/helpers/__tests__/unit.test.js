const isUnEmail = require('../isUnEmail');

describe('Chcek if given mail is univeristy mails', () => {
  const goodMail = ['mostafa@alex.edu.eg', '1243@alex.edu.eg'];
  const badMail = ['', 'mostafa', '5@email', 'mostafa@gmail.com'];

  goodMail.map((email) => {
    it(`Should accept '${email}' as uni mail`, () => {
      expect(isUnEmail(email)).toBe(true);
    });
  });

  badMail.map((email) => {
    it(`Should reject '${email}' as uni mail`, () => {
      expect(isUnEmail(email)).toBe(false);
    });
  });
});
