# Steps:
1. Set ```module: 'amd'``` and ```declaration: true``` in tsconfig (commented as ! production)
2. Set correct path to main AND types in package.json
3. AFTER transpiling, change module export "index" on dist/index.d.ts to package name (this is important)
4. set package route as dependency in importing package.json file i.e. "pkgname": "file:../pkgname"

Carefully check example:

```
//declare module "index" { //! IS WRONG
declare module "template-proj" { //! IS RIGHT!
    export class Person {
        name: string;
        age: number;
        constructor(name: string, age: number);
    }
    export class Vehicle {
        name: string;
        wheels: number;
        constructor(name: string, wheels: number);
    }
}

```