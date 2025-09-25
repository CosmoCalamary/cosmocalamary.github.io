(async function () {
  const $cats = document.getElementById('categories');
  const $search = document.getElementById('search');

  function render(data, q = '') {
    const query = (q || '').toLowerCase().trim();
    $cats.innerHTML = '';

    const cats = (data.categories || []).map(c => {
      const items = (c.links || []).filter(l => {
        if (!query) return true;
        const hay = [l.title, l.url, l.desc].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(query);
      });
      return { title: c.title, links: items };
    }).filter(c => c.links.length);

    for (const cat of cats) {
      const wrap = document.createElement('div');
      wrap.className = 'category';

      const details = document.createElement('details');
      details.open = true;

      const summary = document.createElement('summary');
      summary.textContent = cat.title;

      const list = document.createElement('div');
      list.className = 'links';

      for (const link of cat.links) {
        const item = document.createElement('div');
        item.className = 'link-item';

        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.title || link.url;
        a.target = '_self';
        if (link.desc && link.desc.trim()) {
          a.setAttribute('title', link.desc);
          a.setAttribute('data-tip', link.desc); // custom tooltip
        }

        const small = document.createElement('small');
        small.textContent = new URL(link.url).hostname;

        item.appendChild(a);
        item.appendChild(small);
        list.appendChild(item);
      }

      details.appendChild(summary);
      details.appendChild(list);
      wrap.appendChild(details);
      $cats.appendChild(wrap);
    }
  }

  async function load() {
    try {
      const res = await fetch('data/links.json', { cache: 'no-store' });
      const json = await res.json();
      return json;
    } catch (e) {
      console.error(e);
      return { categories: [] };
    }
  }

  const data = await load();
  render(data);

  let t;
  $search.addEventListener('input', (e) => {
    clearTimeout(t);
    const val = e.target.value;
    t = setTimeout(() => render(data, val), 120);
  });
})();
