# Ideas

```./tests/``` should mimic the ```./src/``` folder structure.

# Setup

1. run ```yarn add typescript jest ts-jest @types/jest```
2. edit tsconfig adding ```  "exclude": ["node_modules", "tests"]```so transpiling ignores /tests/ folder.
3. execute ```yarn ts-jest config:init``` for initial config.
4. run tests commands :D

# Commands for testing

Yarn will be used as the package manager.

Running only ```jest``` will run all the .test.ts files.
Running ```jest --coverage``` runs coverage tests and outputs results on a new folder.
Running ```jest ./path/to/folder/```will run all the tests contained in the folder "folder".
