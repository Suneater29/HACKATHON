document.getElementById('degreeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const fileInput = document.getElementById('degreeFile');
  const resultDiv = document.getElementById('result');

  if (fileInput.files.length === 0) {
    resultDiv.style.color = 'red';
    resultDiv.innerHTML = '⚠️ Please select a file to upload.';
    return;
  }

  // Show loader
  resultDiv.style.color = '#444';
  resultDiv.innerHTML = '<div class="loader"></div>⏳ Verifying degree...';

  // Demo simulation (2.5 sec delay)
  setTimeout(() => {
    resultDiv.innerHTML = '✅ Degree is genuine (demo result)';
    resultDiv.style.color = 'green';
  }, 2500);
});
