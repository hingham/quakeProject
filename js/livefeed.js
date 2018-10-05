
var apiUrl = 'https://newsapi.org/v2/everything?' +
          'q=earthquake&' +
          'from=2018-10-02&' +
          'sortBy=popularity&' +
          'apiKey=cf545476892e4bbeb45ca2c5b1af080a';

var req = new Request(apiUrl);
var newsLink = document.getElementById('news-link');
var newsFeed = document.getElementById('liveFeed');
var timeout = 0;
var currentIndex = 0;

fetch(req)
  .then( response => response.json())
  .then( data => {
    var article = data;
    liveNewsFeed();
    function liveNewsFeed()
    {
      setTimeout(function() {
        newsFeed.innerHTML = '';
        newsLink.setAttribute('href', article.articles[currentIndex].url);
        var title = document.createElement('h3');
        var content=document.createTextNode(article.articles[currentIndex].title);
        title.appendChild(content);
        newsFeed.appendChild(title);
        var paragraph = document.createElement('p');
        var description = document.createTextNode(article.articles[currentIndex].description);
        paragraph.appendChild(description);
        newsFeed.appendChild(paragraph);
        currentIndex++;
        if (currentIndex === article.articles.length-1)
        {
          currentIndex = 0;
        }
        timeout = 10000;
        liveNewsFeed();
      }, timeout);
    }
  });
