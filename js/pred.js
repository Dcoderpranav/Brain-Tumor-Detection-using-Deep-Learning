// Handle form submission with AJAX
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const resultCard = document.getElementById('resultCard');
    const predictionDisplay = document.getElementById('predictionDisplay');
    
    if (!fileInput.files[0]) {
        alert('Please select an MRI image first');
        return;
    }
    
    // Show loading state
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyzing...';
    analyzeBtn.disabled = true;
    
    // Create form data
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    
    try {
        // Send to backend
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show results
            displayResults(result);
            resultCard.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert('Failed to analyze image. Please try again.');
        console.error(error);
    } finally {
        // Reset button
        analyzeBtn.innerHTML = '<i class="fas fa-search me-2"></i>Analyze for Tumor Detection';
        analyzeBtn.disabled = false;
    }
});

function displayResults(result) {
    const predictionDisplay = document.getElementById('predictionDisplay');
    const resultImage = document.getElementById('resultImage');
    const confidenceScore = document.getElementById('confidenceScore');
    const processingTime = document.getElementById('processingTime');
    
    // Update image preview
    resultImage.src = result.image_path;
    
    // Update stats
    confidenceScore.textContent = `${result.confidence}%`;
    processingTime.textContent = `${result.processing_time} seconds`;
    
    // Create result display
    let resultHTML = '';
    
    if (result.has_tumor !== undefined) {
        // Binary classification result
        const isTumor = result.has_tumor;
        
        resultHTML = `
            <div class="alert ${isTumor ? 'alert-warning' : 'alert-success'}" role="alert">
                <h4 class="alert-heading">
                    <i class="fas ${isTumor ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2"></i>
                    ${result.message}
                </h4>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <div class="progress" style="height: 25px;">
                            <div class="progress-bar ${isTumor ? 'bg-warning' : 'bg-success'}" 
                                 role="progressbar" 
                                 style="width: ${result.confidence}%"
                                 aria-valuenow="${result.confidence}" 
                                 aria-valuemin="0" 
                                 aria-valuemax="100">
                                ${result.confidence}% Confidence
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Tumor Probability:</strong> ${result.tumor_probability}%</p>
                        <p><strong>No Tumor Probability:</strong> ${result.no_tumor_probability}%</p>
                    </div>
                </div>
                ${isTumor ? 
                    '<hr><p class="mb-0"><strong>Recommendation:</strong> Please consult with a radiologist for further evaluation and treatment planning.</p>' : 
                    '<hr><p class="mb-0"><strong>Note:</strong> This result should be reviewed by a medical professional. Regular check-ups are recommended.</p>'
                }
            </div>
        `;
    } else {
        // Multi-class classification
        resultHTML = `
            <div class="alert ${result.tumor_type === 'No Tumor' ? 'alert-success' : 'alert-warning'}" role="alert">
                <h4 class="alert-heading">
                    <i class="fas ${result.tumor_type === 'No Tumor' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2"></i>
                    ${result.message}
                </h4>
                <p><strong>Confidence:</strong> ${result.confidence}%</p>
                <div class="progress" style="height: 25px;">
                    <div class="progress-bar ${result.tumor_type === 'No Tumor' ? 'bg-success' : 'bg-warning'}" 
                         role="progressbar" 
                         style="width: ${result.confidence}%"
                         aria-valuenow="${result.confidence}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${result.confidence}% Confidence
                    </div>
                </div>
                <hr>
                <p class="mb-0">
                    <strong>Next Steps:</strong> 
                    ${result.tumor_type === 'No Tumor' ? 
                        'Regular monitoring recommended.' : 
                        'Consult with a neurologist or oncologist for proper diagnosis and treatment options.'}
                </p>
            </div>
        `;
    }
    
    predictionDisplay.innerHTML = resultHTML;
}

// Reset form
document.getElementById('analyzeAnother')?.addEventListener('click', function() {
    document.getElementById('uploadForm').reset();
    document.getElementById('filePreviewContainer').style.display = 'none';
    document.getElementById('predictionDisplay').innerHTML = '';
    document.getElementById('detection').scrollIntoView({ behavior: 'smooth' });
});