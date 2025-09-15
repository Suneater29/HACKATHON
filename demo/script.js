const form = document.getElementById('degreeForm');
const fileInput = document.getElementById('degreeFile');
const resultDiv = document.getElementById('result');
const submitBtn = form.querySelector('button');
const tryAgainBtn = document.getElementById('tryAgainBtn');

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

  submitBtn.disabled = true;
  fileInput.disabled = true;
  tryAgainBtn.classList.add('hidden');

  resultDiv.className = 'result-neutral';
  resultDiv.innerHTML = `
    <div class="loader" aria-hidden="true"></div>
    <div>⏳ Verifying degree...</div>
    <div class="meta">${filename} • ${filesize}</div>
  `;

  const processingTimeMs = 1800 + Math.floor(Math.random() * 1400);
  setTimeout(() => {
    const isFake = Math.random() < 0.30;

    if (isFake) {
      setResult({
        type: 'error',
        message: '❌ Fake degree detected (demo simulation).',
        meta: `File: ${filename} • ${filesize}`
      });
    } else {
      setResult({
        type: 'success',
        message: '✅ Degree appears genuine (demo result).',
        meta: `File: ${filename} • ${filesize}`
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
