---
section: api
title: Content Blocks
---

# Content Blocks API

The `Content` field type can accept an optional array of _Blocks_ which enhance
the editing experience of that field in various ways. Built on top of Slate.js,
_Blocks_ are a powerful tool for creating structured and unstructured content
editing flows.

## Usage

```javascript
keystone.createList('Post', {
  fields: {
    body: {
      type: Content,
      blocks: [Content.blocks.blockquote, CloudinaryImage.blocks.singleImage],
    },
  },
});
```

## API

Each _Block_ is defined by the following API:

```javascript
{
  // (required)
  // A globally unique name for this block. Alpha-num characters only.
  type: 'MyBlock',

  // (required)
  // The views this block will provide.
  // See below for the expected exports.
  viewPath: '/absolute/path/to/built/view/file',

  // (optional)
  // The server-side serialization implementation logic.
  // If not provided, any data included in the block will be serialised and
  // stored as a string in the database, and passed directly back to the
  // slate.js editor client side.
  // NOTE: See viewPath#serialiser for complimentary client-side logic
  implementation: SingleImageBlock,

  // TODO: The client-side serialization implementation logic.

  // (optional)
  // Blocks can insert/render other blocks (eg; an image gallery can insert
  // an image block). Define them here.
  // It should be a regular block definition.
  dependencies: ?, // image-container
}
```

The view file referenced from the `viewPath` option can have the following
exports:

```javascript
// (required)
// The element rendered into the slate.js editor.
// Is passed all the props a slate.js `renderNode()` receives.
export const Node = /* ... */;

// (optional)
// A button / element to insert into the side bar when it's opened.
// Will be passed a single prop; `editor` which is an instance of the Slate.js
// editor.
export const Sidebar = /* ... */;

// (optional)
// The individual button which shows in the toolbar
export const ToolbarElement = /* ... */;

// (optional)
// Toolbar overwrite. Useful if clicking the button needs to show more info.
// Will be rendered within the toolbar, and passed {children} which is the
// regular toolbar. It can opt to not render the {children} so the entire
// toolbar is replaced with this element.
export const Toolbar = /* ... */;

// (optional)
// Wraps the entire Content Editor. The value is the options object passed to
// the block from the field config.
// TODO: Can we skip this and instead pass the options into each of the above
// views directly?
export const Provider = /* ... */;

// (optional)
// slate.js schema object, injected into the slate.js schema as:
// {
//   document: { /* .. */ },
//   blocks: {
//     [type]: <here>,
//   },
// }
export const schema = /* ... */;

// (optional)
// slate.js plugins array.
export const plugins = /* ... */;

// (optional)
//
export function processNodeForConnectQuery({ id, node }) { return { node, query } };
```