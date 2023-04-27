# ESLint: AI

![build](https://github.com/iamando/eslint-ai/workflows/build/badge.svg)
![license](https://img.shields.io/github/license/iamando/eslint-ai?color=success)
![npm](https://img.shields.io/npm/v/eslint-ai)
![release](https://img.shields.io/github/release-date/iamando/eslint-ai)

eslint-ai is an cli tools that help us to lint and view suggestion from ai if we had a code error with eslint support.

## Setup

Get your OPENAI_KEY from [OpenAi](https://platform.openai.com/account/api-keys)

> You'll have to create a account and get your api key

Set your configuration:

```bash
eslint-ai config set OPENAI_KEY=<your key> # for api key
eslint-ai config set OPENAI_MODEL=<your model> # for specifing your prefered model
eslint-ai config set OPENAI_API_ENDPOINT=<your api endpoint> # for specifing your api endpoint

eslint-ai config ui # to use ui prompt directly
```

## Usage

Recommended

```bash
npx eslint-ai # basic usage

npx eslint-ai <file> # you can specify a list of file to lint
```

Using global installation

```bash
npm install -g eslint-ai # npm
yarn add global eslint-ai # yarn


eslint-ai # basic usage

eslint-ai <file> # you can specify a list of file to lint
```

## Support

eslint-ai is an MIT-licensed open source project. It can grow thanks to the sponsors and support.

## License

eslint-ai is [MIT licensed](LICENSE).
