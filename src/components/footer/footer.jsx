import { useEffect, useState } from 'react';
import styled from 'styled-components';

const FooterContainer = ({ className }) => {
	// нам нужно будет вывести сведения о погоде в разметку, поэтому создадим состояния
	const [city, setCity] = useState('');
	const [temperature, setTemperature] = useState('');
	const [weather, setWeather] = useState('');

	// в useEffect укаываю пустой массив зависимостей для того, чтобы запрос погоды выполнялся только один раз при старте приложения (по условию задания)
	// округляем температуру с сайта до целого числа
	// получаем погоду, смотрю в консоль браузера, где я запросил погоду и вижу, что нужно для описания погоды description сначала в разделе weather указать массив [0], а потом указать элемент массива description
	useEffect(() => {
		fetch(
			'https://api.openweathermap.org/data/2.5/weather?q=Voronezh&units=metric&lang=ru&appid=b4c996116002c131e4d716c38e1e1d52',
		)
			.then((res) => res.json())
			.then(({ name, main, weather }) => {
				setCity(name);
				setTemperature(Math.round(main.temp));
				setWeather(weather[0].description);
			});
	}, []);

	return (
		<div className={className}>
			{/* чтобы две нижние надписи отцентровать в левый край соберем два дива с надписями в общий div */}
			<div>
				<div>Блог веб-разработчика</div>
				<div>web@developer.ru</div>
			</div>
			{/* сформируем еще две записи города и погоды таким же образом */}
			<div>
				<div>
					{city},{' '}
					{new Date().toLocaleString('ru', { day: 'numeric', month: 'long' })}
				</div>
				<div>
					{temperature} градусов, {weather}
				</div>
			</div>
		</div>
	);
};

// экспортируем уже стилизованный футер
export const Footer = styled(FooterContainer)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 1000px;
	height: 120px;
	padding: 20px 40px;
	font-weight: bold;
	background-color: rgb(255, 255, 255);
	box-shadow: rgb(0, 0, 0) 0px 2px 17px;
`;
