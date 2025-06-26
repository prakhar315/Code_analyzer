document.addEventListener('DOMContentLoaded', function() {
    // Production error handling wrapper
    try {
        const codeInput = document.getElementById('codeInput');
        const outputDisplay = document.getElementById('outputDisplay');
        const outputType = document.getElementById('outputType');
        const clearBtn = document.getElementById('clearBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');

        // Validate required elements exist
        if (!codeInput || !outputDisplay || !outputType || !analyzeBtn) {
            throw new Error('Required DOM elements not found');
        }

        // Initialize analyzers with error handling
        let tokenizer, parser;
        try {
            tokenizer = new CTokenizer();
            parser = new CParser();
        } catch (error) {
            console.error('Failed to initialize analyzers:', error);
            showError('Failed to initialize code analyzers. Please refresh the page.');
            return;
        }

    // Clear button functionality
    clearBtn.addEventListener('click', function() {
        codeInput.value = '';
        showPlaceholder();
    });

    // Analyze button functionality
    analyzeBtn.addEventListener('click', function() {
        const code = codeInput.value.trim();
        if (!code) {
            alert('Please enter some C code to analyze');
            return;
        }

        generateOutput(code, outputType.value);
    });

    // Output type selector change
    outputType.addEventListener('change', function() {
        const code = codeInput.value.trim();
        if (code) {
            generateOutput(code, outputType.value);
        }
    });

    function showPlaceholder() {
        outputDisplay.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">🎯</div>
                <h3>Welcome to C Code Analyzer</h3>
                <p>Enter your C code and select an analysis type to get started</p>

                <div class="quick-info">
                    <div class="info-card">
                        <div class="info-icon">🔍</div>
                        <h4>Lexical Analysis</h4>
                        <p>Tokenizes code into keywords, operators, identifiers, and literals with detailed categorization</p>
                    </div>
                    <div class="info-card">
                        <div class="info-icon">🌳</div>
                        <h4>Parse Tree</h4>
                        <p>Generates syntax tree following C grammar productions and compiler design principles</p>
                    </div>
                </div>

                <div class="tech-note">
                    <strong>✨ Client-side Analysis:</strong> No server required! Analysis runs directly in your browser using advanced JavaScript parsing algorithms.
                </div>
            </div>
        `;
    }

    function generateOutput(code, type) {
        // Show loading message
        outputDisplay.innerHTML = `<div class="output-content">Analyzing code...</div>`;

        let output = '';

        try {
            switch(type) {
                case 'lexical':
                    output = generateLexicalAnalysis(code);
                    break;
                case 'ast':
                    output = generateAST(code);
                    break;
                default:
                    output = 'Unknown analysis type selected.';
            }
        } catch (error) {
            output = `Error generating analysis: ${error.message}`;
        }

        outputDisplay.innerHTML = `<div class="output-content">${output}</div>`;
    }

    // Production error display function
    function showError(message) {
        if (outputDisplay) {
            outputDisplay.innerHTML = `
                <div class="error-message">
                    <div class="error-icon">⚠️</div>
                    <h3>Error</h3>
                    <p>${message}</p>
                    <div class="error-actions">
                        <button onclick="location.reload()" class="retry-btn">Refresh Page</button>
                    </div>
                </div>
            `;
        }
    }

    // Performance monitoring
    function measurePerformance(name, fn) {
        const start = performance.now();
        try {
            const result = fn();
            const end = performance.now();
            console.log(`${name} took ${(end - start).toFixed(2)}ms`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.error(`${name} failed after ${(end - start).toFixed(2)}ms:`, error);
            throw error;
        }
    }

    function generateLexicalAnalysis(code) {
        try {
            // Input validation
            if (!code || typeof code !== 'string') {
                throw new Error('Invalid input: Code must be a non-empty string');
            }

            if (code.length > 50000) {
                throw new Error('Code too large: Maximum 50,000 characters allowed');
            }

            return measurePerformance('Lexical Analysis', () => {
                const tokens = tokenizer.tokenize(code);
                return tokenizer.formatTokens(tokens);
            });
        } catch (error) {
            console.error('Lexical analysis error:', error);
            return `❌ Lexical Analysis Error\n\n${error.message}\n\nPlease check your code and try again.`;
        }
    }

    function generateAST(code) {
        try {
            // Input validation
            if (!code || typeof code !== 'string') {
                throw new Error('Invalid input: Code must be a non-empty string');
            }

            if (code.length > 50000) {
                throw new Error('Code too large: Maximum 50,000 characters allowed');
            }

            return measurePerformance('Parse Tree Generation', () => {
                const ast = parser.parse(code);
                return parser.formatAST(ast);
            });
        } catch (error) {
            console.error('Parse tree generation error:', error);
            return `❌ Parse Tree Generation Error\n\n${error.message}\n\nPlease check your C syntax and try again.`;
        }
    }



    // Initialize with placeholder
    showPlaceholder();

    } catch (error) {
        console.error('Application initialization error:', error);
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #e74c3c;">⚠️ Application Error</h2>
                    <p>Failed to initialize the C Code Analyzer.</p>
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Refresh Page</button>
                </div>
            </div>
        `;
    }
});
