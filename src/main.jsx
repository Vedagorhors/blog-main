// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Blog } from './blog.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<Blog />
	</BrowserRouter>,
);
