const form = document.getElementById('degreeForm');
const fileInput = document.getElementById('degreeFile');
const resultDiv = document.getElementById('result');
const submitBtn = form.querySelector('button');
const tryAgainBtn = document.getElementById('tryAgainBtn');

// probabilities (configurable)
const PROB_FAKE = 0.3;       // 30%
const PROB_NOT_FOUND = 0.2;  // 20%
// remaining (50%) → genuine

function humanFileSize(bytes) {
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) return bytes + ' B';
  const units = ['KB','MB','GB','TB','PB','EB','ZB','YB'];
  let u = -1;
  do { bytes /= thresh; ++u; } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
}

function setResult({ type = 'neutral', message = '', meta = '' }) {
  resultDiv.className = '';
  if (type === 'success') resultDiv.classList.add('result-success');
  else if (type === 'error') resultDiv.classList.add('result-error');
  else resultDiv.classList.add('result-neutral');

  resultDiv.innerHTML = `
    <div>${message}</div>
    ${meta ? `<div class="meta">${meta}</div>` : ''}
  `;
}

resultDiv.setAttribute('role', 'status');
resultDiv.setAttribute('aria-live', 'polite');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!fileInput.files || fileInput.files.length === 0) {
    setResult({ type: 'error', message: '⚠️ Please select a file to upload.' });
    return;
  }

  const file = fileInput.files[0];
  const filename = file.name;
  const filesize = humanFileSize(file.size);
  const filetype = file.type || 'Unknown';

  submitBtn.disabled = true;
  fileInput.disabled = true;
  tryAgainBtn.classList.add('hidden');

  // show loader + file details
  resultDiv.className = 'result-neutral';
  resultDiv.innerHTML = `
    <div class="loader" aria-hidden="true"></div>
    <div>⏳ Verifying degree...</div>
    <div class="meta">
      📄 File: ${filename} <br>
      📦 Size: ${filesize} <br>
      📝 Type: ${filetype}
    </div>
  `;

  const processingTimeMs = 1800 + Math.floor(Math.random() * 1400);
  setTimeout(() => {
    const rand = Math.random();
    if (rand < PROB_FAKE) {
      setResult({
        type: 'error',
        message: '❌ Fake degree detected',
        meta: `File: ${filename} • ${filesize} • ${filetype}`
      });
    } else if (rand < PROB_FAKE + PROB_NOT_FOUND) {
      setResult({
        type: 'error',
        message: '⚠️ No matching record found in database',
        meta: `File: ${filename} • ${filesize} • ${filetype}`
      });
    } else {
      setResult({
        type: 'success',
        message: '✅ Degree appears genuine',
        meta: `File: ${filename} • ${filesize} • ${filetype}`
      });
    }

    submitBtn.disabled = false;
    fileInput.disabled = false;
    tryAgainBtn.classList.remove('hidden');
  }, processingTimeMs);
});

tryAgainBtn.addEventListener('click', () => {
  fileInput.value = "";
  resultDiv.innerHTML = "";
  resultDiv.className = "";
  tryAgainBtn.classList.add('hidden');
});
