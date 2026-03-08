---
layout: page
title: 検索
permalink: /search/
---

<meta name="baseurl" content="{{ site.baseurl }}">

<div class="search-container">
  <input
    type="search"
    id="search-input"
    class="search-input"
    placeholder="キーワードを入力..."
    aria-label="サイト内検索"
    autocomplete="off"
  >
</div>

<div id="search-results"></div>

<script src="https://unpkg.com/lunr/lunr.js"></script>
<script src="{{ site.baseurl }}/assets/js/search.js"></script>

<style>
.search-container {
  margin: 1.5em 0;
}

.search-input {
  width: 100%;
  padding: 0.6em 0.8em;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.search-results-list {
  list-style: none;
  padding: 0;
  margin: 1em 0;
}

.search-result-item {
  border-bottom: 1px solid #eee;
  padding: 1em 0;
}

.search-result-title {
  font-size: 1.1em;
  font-weight: bold;
  text-decoration: none;
}

.search-result-title:hover {
  text-decoration: underline;
}

.search-result-excerpt {
  color: #555;
  font-size: 0.9em;
  margin: 0.3em 0 0;
}
</style>
