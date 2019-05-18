// libraries
const iso8583 = require('iso_8583');
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;
const paymentGatewayUtil = require('../../scripts/util/payment-gateway-util.js');
const coinjsUtil = require('../../scripts/util/coinjs-util.js');

// constants
const wif0 = '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf';
const wif1 = '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAvUcVfH';

// variables

// initialization

// functions
const expectErrorMessage = async (errorMessage, fn, arg1, arg2, arg3, arg4) => {
  try {
    await fn(arg1, arg2, arg3, arg4);
  } catch (err) {
    assert.isDefined(err);
    if (err.message != errorMessage) {
      console.trace('expectErrorMessage', errorMessage, fn, err);
      expect(err.message).to.equal(errorMessage);
    }
    return;
  }
  assert.fail(`no error was thrown, expected err.message='${errorMessage}'`);
};

const registerAccount = (wif) => {
  const keys = coinjsUtil.getKeys(wif);
  const request = {};
  request.action = 'register';
  request.account = keys.address;
  const response = paymentGatewayUtil.register(request);
  if (response.valid != 'true') {
    throw new Error(`register failed with message ${expectedResponse.message}`);
  }
  return response['account-secret'];
};

describe('payment-gateway', () => {
  describe('payment-gateway', () => {
    describe('register', async () => {
      const fn = paymentGatewayUtil.register;
      it('register errors', async () => {
        await expectErrorMessage('request is required.', fn);
        const request = {};
        await expectErrorMessage('request.action is required.', fn, request);
        request.action = '';
        await expectErrorMessage('request.action is required to be \'register\'.', fn, request);
        request.action = 'register';
        await expectErrorMessage('request.account is required.', fn, request);
        request.account = 'a';
        const actualResponse = fn(request);
      });
      it('register valid true', async () => {
        const request = {};
        request.action = 'register';
        request.account = 'a';
        const actualResponse = fn(request);
        const expectedResponse = {};
        expectedResponse.valid = 'true';
        expectedResponse['account-secret'] = actualResponse['account-secret'];
        expectedResponse.message = 'success';
        expect(expectedResponse).to.deep.equal(actualResponse);
      });
      it('register valid false', async () => {
        const request = {};
        request.action = 'register';
        request.account = '';
        const actualResponse = fn(request);
        const expectedResponse = {};
        expectedResponse.valid = 'false';
        expectedResponse.message = 'failure, account must have more than zero characters';
        expect(expectedResponse).to.deep.equal(actualResponse);
      });
    });
    describe('verify', async () => {
      it.skip('verify', async () => {
        const accountSecret = 'a';
        const wif = wif0;
        const keys = coinjsUtil.getKeys(wif);
        const fn = paymentGatewayUtil.verify;
        await expectErrorMessage('request is required.', fn);
        const request = {};
        await expectErrorMessage('request.action is required.', fn, request);
        request.action = '';
        await expectErrorMessage('request.action is required to be \'verify\'.', fn, request);
        request.action = 'verify';
        await expectErrorMessage('request.account is required.', fn, request);
        request.account = keys.address;
        await expectErrorMessage('request[\'account-secret\'] is required.', fn, request);
        request['account-secret'] = accountSecret;
        await expectErrorMessage('request.signature is required.', fn, request);
        request.signature = coinjsUtil.sign(wif, accountSecret);
        const actualResponse = fn(request);
        const expectedResponse = {};
        expectedResponse.valid = 'true';
        expect(expectedResponse).to.deep.equal(actualResponse);
      });
    });
    describe('requestPayment', async () => {
      it('requestPayment', async () => {
        const secret0 = registerAccount(wif0);
        const secret1 = registerAccount(wif1);
        const keys0 = coinjsUtil.getKeys(wif0);
        const keys1 = coinjsUtil.getKeys(wif1);
        const nonce = paymentGatewayUtil.getRandomHex32();
        const fn = paymentGatewayUtil.requestPayment;
        const request = {};
        request.action = 'request-payment';
        request['to-account'] = keys1.address;
        request['from-account'] = keys0.address;
        request['to-account-nonce'] = nonce;
        request['amount'] = 1;
        request['timeout'] = 30000;
        request['to-account-secret'] = secret1;

        fn(request);
        const actualResponse = fn(request);
        const expectedResponse = {};
        expectedResponse.valid = 'true';
        expectedResponse.message = 'success';
        expectedResponse['to-account-nonce'] = actualResponse['to-account-nonce'];
        expect(expectedResponse).to.deep.equal(actualResponse);
      });
    });
    describe('listPaymentRequests', async () => {
      it('listPaymentRequests', async () => {
        const fn = paymentGatewayUtil.listPaymentRequests;
        fn();
      });
    });
    describe('paymentResponse', async () => {
      it('paymentResponse', async () => {
        const fn = paymentGatewayUtil.paymentResponse;
        fn();
      });
    });
    describe('paymentCancel', async () => {
      it('paymentCancel', async () => {
        const fn = paymentGatewayUtil.paymentCancel;
        fn();
      });
    });
    describe('listPaymentResponse', async () => {
      it('listPaymentResponse', async () => {
        const fn = paymentGatewayUtil.listPaymentResponse;
        fn();
      });
    });
  });

  beforeEach(async () => {
    paymentGatewayUtil.init();
  });


  afterEach(async () => {
    paymentGatewayUtil.deactivate();
  });
});
