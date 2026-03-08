import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from 'app/app';
// eslint-disable-next-line import/extensions
import 'app/web/styles.css';

const rootElement = document.getElementById('root');

if(!rootElement) {
	throw new Error('Cannot find root element');
}

createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
