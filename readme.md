# npm_keychain_auth

npm wrapper for using `_auth` config without exposing your credentials in
your global env or `.npmrc` files

## install

`npm install -g npm_keychain_auth`

## use

`npmka [options] [classic npm commands]`

for example

```
npmka install
npmka --user=xiphe publish
```

## options

- `--re-auth` enforces the auth dialog
- `--user={name}` switch to user with {name}
- `--help -h` get help

## why?

Some environments still require the outdated `_auth` configuration of npm.
For example [sonatypes repo manager](https://help.sonatype.com/repomanager3/node-packaged-modules-and-npm-registries#NodePackagedModulesandnpmRegistries-AuthenticationUsingBasicAuth) (when realms are not configured).

The `_auth` config requires your name and password in base64 encoding.
In other words: If [someone gains access to it](https://github.com/npm/npm/issues/4905),
that person can decode it and has your credentials.

So this tool stores your credentials in your systems keychain and only access them
when you use it. You can also choose to not store your credentials at all and
re-type them every time you use the tool.

## License

> The MIT License
>
> Copyright (C) 2018 Hannes Diercks
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
