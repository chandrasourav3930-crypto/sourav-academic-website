
// Load all blog posts from posts.json
async function loadPosts() {
  const response = await fetch('posts.json');

  if (!response.ok) {
    throw new Error('Could not load posts');
  }

  return await response.json();
}


// Escape HTML characters to prevent unwanted HTML injection
function esc(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}


// Generate the URL for an individual blog post
function postUrl(p) {
  return `post.html?slug=${encodeURIComponent(p.slug)}`;
}


// Display blog posts as full cards
// Used on blog.html
function renderCards(id, limit = 99) {
  loadPosts()
    .then(posts => {
      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = posts.slice(0, limit).map(p => `
        <article class="card">
          <a href="${postUrl(p)}" aria-label="Read ${esc(p.title)}">
            ${
              p.cover
                ? `<img class="cover-image" src="${esc(p.cover)}" alt="${esc(p.title)} cover image" loading="lazy">`
                : `<div class="cover"><span>${esc(p.symbol || 'BIO')}</span></div>`
            }
          </a>

          <div class="card-body">
            <span class="tag">${esc(p.category || 'Science')}</span>

            <h3>
              <a href="${postUrl(p)}">${esc(p.title)}</a>
            </h3>

            <p>${esc(p.summary || '')}</p>

            <a class="read" href="${postUrl(p)}">
              Read article →
            </a>
          </div>
        </article>
      `).join('');
    })
    .catch(error => {
      console.error('Could not load blog cards:', error);
    });
}


// Display recent blog posts as a compact list
// Used on the homepage
function renderRecentBlogList(id, limit = 5) {
  loadPosts()
    .then(posts => {
      const el = document.getElementById(id);
      if (!el) return;

      el.innerHTML = posts.slice(0, limit).map(p => `
        <div class="recent-publication">
          <a href="${postUrl(p)}">${esc(p.title)}</a>
          ${
            p.date
              ? `<span class="small">${esc(p.date)}</span>`
              : ''
          }
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Could not load recent blogs:', error);
    });
}


// Display an individual blog post
// Used on post.html
async function renderPost() {
  const root = document.getElementById('post-content');
  if (!root) return;

  const slug = new URLSearchParams(location.search).get('slug');

  if (!slug) {
    root.innerHTML = `
      <h1>Post not found</h1>
      <p>Choose an article from the blog.</p>
    `;
    return;
  }

  try {
    const posts = await loadPosts();
    const p = posts.find(x => x.slug === slug);

    if (!p) {
      root.innerHTML = `
        <h1>Post not found</h1>
        <p>This article may have moved or been removed.</p>
      `;
      return;
    }

    document.title = `${p.title} | Sourav Chakraborty`;

    root.innerHTML = `
      <a href="blog.html">← Back to blog</a>

      ${
        p.cover
          ? `<img class="post-cover-image" src="${esc(p.cover)}" alt="${esc(p.title)} cover image">`
          : `<div class="post-hero">${esc(p.symbol || 'BIO')}</div>`
      }

      <span class="tag">${esc(p.category || 'Science')}</span>

      <h1 class="page-title" style="margin-top:12px">
        ${esc(p.title)}
      </h1>

      <p class="small">${esc(p.date || 'Science note')}</p>

      <p>${esc(p.summary || '')}</p>

      <div class="post-body">
        ${formatBody(p.body || '')}
      </div>

      <p style="margin-top:24px">
        <a href="blog.html">← Explore more posts</a>
      </p>
    `;

  } catch (error) {
    console.error('Could not load individual post:', error);

    root.innerHTML = `
      <h1>Unable to load this post</h1>
      <p>Please return to the blog and try again.</p>
    `;
  }
}


// Format the body of a blog post into paragraphs
function formatBody(body) {
  return String(body)
    .split(/\n\s*\n/)
    .map(paragraph => `
      <p>${esc(paragraph).replace(/\n/g, '<br>')}</p>
    `)
    .join('');
}
