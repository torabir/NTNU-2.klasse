import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { Whiteboard } from './whiteboard-component';
import { Alert } from './widgets';
import { Chat } from './chat-component';  

const root = document.getElementById('root');
if (root)
  createRoot(root).render(
    <>
      <Alert />
      {/* <Whiteboard /> */}
      <Chat />
    </>,
  );
