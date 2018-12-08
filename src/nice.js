let defaulLoc = "boston";
let apicall = "http://api.openweathermap.org/data/2.5/weather?q="+defaulLoc+"&units=imperial&appid=58b6f7c78582bffab3936dac99c31b25";
let apicall_forecast =  "http://api.openweathermap.org/data/2.5/forecast/daily?q="+defaulLoc+"&units=imperial&cnt=6&appid=58b6f7c78582bffab3936dac99c31b25"

$.getJSON(apicall, weatherCallBack);
$.getJSON(apicall_forecast, weatherForecast);

$(function() {	
	$("#myBtn").on("click", function (event) {
		let query = $("#search").val();
		let apicallSearch = "http://api.openweathermap.org/data/2.5/weather?q="+query+"&units=imperial&appid=58b6f7c78582bffab3936dac99c31b25";
		let apicallForecastSearch =  "http://api.openweathermap.org/data/2.5/forecast/daily?q="+query+"&units=imperial&cnt=6&appid=58b6f7c78582bffab3936dac99c31b25";
		$.getJSON(apicallSearch, weatherCallBack);
		$.getJSON(apicallForecastSearch, weatherForecast);
		//alert("button funcioning");
		event.preventDefault();
	});
	
});

function weatherCallBack(data) {
	console.log(data);
	$("#fahrenheit").addClass('active').removeAttr('href');
	$("#celsius").removeClass('active').attr("href", '#');
	$("#condition").removeClass();
	$("#myBtn").removeClass().addClass('button transparent');
	
	let weather = document.getElementById("weather");
	if (data.cod === '404') {
		$("#city").html('city not found');
		setBackground('color404');
		weather.style.display = 'none';
	} else weather.style.display = '';
	
	let dt = new Date(data.dt * 1000).toString().split(' ');
	
	let title = data.sys.country
		? data.name + ', ' + data.sys.country
		: data.name;
	$("#city").html(title);
	$("#num").html(Math.round(data.main.temp))
	$("#description").html(titleCase(data.weather[0].description));
	$("#wind").html('Wind: ' + data.wind.speed + ' mph');
	$("#humidity").html('Humidity ' + data.main.humidity + '%')
	$("#date").html(weekDay(dt[0]) + ' ' + dt[4].substring(0, 5));
	$("#celsius").on('click', toCelsius);
	$("#fahrenheit").on('click', toFahrenheit);
	
	function toCelsius() {
	    $(this).addClass('active').removeAttr('href');
		$("#fahrenheit").removeClass('active').attr('href', '#');
		$("#num").html(Math.round((data.main.temp - 32) * (5 / 9)));
	}
	function toFahrenheit() {
		$(this).addClass('active').removeAttr('href');
		$("#celsius").removeClass('active').attr("href", '#');
		$("#num").html(Math.round(data.main.temp));
	}
	
	if (data.main.temp >= 80) {
		setBackground("hot");
	}else if (data.main.temp >= 70) {
		setBackground("warm");
	}else if (data.main.temp >= 60) {
		setBackground("cool");
	}else {
		setBackground("cold");
	}
//					iconURL = "http://openweathermap.org/img/w/"+data.weather[0].icon+".png"
//					$("#condition").html("<img src=http://openweathermap.org/img/w/"+data.weather[0].icon+".png />"
	
	$("#condition").addClass(getIcon(data.weather[0].icon));

}

function titleCase(str) {
	return str.split(' ').map(function (word) {
		return word[0].toUpperCase() + word.substring(1);
	}).join(' ');
}

function weekDay(str) {
	switch (str) {
		case 'Tue':
			return 'Tuesday';
		case 'Wed':
			return 'Wednesday';
		case 'Thu':
			return 'Thursday';
		case 'Sat':
			return 'Saturday';
		default:
			return str + 'day';
	}
}

function setBackground(background) {
	$('body').removeClass().addClass(background);
}

function weatherForecast(forecastData) {
	$("#celsius").on('click', toCelsius);
	$("#fahrenheit").on('click', toFahrenheit);

	let forecast = [];
	let length = forecastData.list.length;
	for (let i = 1; i < length; i++) {
		forecast.push({
			date: new Date(forecastData.list[i].dt * 1000).toString().split(' ')[0],
			iconClass2 : getIcon(forecastData.list[i].weather[0].icon),
			fahrenheit: {
				high: Math.round(forecastData.list[i].temp.max),
				low: Math.round(forecastData.list[i].temp.min),
			},
			celsius: {
				high: Math.round((forecastData.list[i].temp.max - 32) * (5 / 9)),
				low: Math.round((forecastData.list[i].temp.min - 32) * (5 / 9))
			}
		});
	}

	function toCelsius() {
		doForecast('celsius');
	}

	function toFahrenheit() {
		doForecast('fahrenheit');
	}

	function doForecast(unit) {
		let arr = [];
		let length = forecast.length;
		for (let i = 0; i < length; i++) {
			arr[i] = ("<div class='block'><h2>" + forecast[i].date + "</h2><h2><i class='"+forecast[i].iconClass2+"'></i></h2><h3><p>" +forecast[i][unit].high + " </p><p class='secondary'>" + forecast[i][unit].low + "</p></h3></div>");
		}
		$("#forecast").html(arr.join(''));
	}

	doForecast('fahrenheit');
}

function getIcon(icon) {
	let iconClass = '';
	switch (icon) {
		case '01d':
			iconClass = 'wi wi-day-sunny';
			break;
		case '01n':
			iconClass = 'wi wi-night-clear';
			break;
		case '02d':
			iconClass = 'wi wi-day-cloudy';
			break;
		case '02n':
			iconClass = 'wi wi-night-alt-cloudy';
			break;
		case '03d':
			iconClass = 'wi wi-cloud';
			break;
		case '03n':
			iconClass = 'wi wi-cloud';
			break;
		case '04d':
			iconClass = 'wi wi-cloudy';
			break;
		case '04n':
			iconClass = 'wi wi-cloudy';
		case '09d':
			iconClass = 'wi wi-day-showers';
			break;
		case '09n':
			iconClass = 'wi wi-night-alt-showers';
			break;
		case '10d':
			iconClass = 'wi wi-day-rain';
			break;
		case '10n':
			iconClass = 'wi wi-night-alt-rain';
			break;
		case '11d':
			iconClass = 'wi wi-day-thunderstorm';
			break;
		case '11n':
			iconClass = 'wi wi-night-alt-thunderstorm';
			break;
		case '13d':
			iconClass = 'wi wi-day-snow';
			break;
		case '13n':
			iconClass = 'wi wi-night-alt-snow';
			break;
		case '50d':
			iconClass = 'wi wi-day-fog';
			break;
		case '50n':
			iconClass = 'wi wi-night-fog';
			break;
	}
	return iconClass;
}
