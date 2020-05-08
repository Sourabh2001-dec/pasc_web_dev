AOS.init({ duration: 900, easing: 'ease-in-out' });

$(window).scroll(function () {
	if ($(document).scrollTop() > 400) {
		$('.navbar').addClass('new-nav navbar-dark');
	} else {
		$('.navbar').removeClass('new-nav navbar-dark');
		$('.navbar').addClass('navbar-light');
	}
});

$('.navbar-nav .nav-link').click(function () {
	$('.navbar-nav .nav-link').removeClass('active');
	$(this).addClass('active');
});

anime({
	targets: '#path5530',
	translateX: '20px',
	scale: [1, 1.04],
	direction: 'alternate',
	duration: 1500,
	loop: true,
	easing: 'linear',
});

anime({
	targets: '#aboutcorona img',
	keyframes: [{ translateY: '10' }, { translateY: '-10' }, { translateY: '0' }],
	easing: 'linear',
	loop: true,
	duration: 5000,
});
state_codes = {
	TT: {
		name: 'All States',
		Confirmed: [],
		Recovered: [],
		Deceased: [],
		Confirmed_date: [],
		Recovered_date: [],
		Deceased_date: [],
	},
};
chart_config = {
	type: 'line',
	data: {
		labels: [],
		datasets: [
			{
				data: [],
				borderColor: 'red',
				label: 'No. of cases',
				pointRadius: 2,
				fill: false,
			},
		],
	},
	options: {
		title: {
			display: true,
			text: 'All States confirmed COVID-19 cases',
		},
	},
};

myChart = null;
const state_select = document.getElementById('state_select');
const case_select = document.getElementById('case_type');
let graph_state = {
	stateCode: 'TT',
	caseType: 'Confirmed',
};
state_select.addEventListener('change', (e) => {
	const code = state_select.options[state_select.selectedIndex].getAttribute(
		'value'
	);
	graph_state.stateCode = code;
	addData(state_codes[code], graph_state.caseType);
});

case_select.addEventListener('change', () => {
	const type = case_select.options[case_select.selectedIndex].getAttribute(
		'value'
	);
	graph_state.caseType = type;
	addData(state_codes[graph_state.stateCode], type);
});

fetch('https://api.covid19india.org/v2/state_district_wise.json')
	.then((response) => response.json())
	.then((data) => {
		data.forEach((state) => {
			state_codes[state.statecode] = {
				name: state.state,
				Confirmed: [],
				Recovered: [],
				Deceased: [],
				Confirmed_date: [],
				Recovered_date: [],
				Deceased_date: [],
			};
		});
	})
	.then(
		fetch('https://api.covid19india.org/states_daily.json')
			.then((response) => response.json())
			.then((data) => {
				data.states_daily.forEach((info) => {
					Object.keys(info).forEach(function (key) {
						if (key !== 'status' || key !== 'date') {
							capKey = key.toUpperCase();
							status = info.status;
							state = state_codes[capKey];
							if (state) {
								length = state[info.status].length;
								length > 0
									? (new_num =
											state[info.status][length - 1] + parseInt(info[key]))
									: (new_num = parseInt(info[key]));
								state[info.status].push(new_num);
								let date = info['date'].split('-');
								date = date[0] + ' ' + date[1];
								state[info.status + '_date'].push(date);
							}
						}
					});
				});

				addData(state_codes[graph_state.stateCode], graph_state.caseType, true);
				var ctx = document.getElementById('myChart').getContext('2d');
				myChart = new Chart(ctx, chart_config);
			})
	);

function addData(data, type, start = false) {
	chart_config.options.title.text =
		data.name + ' Total ' + type + ' COVID-19 cases Till Date';
	chart_config.data.datasets.forEach((dataset) => {
		dataset.data = data[type];
	});
	chart_config.data.labels = data[type + '_date'];
	if (type == 'Recovered') {
		chart_config.data.datasets.forEach((dataset) => {
			dataset.borderColor = 'green';
		});
	} else {
		chart_config.data.datasets.forEach((dataset) => {
			dataset.borderColor = 'red';
		});
	}
	if (!start) {
		myChart.update();
	}

	document.getElementById('state_name').innerText =
		state_codes[graph_state.stateCode].name;
	document.getElementById('state_conf').innerText =
		state_codes[graph_state.stateCode].Confirmed[
			state_codes[graph_state.stateCode].Confirmed.length - 1
		];
	document.getElementById('state_reco').innerText =
		state_codes[graph_state.stateCode].Recovered[
			state_codes[graph_state.stateCode].Recovered.length - 1
		];
}

function removeData() {
	// chart.data.labels.pop();
	chart_config.data.datasets.forEach((dataset) => {
		dataset.data.pop();
	});
	myChart.update();
}

const news_list = document.querySelector('#news ul');

function check_keyword(str, words) {
	let result = false;

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		result = str.includes(word);
		if (result) {
			break;
		}
	}
	return result;
}

var key_words = [
	'corona',
	'covid',
	'pandemic',
	'lockdown',
	'virus',
  'containment',
  'social distancing',
  'quarantine',
  'incubation',
  'isolation',
  'community spread',
  'cases'
];

fetch(
	'https://newsapi.org/v2/top-headlines?apiKey=1c1bbfbd422c4b2ba5a1b3b705f5d8e7&country=in'
)
	.then((res) => res.json())
	.then((data) => {
		data.articles.forEach((data) => {
			const str = data.title.toLowerCase();
			if (check_keyword(str, key_words)) {
        var date = new Date(data.publishedAt);
						date = date.toDateString().split(' ');
				news_list.insertAdjacentHTML(
					'beforeend',
          `<div class="row my-4" data-aos="fade-up"
          data-aos-anchor-placement="top-bottom">
            <div class="col-md-3">
              <img src="${data.urlToImage}" class="news_img" alt="">
            </div>
            <div class="col-md-9">
              <h4>${data.title}</h4>
              <div>
                ${data.description}... <a href="${data.url}">Read More</a>
                <p class="mt-2">
                By <i>${data.author}</i> and Published on <b>${date[1]} ${date[2]}, ${date[3]}</b>
                </p>
              </div>
            </div>
          </div>`
				);
			}
		});
	});

// anime({
//     targets : '#path5594',
//     translateX : '20px',
//     direction : 'alternate',
//     duration : 2000,
//     loop : true
// })
