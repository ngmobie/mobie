# faker.js - generate massive amounts of fake data in the browser and node.js

![Faker.js](http://imgur.com/KiinQ.png)

[![Build Status](https://travis-ci.org/Marak/faker.js.svg?branch=master)](https://travis-ci.org/Marak/Faker.js)

[![npm version](https://badge.fury.io/js/faker.svg)](http://badge.fury.io/js/faker)

## Demo

[http://marak.com/faker.js/](http://marak.com/faker.js/)

## Usage

### Browser

    <script src = "faker.js" type = "text/javascript"></script>
    <script>
      var randomName = faker.name.findName(); // Caitlyn Kerluke
      var randomEmail = faker.internet.email(); // Rusty@arne.info
      var randomCard = faker.helpers.createCard(); // random contact card containing many properties
    </script>

### Node.js

    var faker = require('./faker');

    var randomName = faker.name.findName(); // Rowan Nikolaus
    var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
    var randomCard = faker.helpers.createCard(); // random contact card containing many properties

## Dependent tools

### Fake JSON Schema

Use faker generators to populate JSON Schema samples.
See: https://github.com/pateketrueke/json-schema-faker/

### CLI

Run faker generators from Command Line.
See: https://github.com/lestoni/faker-cli

## Localization

As of version `v2.0.0` faker.js supports 27 different language definition packs.

The default language is set to English.

Setting a new locale is simple:

```js
// sets locale to de
faker.locale = "de";
```
Read further for complete list of locales.

## API

* name
  * firstName
  * lastName
  * findName
  * prefix
  * suffix
* address
  * zipCode
  * city
  * cityPrefix
  * citySuffix
  * streetName
  * streetAddress
  * streetSuffix
  * secondaryAddress
  * county
  * country
  * state
  * stateAbbr
  * latitude
  * longitude
* phone
  * phoneNumber
  * phoneNumberFormat
  * phoneFormats
* internet
  * avatar
  * email
  * userName
  * domainName
  * domainSuffix
  * domainWord
  * ip
  * userAgent
  * color
  * password
* company
  * suffixes
  * companyName
  * companySuffix
  * catchPhrase
  * bs
  * catchPhraseAdjective
  * catchPhraseDescriptor
  * catchPhraseNoun
  * bsAdjective
  * bsBuzz
  * bsNoun
* image
  * image
  * avatar
  * imageUrl
  * abstract
  * animals
  * business
  * cats
  * city
  * food
  * nightlife
  * fashion
  * people
  * nature
  * sports
  * technics
  * transport
* lorem
  * words
  * sentence
  * sentences
  * paragraph
  * paragraphs
* helpers
  * randomNumber
  * randomize
  * slugify
  * replaceSymbolWithNumber
  * shuffle
  * mustache
  * createCard
  * contextualCard
  * userCard
  * createTransaction
* date
  * past
  * future
  * between
  * recent
* random
  * number
  * array_element
  * object_element
  * uuid
* finance
  * account
  * accountName
  * mask
  * amount
  * transactionType
  * currencyCode
  * currencyName
  * currencySymbol
* hacker
  * abbreviation
  * adjective
  * noun
  * verb
  * ingverb
  * phrase
* locales
  * de
  * de_AT
  * de_CH
  * en
  * en_AU
  * en_BORK
  * en_CA
  * en_GB
  * en_IND
  * en_US
  * en_au_ocker
  * es
  * fa
  * fr
  * it
  * ja
  * ko
  * nb_NO
  * nep
  * nl
  * pl
  * pt_BR
  * ru
  * sk
  * sv
  * vi
  * zh_CN
* locale
  * 0
  * 1
* localeFallback
  * 0
  * 1
* definitions
  * name
  * address
  * company
  * lorem
  * hacker
  * phone_number
  * finance
  * internet


## Tests

    npm install .
    make test

You can view a code coverage report generated in coverage/lcov-report/index.html.

## Authors

#### Matthew Bergman & Marak Squires

faker.js - Copyright (c) 2014-2015
Matthew Bergman & Marak Squires
http://github.com/marak/faker.js/

faker.js was inspired by and has used data definitions from:

 * https://github.com/stympy/faker/ - Copyright (c) 2007-2010 Benjamin Curtis
 * http://search.cpan.org/~jasonk/Data-Faker-0.07/ - Copyright 2004-2005 by Jason Kohles

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


