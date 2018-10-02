
var apiUrl = 'https://newsapi.org/v2/everything?' +
          'q=earthquake&' +
          'from=2018-10-02&' +
          'sortBy=popularity&' +
          'apiKey=cf545476892e4bbeb45ca2c5b1af080a';


var req = new Request(apiUrl);

var newsLink = document.getElementById('news-link');
var newsFeed = document.getElementById('liveFeed');

fetch(req)
  .then( response => response.json())
  .then( data => {
    var article = data;
    console.log(article);
    console.log('length' + article.articles.length);

    var content=document.createTextNode(article.articles[0].title + ': ' + article.articles[0].description);
    newsFeed.appendChild(content);
    newsLink.setAttribute('href', article.articles[0].url);


    for( var i = 1; i < article.articles.length; i ++){
      (function(i) {
        setTimeout(function() {
          console.log(article.articles[i].title);
          newsFeed.innerHTML = '';
          var content=document.createTextNode(article.articles[i].title + ': ' + article.articles[i].description);
          newsFeed.appendChild(content);
          newsLink.setAttribute('href', article.articles[i].url);
          console.log(i);
         
        }, 500*i);
      })(i);

    }

    console.log(article.articles[0].url);
  });




