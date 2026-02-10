// Navigation Bar JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavMenu = document.getElementById('mobileNavMenu');
    const navLinks = document.querySelectorAll('.nav-tab-link, .mobile-nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileNavMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNavMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    // Tab switching functionality
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabName = this.getAttribute('data-tab');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            if (mobileNavMenu.classList.contains('active')) {
                mobileNavMenu.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileNavMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileNavMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
    
    // Close mobile menu on window resize (if resized to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            mobileNavMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
    
    // Initialize active tab based on URL hash
    const currentHash = window.location.hash || '#home';
    const activeLink = document.querySelector(`[href="${currentHash}"]`);
    if (activeLink) {
        navLinks.forEach(l => l.classList.remove('active'));
        activeLink.classList.add('active');
    }
});

// Upload and Analysis JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const dropArea = document.getElementById('dropArea');
    const filePreview = document.getElementById('filePreview');
    const filePreviewContainer = document.getElementById('filePreviewContainer');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const resultCard = document.getElementById('resultCard');
    const uploadForm = document.getElementById('uploadForm');
    const analyzeAnotherBtn = document.getElementById('analyzeAnother');
    const resultImage = document.getElementById('resultImage');
    const predictionDisplay = document.getElementById('predictionDisplay');
    
    // Browse button click triggers file input
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // File input change event
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            handleFileSelection(file);
        }
    });
    
    // Drag and drop functionality
    dropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    dropArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    
    dropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });
    
    // Handle file selection
    function handleFileSelection(file) {
        fileNameDisplay.textContent = file.name;
        
        // Preview image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                filePreview.src = e.target.result;
                resultImage.src = e.target.result;
                filePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
    
    // Form submission
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        // Show loading state
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyzing...';
        analyzeBtn.disabled = true;
        
        // For demonstration, simulate API call
        setTimeout(async () => {
            try {
                // Simulated response (replace with actual API call)
                const isTumorDetected = Math.random() > 0.5;
                const confidence = (Math.random() * 20 + 80).toFixed(1);
                
                displayResult(isTumorDetected ? 'Brain Tumor Detected' : 'No Brain Tumor Detected', confidence, isTumorDetected);
                
            } catch (error) {
                displayResult('Error: ' + error.message, 0, false);
            } finally {
                analyzeBtn.innerHTML = '<i class="fas fa-search me-2"></i>Analyze for Tumor Detection';
                analyzeBtn.disabled = false;
            }
        }, 2500);
    });
    
    // Display result
    function displayResult(result, confidence, isPositive) {
        // Update result card styling
        const resultIcon = document.getElementById('resultIcon');
        if (isPositive) {
            resultCard.className = 'result-card result-positive';
            predictionDisplay.className = 'prediction-result prediction-positive';
            predictionDisplay.innerHTML = `<i class="fas fa-exclamation-triangle me-3"></i>${result} (${confidence}% confidence)`;
            resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            document.getElementById('recommendation').textContent = 'Immediate consultation recommended';
        } else {
            resultCard.className = 'result-card result-negative';
            predictionDisplay.className = 'prediction-result prediction-negative';
            predictionDisplay.innerHTML = `<i class="fas fa-check-circle me-3"></i>${result} (${confidence}% confidence)`;
            resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            document.getElementById('recommendation').textContent = 'Routine follow-up recommended';
        }
        
        // Update confidence score
        document.getElementById('confidenceScore').textContent = confidence + '%';
        
        // Show results section
        resultCard.style.display = 'block';
        
        // Scroll to results
        resultCard.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Analyze another button
    analyzeAnotherBtn.addEventListener('click', function() {
        resultCard.style.display = 'none';
        filePreviewContainer.style.display = 'none';
        fileInput.value = '';
        uploadForm.reset();
        
        // Scroll to upload section
        document.getElementById('detection').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Download report button
    document.getElementById('downloadReport').addEventListener('click', function() {
        alert('Medical report download feature would be implemented in production. This is a demonstration.');
    });
});

// Tumor Modal JavaScript
const tumorData = {
    'glioma': {
        title: 'Glioma Brain Tumor',
        subtitle: 'Tumors arising from glial cells in the brain or spinal cord',
        image: 'https://th.bing.com/th/id/R.632e4d93111bc40714b1302d276ea53c?rik=YP4F%2bYETmhTHYg&riu=http%3a%2f%2fwww.mayoclinic.org%2f-%2fmedia%2fkcms%2fgbs%2fpatient-consumer%2fimages%2f2015%2f03%2f02%2f10%2f52%2fmcdc7_glioma-8col.jpg&ehk=lbsBU1HAyoqan78mwGOMPputpxAuJS3zW%2bxVTFohF9A%3d&risl=&pid=ImgRaw&r=0',
        description: 'Gliomas are tumors that originate from glial cells, which are supportive cells in the brain and spinal cord. They account for approximately 30% of all brain tumors and can vary greatly in their behavior, from slow-growing benign tumors to highly aggressive malignant cancers.',
        
        overview: 'Gliomas are classified based on the type of glial cell from which they arise and their grade (I-IV). Grade I and II gliomas are considered low-grade and grow slowly, while Grade III and IV gliomas are high-grade and aggressive.',
        
        symptoms: [
            'Persistent headaches that may worsen in the morning',
            'Seizures or convulsions',
            'Memory loss or cognitive decline',
            'Personality or behavior changes',
            'Difficulty with balance or coordination',
            'Speech difficulties',
            'Weakness or numbness in limbs',
            'Vision problems such as blurred or double vision'
        ],
        
        treatment: [
            'Surgical resection to remove as much tumor as possible',
            'Radiation therapy to target remaining cancer cells',
            'Chemotherapy with drugs like temozolomide',
            'Targeted therapy for specific genetic mutations',
            'Immunotherapy to boost the immune system',
            'Supportive care to manage symptoms'
        ],
        
        stats: [
            { value: '30%', label: 'Of all brain tumors' },
            { value: 'Grade I-IV', label: 'Tumor grading system' },
            { value: '5-15 years', label: 'Low-grade survival' },
            { value: '12-15 months', label: 'GBM average survival' }
        ]
    },
    
    'meningioma': {
        title: 'Meningioma',
        subtitle: 'Tumors forming on the membranes covering the brain and spinal cord',
        image: 'https://www.natural-health-news.com/wp-content/uploads/2015/01/Meningioma.png',
        description: 'Meningiomas are tumors that arise from the meninges, the protective membranes that cover the brain and spinal cord. They are the most common primary brain tumors, accounting for about 36% of cases. Most meningiomas are benign (non-cancerous) and grow slowly.',
        
        overview: 'Meningiomas are typically graded from I to III, with Grade I being benign, Grade II being atypical, and Grade III being malignant. They often cause symptoms by pressing on adjacent brain tissue rather than invading it.',
        
        symptoms: [
            'Gradual onset of headaches',
            'Seizures (especially in convexity meningiomas)',
            'Weakness in arms or legs',
            'Vision changes or loss',
            'Hearing loss or ringing in ears',
            'Memory problems',
            'Changes in personality or behavior',
            'Loss of smell (olfactory groove meningiomas)'
        ],
        
        treatment: [
            'Observation with regular MRI scans for small, asymptomatic tumors',
            'Surgical removal (craniotomy)',
            'Radiation therapy for residual or inoperable tumors',
            'Stereotactic radiosurgery (Gamma Knife)',
            'Hormone therapy for estrogen receptor-positive tumors',
            'Targeted drug therapy for recurrent cases'
        ],
        
        stats: [
            { value: '36%', label: 'Most common primary brain tumor' },
            { value: '90%', label: 'Are benign (Grade I)' },
            { value: '2:1', label: 'Female to male ratio' },
            { value: 'Slow', label: 'Growth rate typically' }
        ]
    },
    
    'pituitary': {
        title: 'Pituitary Adenoma',
        subtitle: 'Tumors in the pituitary gland affecting hormone production',
        image: 'https://hypogal.com/wp-content/uploads/2019/07/pituitary-gland-location-.png',
        description: 'Pituitary adenomas are tumors that develop in the pituitary gland, a small pea-sized gland at the base of the brain that controls hormone production throughout the body. These tumors are usually benign but can cause significant problems by disrupting normal hormone balance.',
        
        overview: 'Pituitary adenomas are classified as functioning (hormone-secreting) or non-functioning. Functioning tumors produce excess hormones, while non-functioning tumors cause symptoms by compressing surrounding structures. They represent about 10-15% of all intracranial tumors.',
        
        symptoms: [
            'Headaches, often behind the eyes',
            'Vision problems (especially loss of peripheral vision)',
            'Hormonal imbalances',
            'Fatigue and weakness',
            'Unexplained weight gain or loss',
            'Menstrual irregularities in women',
            'Erectile dysfunction in men',
            'Milk production unrelated to childbirth',
            'Changes in facial features (acromegaly)'
        ],
        
        treatment: [
            'Medication to regulate hormone levels (e.g., bromocriptine)',
            'Transsphenoidal surgery (through the nose)',
            'Radiation therapy for residual tumors',
            'Hormone replacement therapy',
            'Regular monitoring with MRI and hormone tests',
            'Support groups and patient education'
        ],
        
        stats: [
            { value: '10-15%', label: 'Of intracranial tumors' },
            { value: '75%', label: 'Are hormone-secreting' },
            { value: '1 in 4', label: 'People have small pituitary tumors' },
            { value: 'Excellent', label: 'Prognosis with treatment' }
        ]
    },
    
    'metastatic': {
        title: 'Metastatic Brain Tumor',
        subtitle: 'Cancer spreading to brain from other organs',
        image: 'https://www.mayoclinic.org/-/media/8059713251524ba6b60a2fb7c7d1a861.jpg',
        description: 'Metastatic brain tumors (brain metastases) occur when cancer cells spread to the brain from a primary cancer elsewhere in the body. These are the most common type of brain tumors in adults, occurring in 10-30% of adults with cancer.',
        
        overview: 'Metastatic brain tumors can occur as single lesions or multiple tumors throughout the brain. The most common primary cancers that spread to the brain include lung cancer, breast cancer, melanoma, kidney cancer, and colon cancer.',
        
        symptoms: [
            'Headaches, often worse in the morning',
            'Seizures (new onset in adults)',
            'Weakness or numbness on one side of the body',
            'Difficulty walking or loss of balance',
            'Speech difficulties',
            'Memory problems or confusion',
            'Personality or behavior changes',
            'Nausea and vomiting',
            'Vision problems'
        ],
        
        treatment: [
            'Stereotactic radiosurgery (Gamma Knife, CyberKnife)',
            'Whole brain radiation therapy',
            'Surgical removal for single, accessible tumors',
            'Chemotherapy tailored to primary cancer type',
            'Targeted therapy based on genetic markers',
            'Immunotherapy to boost immune response',
            'Supportive care and symptom management'
        ],
        
        stats: [
            { value: '20-40%', label: 'Of cancer patients develop brain mets' },
            { value: 'Lung #1', label: 'Most common primary source' },
            { value: 'Multiple', label: 'Usually multiple tumors' },
            { value: 'Months-years', label: 'Survival varies widely' }
        ]
    }
};

function openTumorModal(tumorType) {
    const data = tumorData[tumorType];
    const modal = document.getElementById('tumorModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBody = document.getElementById('modalBody');
    
    // Set modal title and subtitle
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    
    // Build modal content
    modalBody.innerHTML = `
        <div class="modal-image-container">
            <img src="${data.image}" class="modal-image" alt="${data.title}">
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-info-circle"></i> Overview</h3>
            <p>${data.description}</p>
            <p>${data.overview}</p>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="modal-section">
                    <h3 class="modal-section-title"><i class="fas fa-exclamation-triangle"></i> Common Symptoms</h3>
                    <ul class="modal-list">
                        ${data.symptoms.map(symptom => `<li><i class="fas fa-check"></i> ${symptom}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <div class="modal-section">
                    <h3 class="modal-section-title"><i class="fas fa-stethoscope"></i> Treatment Options</h3>
                    <ul class="modal-list">
                        ${data.treatment.map(treatment => `<li><i class="fas fa-plus-square"></i> ${treatment}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-chart-bar"></i> Key Statistics</h3>
            <div class="stats-grid">
                ${data.stats.map(stat => `
                    <div class="stat-item">
                        <div class="stat-value">${stat.value}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="modal-section">
            <div class="alert alert-info" role="alert">
                <i class="fas fa-lightbulb me-2"></i>
                <strong>Note:</strong> This information is for educational purposes. Always consult with a qualified medical professional for diagnosis and treatment options.
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeTumorModal() {
    const modal = document.getElementById('tumorModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside the content
document.getElementById('tumorModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeTumorModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeTumorModal();
    }
});