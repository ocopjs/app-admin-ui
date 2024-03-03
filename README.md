<!--[meta]
section: api
subSection: apps
title: Admin UI app
[meta]-->

# Admin UI app

OcopJS - Giao diện quản trị dữ liệu. 🇻🇳

Ứng dụng Ocop.js cung cấp giao diện quản lý nội dung.

## Hướng dẫn

```js
const { Ocop } = require('@ocopjs/ocop');
const { GraphQLApp } = require('@ocopjs/app-graphql');
const { AdminUIApp } = require('@ocopjs/app-admin-ui');

const ocop = new Ocop({...});

const authStrategy = ocop.createAuthStrategy({...});

module.exports = {
  ocop,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      adminPath: '/admin',
      authStrategy,
    }),
  ],
};
```

## Cấu hình

| Tùy chọn             | Loại       | Mặc định      | Mô tả                                                                      |
| -------------------- | ---------- | ------------- | -------------------------------------------------------------------------- |
| `name`               | `String`   | `undefined`   | Tên của dự án                                                              |
| `adminPath`          | `String`   | `/admin`      | Đường dẫn đến trang quản trị                                               |
| `apiPath`            | `String`   | `/admin/api`  | Đường dẫn đến API cung cấp cho giao diện quản trị.                         |
| `graphiqlPath`       | `String`   | `/admin/api`  | Đường dẫn đến trang tài liệu và kiểm thử API.                              |
| `authStrategy`       | `Object`   | `null`        | Tài liệu đang được hoàn thiện, xem cách dùng trong dự án mẫu.              |
| `hooks`              | `String`   | `./admin-ui/` | Đường dẫn đến hooks tùy biến. Xem thêm bên dưới.                           |
| `enableDefaultRoute` | `Bool`     | `false`       | Nếu được mở, đường dẫn đến giao diện quản trị sẽ là `/`.                   |
| `schemaName`         | `String`   | `public`      |                                                                            |
| `isAccessAllowed`    | `Function` | `true`        | Kiểm soát người dùng vào trang quản trị.                                   |
| `adminMeta`          | `Object`   | `{}`          | Provides additional `adminMeta`. Useful for Hooks and other customizations |
| `defaultPageSize`    | `Integer`  | 50            | The default number of list items to show at once.                          |
| `maximumPageSize`    | `Integer`  | 1000          | The maximum number of list items to show at once.                          |

### `hooks`

Customization hooks allow you to modify various areas of the Admin UI to better
suit your development needs. The `index.js` file at the given path should export
a single config object containing your chosen hooks. All are optional. See
[Customization](#customization) for available hooks.

If omitted, Ocop will look under `./admin-ui/` for a hooks config export.

#### Usage

```javascript title=index.js
new AdminUIApp({ hooks: require.resolve("./custom-hooks-path") });
```

### `isAccessAllowed`

This function takes the same arguments as a
[shorthand imperative boolean](https://www.ocop.vn/api/access-control#shorthand-imperative-boolean)
access control. It must return either true or false.

> **Important:** If omitted, all users _with accounts_ will be able to access
> the Admin UI. The example below would restrict access to users with the
> `isAdmin` permission.

#### Usage

```js
new AdminUIApp({
  /*...config */
  isAccessAllowed: ({ authentication: { item: user, listKey: list } }) => !!user && !!user.isAdmin,
}),
```

## Customization

The following customization hooks are available. Each is a function that takes
no arguments.

```javascript title=/custom-hooks-path/index.js
export default {
  customToast,
  itemHeaderActions,
  listHeaderActions,
  listManageActions,
  logo,
  pages,
};
```

### `logo`

The logo to display on the signin screen.

> This must return a React component.

```javascript
export default {
  logo: () => <MyAwesomeLogo />,
};
```

### `itemHeaderActions`

Header components on the Item Details page can be replaced using this hook. Ths
replaces the components for item Details page for all Lists.

> This must return a React component.

```javascript title=/admin-ui/index.js
import { AddNewItem, ItemId } from "@ocopjs/app-admin-ui/components";
export default {
  // re-implement the default AddNewItem and ItemId button + custom text
  itemHeaderActions: () => (
    <div>
      <ItemId />
      <AddNewItem />
      <p>Hello world</p>
    </div>
  ),
};
```

### `listHeaderActions`

Header components on the List page can be replaced using this hook. This
replaces components on list page for all Lists.

> This must return a React component.

```javascript title=/admin-ui/index.js
import { CreateItem } from "@ocopjs/app-admin-ui/components";
export default {
  // re-implement the default create item button + custom text
  listHeaderActions: () => (
    <div>
      <CreateItem />
      <p>Hello world</p>
    </div>
  ),
};
```

### `listManageActions`

Custom Actions component for multiple items in the list can be replaced with
this hook. This replaces the list management toolbar Items for all lists.

> This must return a React component.

```javascript title=/admin-ui/index.js
import { DeleteItems, UpdateItems } from "@ocopjs/app-admin-ui/components";
export default {
  // re-implement the default delete many and update many items buttons + custom text
  listManageActions: () => (
    <div>
      <UpdateItems />
      <DeleteItems />
      <p>Hello world</p>
    </div>
  ),
};
```

### `pages`

Allows grouping list pages in the sidebar or defining completely new pages.

Should return an array of objects, which may contain the following properties:

| Name        | Type                | Description                                                                         |
| ----------- | ------------------- | ----------------------------------------------------------------------------------- |
| `label`     | `String`            | The page name to display in the sidebar.                                            |
| `path`      | `String`            | The page path.                                                                      |
| `component` | `Function \| Class` | A React component which will be used to render this page.                           |
| `children`  | `Array`             | An array of either Ocop list keys or objects with `listKey` and `label` properties. |

```javascript
export default {
  pages: () => [
    // Custom pages
    {
      label: "A new dashboard",
      path: "",
      component: Dashboard,
    },
    {
      label: "About this project",
      path: "about",
      component: About,
    },
    // Ordering existing list pages
    {
      label: "Blog",
      children: [
        { listKey: "Post" },
        { listKey: "PostCategory", label: "Categories" },
        { listKey: "Comment" },
      ],
    },
    {
      label: "People",
      children: ["User"],
    },
  ],
};
```

### `customToast`

Allows customising the content of toast notification when an item is updated or
deleted.

The hook function receives a context variable containing an `item` key with the
original item data, a `list` key that can be used to limit the scope of the
hook, the original `message` as well as a `toastAction` that will be either
'update' or 'delete'. The function should return a React component.

```javascript
export default {
  customToast: ({ item, list, message }) => {
    // custom Toast for MyList
    if (list.key === "MyList") {
      return (
        <div>
          <strong>My custom toast notification!</strong>
          {item && item._label_ ? <strong>{item._label_}</strong> : null}
        </div>
      );
    }
    // Default toast
    return (
      <div>
        {item && item._label_ ? <strong>{item._label_}</strong> : null}
        <div>{message}</div>
      </div>
    );
  },
};
```
