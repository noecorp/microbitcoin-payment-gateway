// libraries
const iso8583 = require('iso_8583');
const chai = require('chai');

// modules
const expect = chai.expect;

// constants

// variables

// initialization

// functions
describe('iso8583', () => {
  describe('iso8583 normalizeZero', () => {
    it('message', async () => {
      const testData = {
        '0': '0100',
        '2': '5413330',
        '3': '000000',
        '4': '000000002000',
        '7': '0210160607',
        '11': '148893',
        '12': '160607',
        '13': '0210',
        '14': '2512',
        '18': '4111',
        '22': '141',
        '23': '003',
        '25': '00',
        '26': '12',
        '35': '5413330089020011D2512601079360805F',
        '41': '31327676',
        '42': '4D4F424954494C4',
        '43': 'My Termianl Business                    ',
        '49': '404',
        '45': '0303030204E4149524F4249204B452dataString04B45',
        '123': '09010001000105010103040C010001',
      };
      const descs = iso8583.getFieldDescription(Object.keys(testData));
    	// console.log(descs);
    });
  });
});
