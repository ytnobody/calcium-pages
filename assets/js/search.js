(function () {
  'use strict';

  var searchIndex = null;
  var searchData = [];

  function initSearch() {
    var searchInput = document.getElementById('search-input');
    var searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    fetch(getBaseUrl() + '/search.json')
      .then(function (response) { return response.json(); })
      .then(function (data) {
        searchData = data;
        searchIndex = lunr(function () {
          this.field('title', { boost: 10 });
          this.field('content');
          this.ref('id');

          data.forEach(function (page) {
            this.add(page);
          }, this);
        });

        searchInput.addEventListener('input', function () {
          var query = searchInput.value.trim();
          if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
          }
          displayResults(query);
        });

        // Run search if query is already in URL
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q) {
          searchInput.value = q;
          displayResults(q);
        }
      })
      .catch(function (err) {
        searchResults.innerHTML = '<p>検索インデックスの読み込みに失敗しました。</p>';
        console.error('Search index load error:', err);
      });
  }

  function getBaseUrl() {
    var base = document.querySelector('meta[name="baseurl"]');
    return base ? base.getAttribute('content') : '';
  }

  function displayResults(query) {
    var searchResults = document.getElementById('search-results');
    var results;
    try {
      results = searchIndex.search(query);
    } catch (e) {
      results = [];
    }

    if (results.length === 0) {
      searchResults.innerHTML = '<p>「' + escapeHtml(query) + '」に一致するページが見つかりませんでした。</p>';
      return;
    }

    var html = '<ul class="search-results-list">';
    results.forEach(function (result) {
      var page = searchData.find(function (p) { return String(p.id) === result.ref; });
      if (!page) return;
      var excerpt = getExcerpt(page.content, query);
      html += '<li class="search-result-item">';
      html += '<a href="' + escapeHtml(page.url) + '" class="search-result-title">' + escapeHtml(page.title) + '</a>';
      html += '<p class="search-result-excerpt">' + escapeHtml(excerpt) + '</p>';
      html += '</li>';
    });
    html += '</ul>';
    html = '<p>' + results.length + ' 件見つかりました。</p>' + html;
    searchResults.innerHTML = html;
  }

  function getExcerpt(content, query) {
    if (!content) return '';
    var index = content.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return content.substring(0, 150) + '...';
    var start = Math.max(0, index - 60);
    var end = Math.min(content.length, index + query.length + 90);
    var excerpt = (start > 0 ? '...' : '') + content.substring(start, end) + (end < content.length ? '...' : '');
    return excerpt;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  document.addEventListener('DOMContentLoaded', initSearch);
})();
