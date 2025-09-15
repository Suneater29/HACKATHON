document.getElementById('degreeForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formatSelect = document.getElementById('docFormat');
  const fileInput = document.getElementById('degreeFile');
  const resultDiv = document.getElementById('result');

  if (formatSelect.value === "") {
    resultDiv.style.color = 'red';
    resultDiv.innerHTML = '⚠ Please select a document format.';
    return;
  }

  if (fileInput.files.length === 0) {
    resultDiv.style.color = 'red';
    resultDiv.innerHTML = '⚠ Please select a file to upload.';
    return;
  }

  const file = fileInput.files[0];
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension !== formatSelect.value) {
    resultDiv.style.color = 'red';
    resultDiv.innerHTML = `⚠ Please upload a valid ${formatSelect.value.toUpperCase()} file.`;
    return;
  }

  // File details (will be shown after result)
  const fileSizeKB = (file.size / 1024).toFixed(2);
  const fileDetails = `
    <div class="file-details">
      📄 <strong>Name:</strong> ${file.name}<br>
      💾 <strong>Size:</strong> ${fileSizeKB} KB<br>
      📂 <strong>Type:</strong> ${file.type || extension.toUpperCase()}
    </div>
  `;

  // Show loader (without file details)
  resultDiv.style.color = '#444';
  resultDiv.innerHTML = '<div class="loader"></div>⏳ Verifying...';

  // --- Probability configuration ---
  const outcomeProbabilities = {
    genuine: 0.6, // 60%
    invalid: 0.3, // 30%
    nodata: 0.1,  // 10%
  };

  function weightedRandom(probabilities) {
    let r = Math.random();
    let cumulative = 0;
    for (let outcome in probabilities) {
      cumulative += probabilities[outcome];
      if (r <= cumulative) return outcome;
    }
  }

  // Simulate verification delay
  setTimeout(() => {
    let outcome = weightedRandom(outcomeProbabilities);

    if (outcome === "genuine") {
      resultDiv.innerHTML = '✅ Document is genuine' + fileDetails;
      resultDiv.style.color = 'green';
    } else if (outcome === "invalid") {
      resultDiv.innerHTML = '❌ Document is invalid' + fileDetails;
      resultDiv.style.color = 'red';
    } else {
      resultDiv.innerHTML = '⚠ No matching data found' + fileDetails;
      resultDiv.style.color = 'orange';
    }
  }, 2500);
});
