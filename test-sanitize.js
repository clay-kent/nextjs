let DOMPurify = require('isomorphic-dompurify');
console.log('typeof module:', typeof DOMPurify);
try {
  console.log('module keys:', Object.keys(DOMPurify));
} catch (e) {}

// Try common shapes: default, factory, or already-initialized
if (DOMPurify && DOMPurify.default && typeof DOMPurify.default.sanitize === 'function') {
  DOMPurify = DOMPurify.default;
} else if (typeof DOMPurify === 'function' && typeof DOMPurify().sanitize === 'function') {
  DOMPurify = DOMPurify();
}

const options = {
  ALLOWED_TAGS: [
    'img','h1','h2','h3','h4','h5','p','br','b','i','em','strong','pre','code','span'
  ],
  ALLOWED_ATTR: ['src','alt','width','height','loading','class'],
  ALLOWED_URI_REGEXP: /^(https?:|data:image\/(?:png|jpe?g|gif|webp);base64,)/i
};

const html = `<pre><code class="language-bash">echo "hello"\nls -la</code></pre>`;
console.log('INPUT:\n' + html + '\n---');
console.log('OUTPUT:\n' + DOMPurify.sanitize(html, options) + '\n---');
