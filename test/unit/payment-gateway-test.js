// libraries
const iso8583 = require('iso_8583');
const chai = require('chai');

// modules
const assert = chai.assert;
const expect = chai.expect;
const paymentGatewayUtil = require('../../scripts/util/payment-gateway-util.js');
const coinjsUtil = require('../../scripts/util/coinjs-util.js');

// constants

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
        expectedResponse.accountSecret = actualResponse.accountSecret;
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
    describe.only('verify', async () => {
      it('verify', async () => {
        const accountSecret = 'a';
        const wif = '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf';
        const keys = coinjsUtil.getKeys(wif);
        const fn = paymentGatewayUtil.verify;
        await expectErrorMessage('request is required.', fn);
        const request = {};
        await expectErrorMessage('request.action is required.', fn, request);
        request.action = '';
        await expectErrorMessage('request.action is required to be \'verify\'.', fn, request);
        request.action = 'register';
        await expectErrorMessage('request.account is required.', fn, request);
        request.account = keys.address;
        await expectErrorMessage('request[\'account-secret\'] is required.', fn, request);
        request['account-secret'] = accountSecret;
        await expectErrorMessage('request.signature is required.', fn, request);
        request.signature = coinjsUtil.sign(wif, accountSecret);
        const actualResponse = fn(request);
      });
    });
    describe('requestPayment', async () => {
      it('requestPayment', async () => {
        const fn = paymentGatewayUtil.requestPayment;
        fn();
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
});
