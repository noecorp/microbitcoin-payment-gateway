# microbitcoin-payment-gateway

### api calls

The payment processor will have the following API calls:
(as the request contains a secret, all API calls are HTTPS POST actions)

1) register account.

    registers an account. the registration is not complete until the registration is verified.

    account : a banano account.
    account-secret : a 32 byte key that controls the account.
    valid: true or false, if the verification was successful or not.
    message: 'success' or a message saying why the request was not valid.

    request:
    ```
    {
      "action":"register",
      "account":"<account>",
    }
    ```

    response:
    ```
    {
      "valid":"true/false",
      "message":"<reason for valid being true or false>"
      "account-secret":"<account-secret>"
    }
    ```

2) verify registration.

    account : a banano account.
    account-secret : a 32 byte key that controls the account.
    signature: The account signs the account-secret to prove it has control of the account.

    request:
    ```
    {
      "action":"verify",
      "account":"<account>",
      "account-secret":"<account-secret>",
      "signature":"<signature>"
    }
    ```

    response:
    ```
    {
      "valid":"true/false",
      "message":"<reason for valid being true or false>"
    }
    ```

    account : a banano account.
    account-secret : a 32 byte key that controls the account.
    signature: The account signs the account-secret to prove it has control of the account.
    valid: true or false, if the verification was successful or not.
    message: 'success' or a message saying why the request was not valid.

3) request payment

    request:
    ```
    {
      "action":"request-payment",
      "to-account":"<to-account>",
      "from-account":"<from-account>",
      "to-account-nonce":"<to-account-nonce>"
      "amount":"<amount>",
      "timeout":"<timeout>",
      "to-account-secret":"<to-account-secret>"
    }
    ```

    response:
    ```
    {
      "valid":"true/false",
      "to-account-nonce":"<to-account-nonce>",
      "message":"<reason for valid being true or false>"
    }
    ```


    This is the 'to-account' asking the 'from-account' to pay them.
    The timeout will come up in the next method
    the 'to-account-nonce' is a unique id the 'to-account' uses to track the orders.

3) list-payment-requests (account, account-secret)

    request:
    ```
    {
      "action":"list-payment-requests",
      "account":"<account>",
      "account-secret":"<account-secret>"
    }
    ```

    response:
    ```
    {
      "valid":"true/false",
      "message":"<reason for valid being true or false>"
      "payment-requests": [
        {        
          "to-account":"<to-account>",
          "amount":"<amount>",
          "timeout":"<timeout>",
          "payment-request-nonce":"<payment-request-nonce>"
        }
      ]
    }
    ```

    This lists the requests from request-payment.
    Once the timeout is reached, the payment request is automatically removed from the list.

4) payment-response (to-account, from-account, transaction-hash)
This lists the payment response, on-chain.

    request:
    ```
    {
      "action":"payment-response",,
      "payment-request-nonce":"<payment-request-nonce>"
      "from-account-secret":"<from-account-secret>",
      "transaction-hash":"<transaction-hash>"
    }
    ```

    response:
    ```
    {
      "valid":"true/false",
      "message":"<reason for valid being true or false>"
    }
    ```

5) list-payment-responses (account, account-secret)
This lists responses from #4.

    ```
    {
      "action":"list-payment-response",
      "account":"<account>",
      "account-secret":"<account-secret>"
    }
    ```

    response:
    ```
    {
      "valid":"true/false",
      "message":"<reason for valid being true or false>"
      "payment-responses": [
        {
          "payment-request-nonce":"<payment-request-nonce>",
          "transaction-hash":"<transaction-hash>"
        }
      ]
    }
    ```

So to have Bob pay Alice for a Candy:
1) Alice registers.
2) Bob registers.
3) Bob shows Alice a QR code of his account.
4) Alice sends a 'request-payment' to bob.
5) Bob does a 'list-payment-requests', sees the payment request, pays it.
6) Bob does a 'payment-response listing the transaction hash.
7) Alice does a 'list-payment-responses' and sees the response from Bob.
8) Alice releases the Candy to Bob.
So the only real blockchain integration is:
1) verifying signature for registration.
2) verifying on-chain hash exists and matches payment parameters.
If that sounds like what you are looking for I can start coding it.
Both an API, and a GUI that uses the API so you can see how the API works.
charkalaLast Saturday at 11:04 PM
Seems pretty cool @coranos !
Is there a feature to store“receipts” or is it all on-chain records?
coranosLast Saturday at 11:19 PM
Currently the payment request and response would all be off-chain in a database. I could see how to store it on-chain
But I’m not sure if you want all that stored on chain. Normally I’d assume only the transactions would be in the on-chain ledger.
charkalaLast Saturday at 11:32 PM
Sounds good
