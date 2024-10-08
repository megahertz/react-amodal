# react-dialogues

[![Tests](https://github.com/megahertz/react-dialogues/workflows/Tests/badge.svg)](https://github.com/megahertz/react-dialogues/actions?query=workflow%3ATests)
[![npm version](https://img.shields.io/npm/v/react-dialogues?color=brightgreen)](https://www.npmjs.com/package/react-dialogues)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-dialogues.svg?color=rgb%2868%2C%20204%2C%2017%29)](https://bundlephobia.com/result?p=react-dialogues)

Simple but flexible modal dialog library inspired by
[Ant Design](https://ant.design/components/modal)

## WIP! The project is still in beta stage

```tsx
import { CancelButton, Modal, OkButton } from 'react-dialogues';

export default function App() {
  return (
    <Button
      onClick={async () => {
        const result = await Modal.info({
          title: 'Information',
          content: 'Example',
          buttons: [<Modal.OkButton />, <Modal.CancelButton />],
        });

        if (result === 'ok') {
          console.log('Ok button clicked');
        } else {
          console.log('Cancel button clicked');
        }
      }}
    >
      Show Modal
    </Button>
  );
}
```
