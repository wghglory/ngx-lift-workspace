# clr-lift Overview

The **clr-lift** library is designed to augment the capabilities of the Clarity library by providing a set of reusable
components built on top of clarity components.

## Features

1. **dgState Operator**

   The **clr-lift** library introduces the `dgState` operator, which enhances the functionality of the Clarity library.
   This operator streamlines the management of datagrid state, making it more intuitive and efficient for developers to
   work with Clarity datagrids.

2. **Datagrid Utilities**

   The library includes a set of utilities specifically tailored for Clarity datagrids. These utilities aim to simplify
   common tasks and operations related to datagrids, providing developers with a more streamlined and cohesive
   experience when working with Clarity components.

## Requirements

To ensure optimal performance and compatibility, clr-lift requires **Angular version 17 or higher**.

## Getting Started

### Installation

To use **clr-lift** in your project, you can install it using your preferred package manager. For example, with npm:

```bash
npm install clr-lift
```

### Usage

```ts
import {dgState, convertToHttpParams} from 'clr-lift';

export class UserDatagridComponent {
  private dgSource = new BehaviorSubject<ClrDatagridStateInterface | null>(null);
  private dgState$ = this.dgSource.pipe(dgState());

  usersState$ = this.dgState$.pipe(
    switchMap((state) => {
      const params = convertToHttpParams(state);
      return this.userService.getUserAPI(params);
    }),
    share(),
  );
}
```

## Running unit tests

Run `nx test clr-lift` to execute the unit tests.

## Contributing

We welcome contributions to the **clr-lift** library. If you encounter any issues, have feature requests, or would like
to contribute code, please check out our
[contribution guidelines](https://github.com/wghglory/ngx-lift-workspace/CONTRIBUTING.md).

## License

**clr-lift** is licensed under the MIT License.

## Acknowledgments

We would like to express our gratitude to the Clarity library maintainers and contributors for their foundational work
that enables the development of **clr-lift**.

---

Feel free to explore the **clr-lift** library and enhance your Clarity datagrid implementation with ease! If you have
any questions or concerns, please don't hesitate to reach out to us. Happy coding!
