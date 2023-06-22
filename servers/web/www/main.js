'use strict';

// Route API REST
const routeApiRest = [
  {
    method: 'get',
    url: '/users',
  },
  {
    method: 'get',
    url: '/users/d2fa789fab66eb6d2b2a9a68',
  },
  {
    method: 'get',
    url: '/messages',
  },
  {
    method: 'get',
    url: '/users/d2fa789fab66eb6d2b2a9a68/messages',
  },
  {
    method: 'get',
    url: '/messages/3f06f813b84acd6c8b36bbd9',
  },
  {
    method: 'post',
    url: '/messages',
  },
  {
    method: 'get',
    url: '/users',
  },
];

// Route GraphQL
const routeGraphQL = [
  {
    method: 'post',
    url: '/graphql',
    query: '{users{_id,username,phoneNumber,email,avatar,createdAt}}',
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{user(id: "d2fa789fab66eb6d2b2a9a68") {username,phoneNumber,email,avatar,createdAt,}}',
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{messages{_id,author,content,createdAt}}',
  },
  {
    method: 'post',
    url: '/graphql',
    // eslint-disable-next-line no-inline-comments,no-warning-comments
    query: "Voir les messages d'un user", // TODO
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{message(id:"3f06f813b84acd6c8b36bbd9"){_id,content,createdAt}}',
  },
  {
    method: 'post',
    url: '/graphql',
    // eslint-disable-next-line no-inline-comments,no-warning-comments
    query: 'Ajouter un message', // TODO
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{users{username,phoneNumber}}',
  },
];

const ramBlur = document.querySelector('#ram-blur');
const procBlur = document.querySelector('#proc-blur');
const sizeBlur = document.querySelector('#size-blur');
const durationProcessBlur = document.querySelector('#duration-process-blur');
const durationResponseBlur = document.querySelector('#duration-response-blur');

// fetch('http://localhost/').then(r => r.json()).then(r => console.log(r));

// TODO: fetch data from server Rest API
async function makeRestApiRequest() {
  const startTime = Date.now();
  const restResponse = await fetch(`http://baruff.fr:3030${routeApiRest[selectQuery.value].url}`, {
    method: `${routeApiRest[selectQuery.value].method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Apikey DONOTSENDAPIKEYS',
    },
  });

  const requestDuration = Date.now() - startTime;
  const response = await restResponse.json();
  const benchmark = response.benchmark;

  // Suppresion de benchmark dans la réponse pour ne pas fausser la taille de la réponse
  delete response.benchmark;
  const requestSize = JSON.stringify(response).length;

  return { duration: requestDuration, size: requestSize, response, benchmark };
}

// TODO: fetch data from server GraphQL API
async function makeGraphQLRequest() {
  const data = JSON.stringify({ query: routeGraphQL[selectQuery.value].query });
  const startTime = Date.now();
  const gqlResponse = await fetch(`http://baruff.fr:3000${routeGraphQL[selectQuery.value].url}`, {
    method: `${routeGraphQL[selectQuery.value].method}`,
    body: data,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      Authorization: 'Apikey DONOTSENDAPIKEYS',
    },
  });

  const requestDuration = Date.now() - startTime;
  const response = await gqlResponse.json();
  const benchmark = response.benchmark;
  // Suppresion de benchmark dans la réponse pour ne pas fausser la taille de la réponse
  delete response.benchmark;
  const requestSize = JSON.stringify(response).length;

  return { duration: requestDuration, size: requestSize, response, benchmark };
}

const reloadBtn = document.querySelector('#reload');
const selectQuery = document.querySelector('#select-query');

reloadBtn.addEventListener('click', async () => {
  ramBlur.classList.remove('d-none');
  procBlur.classList.remove('d-none');
  sizeBlur.classList.remove('d-none');
  durationProcessBlur.classList.remove('d-none');
  durationResponseBlur.classList.remove('d-none');

  console.log(routeGraphQL[selectQuery.value]);
  console.log(routeApiRest[selectQuery.value]);

  // Set data for charts
  /*
  objRamChart.data.datasets[0].data[0] = routeGraphQL[selectQuery.value].vRam;
  objRamChart.data.datasets[0].data[1] = routeApiRest[selectQuery.value].vRam;

  objProcChart.data.datasets[0].data[0] = routeGraphQL[selectQuery.value].vProc;
  objProcChart.data.datasets[0].data[1] = routeApiRest[selectQuery.value].vProc;

  objTimeChart.data.datasets[0].data[0] = routeGraphQL[selectQuery.value].vTime;
  objTimeChart.data.datasets[0].data[1] = routeApiRest[selectQuery.value].vTime;

  */

  const graphQlData = await makeGraphQLRequest();
  const restApiData = await makeRestApiRequest();

  console.log(graphQlData, restApiData);

  objRamChart.data.datasets[0].data[0] = graphQlData.benchmark.RAMPOSSIBILITY.rss / 1000;
  objProcChart.data.datasets[0].data[0] = graphQlData.benchmark.CPU.system;
  objSizeChart.data.datasets[0].data[0] = graphQlData.size / 1000;
  objDurationProcessChart.data.datasets[0].data[0] = graphQlData.benchmark.TIME[1] / Math.pow(10, 6);
  objDurationResponseChart.data.datasets[0].data[0] = graphQlData.duration;

  objRamChart.data.datasets[0].data[1] = restApiData.benchmark.RAMPOSSIBILITY.rss / 1000;
  objProcChart.data.datasets[0].data[1] = restApiData.benchmark.CPU.system;
  objSizeChart.data.datasets[0].data[1] = restApiData.size / 1000;
  objDurationProcessChart.data.datasets[0].data[1] = restApiData.benchmark.TIME[1] / Math.pow(10, 6);
  objDurationResponseChart.data.datasets[0].data[1] = restApiData.duration;

  objRamChart.update();
  objProcChart.update();
  objSizeChart.update();
  objDurationProcessChart.update();
  objDurationResponseChart.update();

  ramBlur.classList.add('d-none');
  procBlur.classList.add('d-none');
  sizeBlur.classList.add('d-none');
  durationProcessBlur.classList.add('d-none');
  durationResponseBlur.classList.add('d-none');
});

const ramChart = document.getElementById('ram');
const procChart = document.getElementById('proc');
const sizeChart = document.getElementById('size');
const durationProcessChart = document.getElementById('duration-process');
const durationResponseChart = document.getElementById('duration-response');

// eslint-disable-next-line no-new,no-undef
const objRamChart = new Chart(ramChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'RAM (Ko)',
        data: [0, 0],
        borderWidth: 1,
        backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)'],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
// eslint-disable-next-line no-new,no-undef
const objProcChart = new Chart(procChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'PROC (%)',
        data: [0, 0],
        borderWidth: 1,
        backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)'],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// eslint-disable-next-line no-new,no-undef
const objSizeChart = new Chart(sizeChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'Size (Ko)',
        data: [0, 0],
        borderWidth: 1,
        backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)'],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// eslint-disable-next-line no-new,no-undef
const objDurationProcessChart = new Chart(durationProcessChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'Durée Processus (ms)',
        data: [0, 0],
        borderWidth: 1,
        backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)'],
      },
    ],
  },
  options: {
    indexAxis: 'y',
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// eslint-disable-next-line no-new,no-undef
const objDurationResponseChart = new Chart(durationResponseChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'Durée Réponse (ms)',
        data: [0, 0],
        borderWidth: 1,
        backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)'],
      },
    ],
  },
  options: {
    indexAxis: 'y',
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
