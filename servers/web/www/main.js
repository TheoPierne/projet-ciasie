'use strict';

// Route API REST
const routeApiRest = [
  {
    method: 'get',
    url: '/users',
  },
  {
    method: 'get',
    url: '/user/d2fa789fab66eb6d2b2a9a68',
  },
  {
    method: 'get',
    url: '/messages',
  },
  {
    method: 'get',
    url: '/user/d2fa789fab66eb6d2b2a9a68/messages',
  },
  {
    method: 'get',
    url: '/messages/3f06f813b84acd6c8b36bbd9',
  },
  {
    method: 'post',
    url: '/message',
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
    query: '{messages{_id,content,createdAt}}',
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
];

// fetch('http://localhost/').then(r => r.json()).then(r => console.log(r));

// TODO: fetch data from server Rest API
async function makeRestApiRequest() {
  const startTime = Date.now();
  const restResponse = await fetch(`http://localhost:3030${routeApiRest[selectQuery.value].url}`, {
    method: `${routeApiRest[selectQuery.value].method}`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Apikey DONOTSENDAPIKEYS',
    },
  });

  const requestDuration = Date.now() - startTime;
  const response = await restResponse.json();
  const requestSize = +restResponse.headers.get('Content-Length');

  return { duration: requestDuration, size: requestSize, response };
}

// TODO: fetch data from server GraphQL API
async function makeGraphQLRequest() {
  const data = JSON.stringify({ query: routeGraphQL[selectQuery.value].query });
  const startTime = Date.now();
  const gqlResponse = await fetch(`http://localhost:3000${routeGraphQL[selectQuery.value].url}`, {
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
  const requestSize = JSON.stringify(response).length;

  return { duration: requestDuration, size: requestSize, response };
}

const reloadBtn = document.querySelector('#reload');
const selectQuery = document.querySelector('#select-query');

reloadBtn.addEventListener('click', async () => {
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

  objRamChart.data.datasets[0].data[0] = graphQlData.duration;
  objProcChart.data.datasets[0].data[0] = 0; // gqlData.proc;
  objTimeChart.data.datasets[0].data[0] = graphQlData.size / 1000;

  objRamChart.data.datasets[0].data[1] = restApiData.duration;
  objProcChart.data.datasets[0].data[1] = 0; // restData.proc;
  objTimeChart.data.datasets[0].data[1] = restApiData.size / 1000;

  objRamChart.update();
  objProcChart.update();
  objTimeChart.update();
});

const ramChart = document.getElementById('ram');
const procChart = document.getElementById('proc');
const timeChart = document.getElementById('time');

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
const objTimeChart = new Chart(timeChart, {
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
