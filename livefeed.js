
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


    newsLink.setAttribute('href', article.articles[0].url);
    
    var title = document.createElement('h3');
    var content=document.createTextNode(article.articles[0].title);
    title.appendChild(content);
    newsFeed.appendChild(title);

    var paragraph = document.createElement('p');
    var description = document.createTextNode(article.articles[0].description);
    paragraph.appendChild(description);
    newsFeed.appendChild(paragraph);


    for( var i = 1; i < article.articles.length; i ++){
      (function(i) {
        setTimeout(function() {
          console.log(article.articles[i].title);
          newsFeed.innerHTML = '';
          newsLink.setAttribute('href', article.articles[i].url);
    
          var title = document.createElement('h3');
          var content=document.createTextNode(article.articles[i].title);
          title.appendChild(content);
          newsFeed.appendChild(title);

          var paragraph = document.createElement('p');
          var description = document.createTextNode(article.articles[i].description);
          paragraph.appendChild(description);
          newsFeed.appendChild(paragraph);
         

        }, 10000*i);
      })(i);

    }

    console.log(article.articles[0].url);
  });




