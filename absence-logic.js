const base_url = 'https://app.absence.io/api/v2/'
console.log('date', date)

getUserId(user_token).then((user_info) => {
  var url = base_url + 'timespans/create?cachekiller=' + Date.now()
  var user_id = user_info._id

  var start_mins_options = [10, 20, 30, 40, 50]
  var break_mins_options = [-10, 0, 10]
  var variable_mins_options = [-30, -20, -10, 10, 20, 30]

  var start_mins = start_mins_options[Math.round(Math.random() * (start_mins_options.length - 1))]
  var break_mins = break_mins_options[Math.round(Math.random() * (break_mins_options.length - 1))]
  var variable_mins = variable_mins_options[Math.round(Math.random() * (variable_mins_options.length - 1))]

  // crear una funcion para generar intervalos de fechas
  var init_date_start = new Date(date)
  var init_date_end = new Date(date)

  var break_date_start = new Date(date)
  var break_date_end = new Date(date)

  var end_date_start = new Date(date)
  var end_date_end = new Date(date)

  init_date_start.setHours(9, start_mins)
  init_date_end.setHours(init_date_start.getHours() + 4, init_date_start.getMinutes() + variable_mins)

  break_date_start.setHours(init_date_end.getHours(), init_date_end.getMinutes())
  break_date_end.setHours(break_date_start.getHours() + 1, break_date_start.getMinutes() + break_mins)

  end_date_start.setHours(break_date_end.getHours(), break_date_end.getMinutes())
  end_date_end.setHours(end_date_start.getHours() + 4, end_date_start.getMinutes() - variable_mins)

  // /func

  var config = [
    {
      type: 'work',
      start: init_date_start.toISOString(),
      end: init_date_end.toISOString()
    },
    {
      type: 'break',
      start: break_date_start.toISOString(),
      end: break_date_end.toISOString()
    },
    {
      type: 'work',
      start: end_date_start.toISOString(),
      end: end_date_end.toISOString()
    }
  ]

  var requests = []

  config.forEach((entry, index) => {
    var payload = { 'userId': user_id, 'commentary': '', '_id': 'new', 'timezone': '+0200', 'timezoneName': 'Central European Summer Time', 'source': { 'sourceType': 'browser', 'sourceId': 'manual' }, 'type': 'work', 'start': '2019-05-21T07:30:00Z', 'end': '2019-05-21T12:00:00Z', 'trace': [] }
    var d = new Date(date)

    //d.setDate(d.getDate());

    payload.start = entry.start
    payload.end = entry.end
    payload.type = entry.type

    var request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Content-Type': 'application/json',
        'x-languagetoken': 'es',
        'X-Requested-With': 'XMLHttpRequest',
        'x-vacationtoken': user_token
      })
    })

    console.log('request', request)
    requests.push(request)

    console.log('entry', entry)
    console.log('payload', payload)
  })

  Promise.all(requests.map(request => fetch(request))).then(responses =>
    Promise.all(responses.map(res => res.text()))
  ).then(texts => {
    console.log('texts', texts)
    window.close()
  })
})
/* fetch(request)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      }) */
function getUserId(_user_token) {
  var auth_url = 'https://app.absence.io/api/auth/' + _user_token
  var user_info_request = new Request(auth_url, {
    method: 'GET'
  })
  console.log('?', auth_url)
  return fetch(user_info_request)
    .then(response => response.json())
    .then(data => data)
}