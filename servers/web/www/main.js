'use strict';

// Route API REST
const routeApiRest = [
  {
    method: 'get',
    url: '/user',
    vRam: 18524,
    vProc: 2050,
    vTime: 2064,
  },
  {
    method: 'get',
    url: '/user/d2fa789fab66eb6d2b2a9a68',
    vRam: 16084,
    vProc: 1800,
    vTime: 1478,
  },
  {
    method: 'get',
    url: '/messages',
    vRam: 18524,
    vProc: 2050,
    vTime: 2064,
  },
  {
    method: 'get',
    url: '/user/d2fa789fab66eb6d2b2a9a68/messages',
    vRam: 16084,
    vProc: 1800,
    vTime: 1478,
  },
  {
    method: 'get',
    url: '/messages/d2fa789fab66eb6d2b2a9a68',
    vRam: 18524,
    vProc: 2050,
    vTime: 2064,
  },
  {
    method: 'post',
    url: '/message',
    vRam: 16084,
    vProc: 1800,
    vTime: 1478,
  },
];

// Route GraphQL
const routeGraphQL = [
  {
    method: 'post',
    url: '/graphql',
    query: '{users{_id,username,phoneNumber,email,avatar,createdAt}}',
    vRam: 16084,
    vProc: 1800,
    vTime: 1478,
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{user(id: "d2fa789fab66eb6d2b2a9a68") {username,phoneNumber,email,avatar,createdAt,}}',
    vRam: 18524,
    vProc: 2050,
    vTime: 2064,
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{messages{_id,content,createdAt}}',
    vRam: 16084,
    vProc: 1800,
    vTime: 1478,
  },
  {
    method: 'post',
    url: '/graphql',
    // eslint-disable-next-line no-inline-comments,no-warning-comments
    query: "Voir les messages d'un user", // TODO
    vRam: 18524,
    vProc: 2050,
    vTime: 2064,
  },
  {
    method: 'post',
    url: '/graphql',
    query: '{message(id:"3f06f813b84acd6c8b36bbd9"){_id,content,createdAt}}',
    vRam: 16084,
    vProc: 1800,
    vTime: 1478,
  },
  {
    method: 'post',
    url: '/graphql',
    // eslint-disable-next-line no-inline-comments,no-warning-comments
    query: 'Ajouter un message', // TODO
    vRam: 18524,
    vProc: 2050,
    vTime: 2064,
  },
];

// fetch('http://localhost/').then(r => r.json()).then(r => console.log(r));

const reloadBtn = document.querySelector('#reload');
const selectQuery = document.querySelector('#select-query');

reloadBtn.addEventListener('click', () => {
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

  objRamChart.data.datasets[0].data[0] = 0;
  objRamChart.data.datasets[0].data[1] = 0;

  objProcChart.data.datasets[0].data[0] = 0;
  objProcChart.data.datasets[0].data[1] = 0;

  objTimeChart.data.datasets[0].data[0] = 0;
  objTimeChart.data.datasets[0].data[1] = 0;

  objRamChart.update();
  objProcChart.update();
  objTimeChart.update();

  // TODO: fetch data from server Rest API
  // eslint-disable-next-line func-names
  (async function () {
    let restResponse = await fetch(`http://localhost:3000${routeApiRest[selectQuery.value].url}`, {
      method: `${routeApiRest[selectQuery.value].method}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Apikey DONOTSENDAPIKEYS',
      },
    });

    let restData = await restResponse.json();
    console.log(restData);

    objRamChart.data.datasets[0].data[1] = 0; // restData.ram;
    objProcChart.data.datasets[0].data[1] = 0; // restData.proc;
    objTimeChart.data.datasets[0].data[1] = 0; // restData.time;

    objRamChart.update();
    objProcChart.update();
    objTimeChart.update();
  })();

  // TODO: fetch data from server GraphQL API
  // eslint-disable-next-line func-names
  (async function () {
    let data = JSON.stringify({ query: routeGraphQL[selectQuery.value].query });
    let gqlResponse = await fetch(`http://localhost:3000${routeGraphQL[selectQuery.value].url}`, {
      method: `${routeGraphQL[selectQuery.value].method}`,
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        Authorization: 'Apikey DONOTSENDAPIKEYS',
      },
    });

    let gqlData = await gqlResponse.json();
    console.log(gqlData);

    objRamChart.data.datasets[0].data[0] = 0; // gqlData.ram;
    objProcChart.data.datasets[0].data[0] = 0; // gqlData.proc;
    objTimeChart.data.datasets[0].data[0] = 0; // gqlData.time;

    objRamChart.update();
    objProcChart.update();
    objTimeChart.update();
  })();
});

const ramChart = document.getElementById('ram');
const procChart = document.getElementById('proc');
const timeChart = document.getElementById('time');

// eslint-disable-next-line no-new,no-undef
let objRamChart = new Chart(ramChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'RAM (k/o)',
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
let objProcChart = new Chart(procChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'PROC (k/o)',
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
let objTimeChart = new Chart(timeChart, {
  type: 'bar',
  data: {
    labels: ['GraphQL', 'REST-Api'],
    datasets: [
      {
        label: 'Time (ms)',
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
