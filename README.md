# pytest-grabber README

This extension generates a relative path to your function ready to be pasted into your terminal as a pytest arg to run a single testcase.

## Features

`pytest-grabber.generatePath`: Generates a path like `${filePath}::${className}::${methodName}` where method is optional.

## Known Issues

None so far.

## Release Notes

### 1.0.0

Initial release of pytest-grabber!

### 1.0.1

- Fixed an issue where relative path would include the root directory of the workspace if one was set.

### 1.2.1

- Added support for test methods that don't have a parent class.
- Fixed adding a whitespace after the prefixCmd.

**Enjoy!**
