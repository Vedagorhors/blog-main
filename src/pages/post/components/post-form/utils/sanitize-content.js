export const sanitizeContent = (content) =>
	// мы приняли текст (content) и делаем в нем замену. Меняем именно на \\n\\n, так как, если указать \n\n, то вместо <div><br></div><div> будут реально переносы строк, а символов не будет, поэтому нужно пиать именно так с двумя слэшами - то есть чтобы в строке передать символ переноса, нужно его еще раз заэкранировать
	content
		.replaceAll('&nbsp;', ' ')
		.replace(/ +/, ' ')
		.replaceAll('<div><br></div>', '\n')
		.replaceAll('<br>', '\n')
		.replaceAll('<div>', '\n')
		.replaceAll('</div>', '');
