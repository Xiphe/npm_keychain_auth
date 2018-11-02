#!/usr/bin/env node

'use strict';

const inquirer = require('inquirer');
const chalk = require('chalk');
const minimist = require('minimist');
const keytar = require('keytar');
const updateNotifier = require('update-notifier');
const { spawn, execSync } = require('child_process');
const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

const NEVER_VAL =
  '__never__yETv6GZWdxHWkPyenrvNX8jWTKxvpsn6GANFCdv7R6iQT9Z3aqH6Tug4Wqyone6Q2UR7CJRjoDv8snvAKnNiMNWom8tfrn4QgbcfbDFHCLHsR8Axr7Wk87ujfCRHo9vm';
const YES = 'Yes';
const NO = 'No';
const NEVER = 'No, never!';
const KEYCHAIN_PW = 'npm_keychain_auth_password';
const DEFAULT_USER = '__global';

async function getPassword(user, force) {
  const password = await keytar.getPassword(KEYCHAIN_PW, user || DEFAULT_USER);

  if (force || password === null || password === NEVER_VAL) {
    const { save, username = user, newPassword } = await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'Your Username',
        when: !user,
      },
      {
        type: 'password',
        name: 'newPassword',
        message: 'Your Password',
      },
      {
        name: 'save',
        message: 'Save credentials in keychain?',
        type: 'list',
        when: force || password !== NEVER_VAL,
        choices: [YES, NO, NEVER],
        default: NO,
      },
    ]);

    const encodedPassword = Buffer.from(`${username}:${newPassword}`).toString(
      'base64',
    );

    switch (save) {
      case NO:
        await keytar.deletePassword(KEYCHAIN_PW, user || DEFAULT_USER);
        break;
      case NEVER:
        await keytar.setPassword(KEYCHAIN_PW, user || DEFAULT_USER, NEVER_VAL);
        break;
      case YES:
        await keytar.setPassword(
          KEYCHAIN_PW,
          user || DEFAULT_USER,
          encodedPassword,
        );
        break;
      default:
        throw new Error('This should have never happened!');
    }

    return encodedPassword;
  }

  return password;
}

function printHelp() {
  console.log(`${chalk.blue(`npmka@${pkg.version}`)}
npm wrapper for using _auth npm without exposing your password

${chalk.dim('Usage:')}
  ${chalk.yellow('npmka')} [options] [classic npm commands]

${chalk.dim('Options:')}
  ${chalk.yellow('--re-auth')}      enforces the auth dialog
  ${chalk.yellow('--user={name}')}  switch to user with {name}
  ${chalk.yellow('--help -h')}      print this message

------------------ npm -h ------------------`);

  execSync('npm -h');
}

async function runner() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['re-auth', 'help'],
    alias: {
      h: 'help',
    },
  });

  if (argv.help) {
    printHelp();
    return;
  }

  const password = await getPassword(argv.user, argv['re-auth']);

  const s = spawn('npm', process.argv.slice(2), {
    stdio: 'inherit',
    env: {
      ...process.env,
      npm_config__auth: password,
    },
  });

  s.once('exit', process.exit);
}

runner().catch((err) => {
  console.error(err.stdout ? err.stdout.toString() : err);
  process.exit(err.code || 1);
});
