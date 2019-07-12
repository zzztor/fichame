'use strict';

function click(e) {
  var input_date = document.querySelector('#date')
  var btn = document.querySelector('button');
  input_date.disabled = true
  btn.disabled = true
  var value = input_date.valueAsNumber;
  console.log('valueAsNumber', value)
  chrome.tabs.create({
    active: false,
    url: 'https://app.absence.io/#/timetracking'
}, function(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: 'var date = '+ value + '; var user_token = JSON.parse(window.localStorage.getItem("absenceConnectedAccounts"))[window.localStorage.getItem("activeid")].ajaxToken;'
    }, function() {
      chrome.tabs.executeScript(tab.id,
        {file:'/absense-logic.js'}, function(){
          input_date.disabled = false
          btn.disabled = false
        });
    });
}); 


 /*  
  chrome.tabs.executeScript(null, {code: ''}, function(){
    chrome.tabs.executeScript(null,
      {file:'/absense-logic.js'});
  }); */
  //window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#date').valueAsDate = new Date()
  var btn = document.querySelector('button');
  btn.addEventListener('click', click);
});
