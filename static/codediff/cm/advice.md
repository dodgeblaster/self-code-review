Sure, here's an example of how to use the `unifiedMergeView` extension in JavaScript:

```javascript
import { EditorState, basicSetup } from "@codemirror/basic-setup";
import { unifiedMergeView } from "@codemirror/merge";

// Define the original document
const originalDoc = `This is the original document.
It has multiple lines.
With some content.`;

// Create the initial editor state
const originalState = EditorState.create({
  doc: originalDoc,
  extensions: [
    basicSetup,
    unifiedMergeView({
      original: originalDoc, // Pass the original document
      diffConfig: {
        // Optionally provide configuration for the diff algorithm
      },
      highlightChanges: true, // Enable highlighting of changes (default)
      gutter: true, // Show the gutter with change markers (default)
      // Other options...
    }),
  ],
});

// Create the editor view
const view = new EditorView({
  state: originalState,
  parent: document.body,
});
```

In this example, we first import the `unifiedMergeView` extension from `@codemirror/merge`. We define the `originalDoc` variable with the content of the original document.

Then, we create the initial editor state using `EditorState.create`, passing the original document's content as the `doc` option. We also add the `unifiedMergeView` extension, passing the `original` document as an option, along with any other desired configuration options (like `diffConfig`, `highlightChanges`, `gutter`, etc.).

Finally, we create the editor view using the `EditorView` class, passing the configured state and a parent DOM element to render the editor.

With this setup, the editor will display the current document content with highlights and gutter markers showing the differences compared to the original document. You can interact with the editor as usual, and the highlights and gutter markers will update automatically as you edit the document.

Note that the `unifiedMergeView` extension is designed to show the differences between the current editor content and an original document. If you want to display two editable documents side-by-side with merge functionality, you should use the `MergeView` class instead.
