

// ========================================
// SUPABASE BLOG VIEW COUNTER
// ========================================

const SUPABASE_URL = 'https://bbcqaqyapokhjmjgyaxl.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_Kt23qSsokM8SI3Z-n3WJ7A_Os12ftHb';

// Increment the view count for a blog post
async function incrementPostView(slug) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/increment_post_view`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({ post_slug: slug })
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const views = await response.json();
    return Number(views);

  } catch (error) {
    console.error('Could not update blog views:', error);
    return null;
  }
}


// Retrieve total views for multiple blog posts
async function getPostViews(slugs) {
  if (!slugs.length) return {};

  try {
    const params = new URLSearchParams({
      select: 'slug,views',
      slug: `in.(${slugs.map(s => `"${s}"`).join(',')})`
    });

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/post_views?${params}`,
      {
        headers: {
          'apikey': SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();

    return Object.fromEntries(
      data.map(item => [item.slug, Number(item.views)])
    );

  } catch (error) {
    console.error('Could not retrieve blog views:', error);
    return {};
  }
}


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

async function renderRecentBlogList(id, limit = 5) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const posts = await loadPosts();
    const recentPosts = posts.slice(0, limit);

    const viewCounts = await getPostViews(
      recentPosts.map(p => p.slug)
    );

    el.innerHTML = recentPosts.map(p => `
      <div class="recent-publication">
        <div class="recent-publication-info">
          <a href="${postUrl(p)}">${esc(p.title)}</a>
          ${
            p.date
              ? `<span class="small">${esc(p.date)}</span>`
              : ''
          }
        </div>

        <span class="recent-blog-views" title="Total article views">
          <span aria-hidden="true">◉</span>
          ${(viewCounts[p.slug] || 0).toLocaleString()} views
        </span>
      </div>
    `).join('');

  } catch (error) {
    console.error('Could not load recent blogs:', error);
  }
}



// Display an individual blog post
// Used on post.html

async function renderPost() {
  const root = document.getElementById('post-content');
  if (!root) return;

  const slug = new URLSearchParams(location.search).get('slug');

  if (!slug) {
    root.innerHTML =
      '<h1>Post not found</h1><p>Choose an article from the blog.</p>';
    return;
  }

  try {
    const posts = await loadPosts();
    const p = posts.find(x => x.slug === slug);

    if (!p) {
      root.innerHTML =
        '<h1>Post not found</h1><p>This article may have moved or been removed.</p>';
      return;
    }

    document.title = `${p.title} | Sourav Chakraborty`;

    // Increment the view count
    const views = await incrementPostView(slug);

    // Display the article
    root.innerHTML = `
      <a href="blog.html">← Back to blog</a>

      ${p.cover
        ? `<img class="post-cover-image"
             src="${esc(p.cover)}"
             alt="${esc(p.title)} cover image">`
        : `<div class="post-hero">${esc(p.symbol || 'BIO')}</div>`
      }

      <span class="tag">${esc(p.category || 'Science')}</span>

      <h1 class="page-title" style="margin-top:12px">
        ${esc(p.title)}
      </h1>

      <div class="article-meta">
        <span>${esc(p.date || 'Science note')}</span>
        <span class="view-count">
          <span aria-hidden="true">◉</span>
          ${views === null ? 'Views unavailable' :
            `${views.toLocaleString()} views`}
        </span>
      </div>

      <p>${esc(p.summary || '')}</p>

      <div class="post-body">
        ${formatBody(p.body || '')}
      </div>

      <p style="margin-top:24px">
        <a href="blog.html">← Explore more posts</a>
      </p>
    `;

  } catch (error) {
    console.error(error);
    root.innerHTML =
      '<h1>Unable to load this post</h1><p>Please return to the blog and try again.</p>';
  }
}



// Format the body of a blog post into paragraphs
function formatBody(body) {
  return String(body)
    .replace(/\r\n/g, '\n')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .trim();
}
