// libraries
const request = require('request');
const chai = require('chai');

// modules
const coinjsUtil = require('../../scripts/util/coinjs-util.js');
const expect = chai.expect;

// constants
const baseUrl = 'https://api.mbc.wiki/';
const address = 'BbcP66j4dY5B6NZ9253MArBCE5hL1FYCVH';

// variables

// initialization

// functions

const addressBalance = async (address) => {
  const url = `${baseUrl}?method=blockchain.address.balance&params[]=${address}`;
  return await getRequest(url);
};

const estimateFee = async () => {
  return await getRequest(baseUrl, {
    method: 'blockchain.estimatesmartfee',
    params: ['30'],
  }, 'POST');
};

const txBroadcast = async (rawtx) => {
  return await postRequest(baseUrl, {
    method: 'blockchain.transaction.send',
    params: [rawtx],
  }, 'POST');
};


const getRequest = async (url, formData) => {
  return new Promise((resolve) => {
    const requestData = {
      headers: {
        'Content-Type': 'application/json',
      },
      uri: url,
      method: 'GET',
      timeout: 30000,
    };
    if (formData !== undefined) {
      requestData.body = JSON.stringify(formData);
    }

    request(requestData, (err, httpResponse, body) => {
      console.log( 'sendRequest response', err, body );

      if (err !== null) {
        console.log('sendRequest response', err, body);
      }

      if (body === undefined) {
        resolve(undefined);
      } else {
        const json = JSON.parse(body);
        resolve(json);
      }
    });
  });
};


const postRequest = async (url, formData) => {
  if (formData == undefined) {
    throw Error(`'formData' is a required parameter.`);
  }
  return new Promise((resolve) => {
    const body = JSON.stringify(formData);
    console.log( 'sendRequest request', body );

    request({
      headers: {
        'Content-Type': 'application/json',
      },
      uri: url,
      body: body,
      method: 'POST',
      timeout: 30000,
    }, (err, httpResponse, body) => {
      console.log( 'sendRequest response', err, body );

      if (err !== null) {
        console.log('sendRequest response', err, body);
      }

      if (body === undefined) {
        resolve(undefined);
      } else {
        const json = JSON.parse(body);
        resolve(json);
      }
    });
  });
};
describe('coinjs', () => {
  it('coinjs keys0', async () => {
    // random one from https://allprivatekeys.com/allprivatekeys.php
    // Private Key (WIF) 	Address 	Compressed Address
    // 5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf 	1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm 	1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH
    const wif = '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf';
    // const address = '1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm';
    const expectedKeys = {};
    expectedKeys.privkey='0000000000000000000000000000000000000000000000000000000000000001';
    expectedKeys.pubkey='0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798';
    expectedKeys.address='BeTx9ye6pkuYQapErgmcS7VSVE95Wwkeiz';
    expectedKeys.wif='5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf';
    expectedKeys.compressed=undefined;
    const keys = coinjsUtil.getKeys(wif);
    // console.log(keys);
    expect(keys).to.deep.equal(expectedKeys);
  });
  it('coinjs keys1', async () => {
    // random one from https://allprivatekeys.com/allprivatekeys.php
    // Private Key (WIF) 	Address 	Compressed Address
    // 5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAnchuDf 	1EHNa6Q4Jz2uvNExL497mE43ikXhwF6kZm 	1BgGZ9tcN4rm9KBzDn7KprQz87SZ26SAMH
    const wif = '5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAvUcVfH';
    // const address = 'BeTx9ye6pkuYQapErgmcS7VSVE95Wwkeiz';
    const expectedKeys = {};
    expectedKeys.privkey='0000000000000000000000000000000000000000000000000000000000000002';
    expectedKeys.pubkey='02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5';
    expectedKeys.address='BUQ3Hqmck9FWChkpWVF2tPEbK7LXmNZ4CS';
    expectedKeys.wif='5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAvUcVfH';
    expectedKeys.compressed=undefined;
    const keys = coinjsUtil.getKeys(wif);
    // console.log(keys);
    expect(keys).to.deep.equal(expectedKeys);
  });
});

describe('mbc', () => {
  it('mbc fee', async () => {
    const response = await estimateFee();
    console.log(response);
  });
  it('mbc balance', async () => {
    const response = await addressBalance(address);
    console.log(response);
  });
});
