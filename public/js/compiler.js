// ============================================================
// compiler.js — Full compiler page logic
// ============================================================

(function () {
    'use strict';

    const $ = (s) => document.querySelector(s);
    const $$ = (s) => document.querySelectorAll(s);

    const DOM = {
        editor: $('#editor'),
        langSelect: $('#langSelect'),
        runBtn: $('#runBtn'),
        submitBtn: $('#submitBtn'),
        newProblemBtn: $('#newProblemBtn'),
        outputContent: $('#outputContent'),
        testCasesContainer: $('#testCasesContainer'),
        problemTitle: $('#problemTitle'),
        problemDifficulty: $('#problemDifficulty'),
        problemDescription: $('#problemDescription'),
        problemConstraints: $('#problemConstraints'),
        problemExamples: $('#problemExamples'),
        chatMessages: $('#chatMessages'),
        chatInput: $('#chatInput'),
        chatSend: $('#chatSend'),
        chatClear: $('#chatClear'),
        outputTabs: $$('.output-tabs button'),
        themeToggle: $('#themeToggle'),
        customStdin: $('#customStdin'),
    };

    // ---------- Toast notification ----------
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.heymine-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `heymine-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ---------- State ----------
    const STATE = {
        language: 'python',
        problem: null,
        testCases: [],
        results: [],
        chatHistory: [],
        isRunning: false,
        isSubmitting: false,
        editorInstance: null,
        currentOutputTab: 'console',
    };

    const THEME_KEY = 'heymine-theme';

    function getTheme() {
        return localStorage.getItem(THEME_KEY) || 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        const icon = document.querySelector('.theme-icon');
        if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        if (STATE.editorInstance) {
            monaco.editor.setTheme(theme === 'dark' ? 'vs-dark' : 'vs');
        }
    }

    function toggleTheme() {
        const current = getTheme();
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    setTheme(getTheme());

    // ------------- Reset for new problem -------------
    function resetForNewProblem() {
        DOM.chatMessages.innerHTML = '';
        STATE.chatHistory = [];
        addChatMessage('ai', '🔄 Loading a new problem...');

        STATE.results = [];
        renderTestCases();

        if (STATE.editorInstance) {
            STATE.editorInstance.setValue(getStarterCode(STATE.language));
        }

        DOM.outputContent.textContent = '// Loading...';
        DOM.outputContent.className = 'output-content';

        if (DOM.customStdin) DOM.customStdin.value = '';

        fetchProblem();
    }

    // ------------- Fetch problem (with optional topic) -------------
    async function fetchProblem(options = {}) {
        const { difficulty = 'easy', topic = null } = options;
        try {
            const body = { difficulty };
            if (topic) body.topic = topic;
            const resp = await fetch('/api/problem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await resp.json();
            if (data.success) {
                STATE.problem = data.problem;
                renderProblem(data.problem);
                STATE.testCases = data.problem.testCases || [];
                STATE.results = STATE.testCases.map(() => ({ status: 'pending' }));
                renderTestCases();

                if (STATE.testCases.length > 0 && DOM.customStdin) {
                    DOM.customStdin.value = STATE.testCases[0].input || '';
                }

                if (STATE.editorInstance) {
                    STATE.editorInstance.setValue(getStarterCode(STATE.language));
                }
                DOM.outputContent.textContent = '// Ready to code';
                DOM.outputContent.className = 'output-content';
                addChatMessage('ai', `📝 New problem: **${data.problem.title}**. Let's solve it!`);
            } else {
                throw new Error(data.error || 'Failed to load problem');
            }
        } catch (err) {
            console.error('❌ Problem fetch error:', err);
            DOM.problemTitle.textContent = '⚠️ Using fallback problem';
            DOM.problemDescription.innerHTML = `<p class="empty-state">${err.message}</p>`;
            const fallback = getFallbackProblem();
            STATE.problem = fallback;
            renderProblem(fallback);
            STATE.testCases = fallback.testCases || [];
            STATE.results = STATE.testCases.map(() => ({ status: 'pending' }));
            renderTestCases();
            if (STATE.testCases.length > 0 && DOM.customStdin) {
                DOM.customStdin.value = STATE.testCases[0].input || '';
            }
            addChatMessage('ai', '⚠️ Could not fetch a new problem from AI. Using a built-in fallback problem.');
        }
    }

    // ------------- Fallback problem (with timestamp) -------------
    function getFallbackProblem() {
        const ts = Date.now().toString().slice(-6);
        return {
            id: 'fallback-' + ts,
            title: `Array Sum (Fallback #${ts})`,
            difficulty: 'easy',
            description: 'Read an integer n, then n integers, and print their sum.',
            constraints: ['1 ≤ n ≤ 1000', '-10^6 ≤ each integer ≤ 10^6'],
            examples: [
                { input: '3\n1 2 3', output: '6' },
                { input: '4\n-1 2 -3 4', output: '2' },
            ],
            testCases: [
                { input: '3\n1 2 3', expected: '6' },
                { input: '4\n-1 2 -3 4', expected: '2' },
                { input: '5\n10 20 30 40 50', expected: '150' },
            ],
        };
    }

    function renderProblem(problem) {
        DOM.problemTitle.textContent = problem.title || 'Untitled';
        const diff = problem.difficulty || 'easy';
        DOM.problemDifficulty.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);
        DOM.problemDifficulty.className = `diff-badge diff-${diff}`;

        // Description
        DOM.problemDescription.innerHTML = `<p>${problem.description || ''}</p>`;

        // Constraints
        if (problem.constraints && problem.constraints.length) {
            DOM.problemConstraints.innerHTML =
                '<ul>' + problem.constraints.map(c => `<li>${escapeHtml(c)}</li>`).join('') + '</ul>';
        } else {
            DOM.problemConstraints.innerHTML = '<p class="empty-state">No constraints listed.</p>';
        }

        // IO format section
        const ioInput  = document.getElementById('ioInputDesc');
        const ioOutput = document.getElementById('ioOutputDesc');
        if (ioInput)  ioInput.textContent  = 'Read from standard input (stdin)';
        if (ioOutput) ioOutput.textContent = 'Write to standard output (stdout)';

        // Examples — new card layout
        if (problem.examples && problem.examples.length) {
            DOM.problemExamples.innerHTML = problem.examples.map((ex, i) => `
                <div class="example-card">
                    <div class="example-card-header">
                        <span>Example ${i + 1}</span>
                    </div>
                    <div class="example-grid">
                        <div class="example-col">
                            <div class="example-col-label">Input</div>
                            <pre>${escapeHtml(String(ex.input ?? ''))}</pre>
                        </div>
                        <div class="example-col">
                            <div class="example-col-label">Output</div>
                            <pre>${escapeHtml(String(ex.output ?? ''))}</pre>
                        </div>
                    </div>
                    ${ex.explanation ? `<div class="example-explanation"><strong>Explanation:</strong> ${escapeHtml(ex.explanation)}</div>` : ''}
                </div>
            `).join('');
        } else {
            DOM.problemExamples.innerHTML = '<p class="empty-state">No examples provided.</p>';
        }
    }

    // ------------- Render test cases -------------
    function renderTestCases() {
        const container = DOM.testCasesContainer;
        if (!STATE.testCases.length) {
            container.innerHTML = '<p class="empty-state">No test cases available.</p>';
            return;
        }

        // Update tab badge
        const badge = document.getElementById('testCountBadge');
        if (badge) {
            const passed  = STATE.results.filter(r => r.status === 'passed').length;
            const failed  = STATE.results.filter(r => r.status === 'failed').length;
            const pending = STATE.results.filter(r => r.status === 'pending').length;
            if (pending > 0) {
                badge.textContent = STATE.testCases.length;
                badge.className = 'test-count-badge';
            } else if (failed > 0) {
                badge.textContent = `${passed}/${STATE.testCases.length}`;
                badge.className = 'test-count-badge failed';
            } else {
                badge.textContent = `${passed}/${STATE.testCases.length}`;
                badge.className = 'test-count-badge passed';
            }
        }

        let html = '<div class="test-cases-grid">';
        STATE.testCases.forEach((tc, i) => {
            const result = STATE.results[i] || { status: 'pending' };
            const statusClass = result.status === 'passed' ? 'passed' :
                result.status === 'failed' ? 'failed' : 'pending';
            const statusLabel = result.status === 'passed' ? '✅ Passed' :
                result.status === 'failed' ? '❌ Failed' : '⏳ Pending';
            const cardClass = `${statusClass}-card`;
            const actual = result.status !== 'pending' ? (result.actual || '') : null;
            const actualClass = result.status === 'passed' ? 'actual-pass' :
                result.status === 'failed' ? 'actual-fail' : '';

            // For multi-line outputs (patterns/pyramids), build a diff-aware render
            const expectedStr = String(tc.expected ?? '');
            const actualStr   = actual !== null ? String(actual) : '';
            const isMultiLine = expectedStr.includes('\n') || actualStr.includes('\n');

            let actualRendered;
            if (actual === null) {
                actualRendered = '<em class="empty-val">not run yet</em>';
            } else if (result.status === 'failed' && isMultiLine) {
                // Render line-by-line diff for pattern problems
                const expLines = expectedStr.split('\n');
                const actLines = actualStr.split('\n');
                const maxLen   = Math.max(expLines.length, actLines.length);
                let diffHtml = '';
                for (let ln = 0; ln < maxLen; ln++) {
                    const expLine = expLines[ln] ?? '';
                    const actLine = actLines[ln] ?? '';
                    const match   = expLine === actLine;
                    diffHtml += `<span class="diff-line ${match ? 'diff-match' : 'diff-wrong'}">${escapeHtml(actLine || ' ')}</span>\n`;
                }
                actualRendered = `<div class="diff-output">${diffHtml}</div>`;
            } else {
                actualRendered = escapeHtml(actualStr || '—');
            }

            // Line count badge for multi-line values
            const expLineCount  = expectedStr.split('\n').length;
            const lineBadge     = isMultiLine ? `<span class="line-count-badge">${expLineCount} lines</span>` : '';

            html += `
                <div class="test-card ${cardClass}">
                    <div class="test-header">
                        <span>Case #${i + 1}</span>
                        ${lineBadge}
                        <span class="test-status ${statusClass}">${statusLabel}</span>
                    </div>
                    <div class="test-details">
                        <div class="test-detail-cell">
                            <div class="test-detail-label">Input</div>
                            <div class="test-detail-value">${escapeHtml(tc.input || '—')}</div>
                        </div>
                        <div class="test-detail-cell">
                            <div class="test-detail-label">Expected</div>
                            <div class="test-detail-value">${escapeHtml(expectedStr || '—')}</div>
                        </div>
                        <div class="test-detail-cell">
                            <div class="test-detail-label">Actual</div>
                            <div class="test-detail-value ${actualClass}">${actualRendered}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // ------------- Chat: Premium rich markdown-like formatting for AI messages -------------
    function formatAIMessage(rawText) {
        // We process the raw text before HTML-escaping code content
        let text = rawText;

        // Step 1: Extract fenced code blocks BEFORE any other processing
        // Store them in a map to restore later
        const codeBlocks = [];
        text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
            const idx = codeBlocks.length;
            const langLabel = lang ? lang.trim() : 'code';
            const langDisplay = langLabel.charAt(0).toUpperCase() + langLabel.slice(1);
            const escapedCode = escapeHtml(code.trimEnd());
            const blockId = `ai-code-${Date.now()}-${idx}`;
            codeBlocks.push(`<div class="ai-code-block"><div class="ai-code-block-header"><span class="ai-code-lang">${escapeHtml(langDisplay)}</span><button class="ai-code-copy-btn" data-block-id="${blockId}" onclick="(function(btn){const pre=btn.closest('.ai-code-block').querySelector('pre');navigator.clipboard&&navigator.clipboard.writeText(pre.innerText).then(()=>{btn.textContent='✓ Copied!';setTimeout(()=>{btn.textContent='Copy'},1500);})})(this)">Copy</button></div><pre id="${blockId}"><code>${escapedCode}</code></pre></div>`);
            return `%%CODEBLOCK_${idx}%%`;
        });

        // Step 2: Extract diagram/box sections
        // Pattern: lines starting with |--- or similar box characters
        const diagrams = [];
        text = text.replace(/\[diagram\]([\s\S]*?)\[\/diagram\]/gi, (_, content) => {
            const idx = diagrams.length;
            const escapedContent = escapeHtml(content.trim());
            diagrams.push(`<div class="ai-diagram-box"><div class="ai-diagram-box-header">📊 Visual Diagram</div><div class="ai-diagram-box-body">${escapedContent}</div></div>`);
            return `%%DIAGRAM_${idx}%%`;
        });

        // Step 3: HTML escape remaining text (not placeholders)
        let html = '';
        const parts = text.split(/(%%(?:CODEBLOCK|DIAGRAM)_\d+%%)/);
        parts.forEach(part => {
            if (/^%%(?:CODEBLOCK|DIAGRAM)_\d+%%$/.test(part)) {
                html += part; // placeholder, restore later
            } else {
                html += escapeHtml(part);
            }
        });

        // Step 4: Inline code `code`
        html = html.replace(/`([^`\n]+)`/g, '<code>$1</code>');

        // Step 5: Bold **text** and Italic *text*
        html = html.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');

        // Step 6: Callout lines: > tip, > note, > warning
        html = html.replace(/^&gt;\s*(?:💡|tip:?)\s*(.+)$/gim,
            '<div class="ai-highlight-box tip"><span class="ai-highlight-box-icon">💡</span><span class="ai-highlight-box-text">$1</span></div>');
        html = html.replace(/^&gt;\s*(?:ℹ️|note:?|info:?)\s*(.+)$/gim,
            '<div class="ai-highlight-box info"><span class="ai-highlight-box-icon">ℹ️</span><span class="ai-highlight-box-text">$1</span></div>');
        html = html.replace(/^&gt;\s*(?:⚠️|warning:?|warn:?)\s*(.+)$/gim,
            '<div class="ai-highlight-box warning"><span class="ai-highlight-box-icon">⚠️</span><span class="ai-highlight-box-text">$1</span></div>');
        html = html.replace(/^&gt;\s*(.+)$/gim,
            '<div class="ai-highlight-box tip"><span class="ai-highlight-box-icon">💡</span><span class="ai-highlight-box-text">$1</span></div>');

        // Step 7: Headings
        html = html.replace(/^###\s+(.+)$/gm, '<h5>$1</h5>');
        html = html.replace(/^##\s+(.+)$/gm,  '<h5>$1</h5>');
        html = html.replace(/^#\s+(.+)$/gm,   '<h4>$1</h4>');

        // Step 8: Numbered lists → visual step boxes
        // Collect consecutive numbered items and render as step boxes
        html = html.replace(/(?:^\d+\.\s+.+$(?:\n|$))+/gm, (match) => {
            const lines = match.trim().split('\n');
            let counter = 0;
            const items = lines.map(line => {
                const m = line.match(/^(\d+)\.\s+(.+)$/);
                if (!m) return '';
                counter++;
                return `<div class="ai-step-box"><div class="ai-step-num">${counter}</div><div>${m[2]}</div></div>`;
            }).filter(Boolean);
            return items.join('');
        });

        // Step 9: Bullet lists → styled list items
        // Collect consecutive bullet lines
        html = html.replace(/(?:^[-*•]\s+.+$(?:\n|$))+/gm, (match) => {
            const lines = match.trim().split('\n');
            const items = lines.map(line => {
                const m = line.match(/^[-*•]\s+(.+)$/);
                return m ? `<li>${m[1]}</li>` : '';
            }).filter(Boolean);
            return `<ul>${items.join('')}</ul>`;
        });

        // Step 10: Complexity detection → badge display
        html = html.replace(
            /(?:time|space)\s+complexity[:\s]+([Oo]\([^)]+\))/gi,
            (match, complexity) => {
                const isTime = /time/i.test(match);
                const label = isTime ? 'Time' : 'Space';
                return `<span class="ai-complexity-badge"><span class="badge-key">${label}</span><span class="badge-val">${escapeHtml(complexity)}</span></span>`;
            }
        );

        // Step 11: Paragraph breaks
        html = html.replace(/\n\n+/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');

        // Step 12: Restore code blocks and diagrams
        html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[i] || '');
        html = html.replace(/%%DIAGRAM_(\d+)%%/g, (_, i) => diagrams[i] || '');

        return `<div class="ai-msg-inner"><p>${html}</p></div>`;
    }

    function addChatMessage(role, content, isTyping) {
        const div = document.createElement('div');
        div.className = `chat-msg ${role}`;

        if (role === 'ai') {
            if (isTyping) {
                // Typing indicator with avatar
                div.innerHTML = `
                    <div class="ai-msg-wrapper">
                        <div class="ai-avatar">🤖</div>
                        <div class="ai-msg-bubble">
                            <div class="ai-typing-indicator">
                                <div class="ai-typing-dot"></div>
                                <div class="ai-typing-dot"></div>
                                <div class="ai-typing-dot"></div>
                            </div>
                        </div>
                    </div>`;
            } else {
                div.innerHTML = `
                    <div class="ai-msg-wrapper">
                        <div class="ai-avatar">🤖</div>
                        <div class="ai-msg-bubble">${formatAIMessage(content)}</div>
                    </div>`;
            }
        } else {
            div.textContent = content;
        }

        DOM.chatMessages.appendChild(div);
        DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
        if (!isTyping) STATE.chatHistory.push({ role, content });
        return div;
    }

    // ------------- Send chat (with "try new" detection) -------------
    async function sendChatMessage() {
        const msg = DOM.chatInput.value.trim();
        if (!msg || STATE.isRunning) return;
        DOM.chatInput.value = '';
        addChatMessage('user', msg);

        const lower = msg.toLowerCase();
        const triggerWords = ['try', 'new', 'generate', 'create', 'show', 'give'];
        if (triggerWords.some(w => lower.includes(w))) {
            let topic = '';
            const words = msg.split(' ');
            let found = false;
            for (let i = 0; i < words.length; i++) {
                const w = words[i].toLowerCase();
                if (triggerWords.includes(w)) {
                    topic = words.slice(i + 1).join(' ');
                    found = true;
                    break;
                }
            }
            if (!found) {
                topic = words.filter(w => !triggerWords.includes(w.toLowerCase())).join(' ');
            }
            if (!topic.trim()) {
                topic = 'random';
            }
            await fetchProblem({ topic: topic.trim(), difficulty: 'easy' });
            addChatMessage('ai', `✅ Generated a new problem${topic.trim() !== 'random' ? ' about "' + topic.trim() + '"' : ''}. Check the problem panel.`);
            return;
        }

        DOM.chatSend.disabled = true;
        DOM.chatSend.innerHTML = '<span class="spinner"></span>';

        // Show typing indicator
        const typingDiv = addChatMessage('ai', '', true);

        try {
            const context = STATE.problem ? `Problem: ${STATE.problem.title}\nDescription: ${STATE.problem.description}` : '';
            const resp = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    context: context,
                    history: STATE.chatHistory.slice(-6),
                }),
            });
            const data = await resp.json();
            // Remove typing indicator
            if (typingDiv && typingDiv.parentNode) typingDiv.remove();
            if (data.success) {
                addChatMessage('ai', data.response);
            } else {
                addChatMessage('ai', '⚠️ Sorry, I encountered an error: ' + (data.error || 'Unknown'));
            }
        } catch (err) {
            if (typingDiv && typingDiv.parentNode) typingDiv.remove();
            addChatMessage('ai', '⚠️ Network error. Please try again.');
            console.error('Chat error:', err);
        } finally {
            DOM.chatSend.disabled = false;
            DOM.chatSend.innerHTML = '<span class="send-icon">➤</span> Send';
        }
    }

    // ------------- Run single test case (▶ Run button) -------------
    async function executeRunTestCase() {
        const code = STATE.editorInstance.getValue();
        const lang = STATE.language;

        if (!code.trim()) {
            setOutputHTML(buildInfoCard('✏️ Please write some code first.', 'info'), 'html');
            return;
        }

        // Determine what to run against
        const customInput = DOM.customStdin ? DOM.customStdin.value.trim() : '';
        const tc0 = STATE.testCases[0] || null;
        const stdin = customInput || (tc0 ? tc0.input : '');
        const expected = tc0 ? String(tc0.expected ?? '').trim() : null;
        const isTestCase = !customInput && tc0;

        setOutputHTML(buildInfoCard('⏳ Running your code...', 'info'), 'html');
        switchTab('console');

        try {
            const resp = await fetch('/api/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: lang, code, stdin }),
            });
            const data = await resp.json();

            if (data.success) {
                const stdout = (data.stdout || '').trim();
                const stderr = (data.stderr || '').trim();

                if (stderr) {
                    setOutputHTML(buildRunCard({
                        stdin, expected, actual: stderr,
                        isError: true, isTestCase,
                    }), 'html');
                } else {
                    const verdict = isTestCase && expected !== null
                        ? stdout === expected ? 'pass' : 'fail'
                        : 'custom';
                    setOutputHTML(buildRunCard({
                        stdin, expected, actual: stdout || '(no output)',
                        verdict, isTestCase,
                    }), 'html');
                }
            } else {
                setOutputHTML(buildInfoCard('❌ ' + (data.error || 'Execution failed'), 'error'), 'html');
                showToast('❌ ' + (data.error || 'Execution failed'), 'error');
            }
        } catch (err) {
            setOutputHTML(buildInfoCard('❌ Network error: ' + err.message, 'error'), 'html');
            showToast('❌ Network error: ' + err.message, 'error');
        }
    }

    // Builds the run result card HTML
    function buildRunCard({ stdin, expected, actual, verdict, isError, isTestCase }) {
        const labelMap = { pass: 'Passed ✅', fail: 'Wrong Answer ❌', custom: 'Output 📤' };
        const colorMap = { pass: 'run-pass', fail: 'run-fail', custom: 'run-custom' };
        const topLabel = isError ? 'Runtime Error ⚠️' : (labelMap[verdict] || 'Output 📤');
        const topClass = isError ? 'run-error' : (colorMap[verdict] || 'run-custom');

        const rows = [];
        if (stdin) rows.push(buildRow('📥 Input', escapeHtml(stdin), 'mono'));
        if (isTestCase && expected !== null && !isError) {
            rows.push(buildRow('✅ Expected', escapeHtml(expected), 'mono'));
        }
        rows.push(buildRow(
            isError ? '⚠️ Error' : '📤 Your Output',
            escapeHtml(actual),
            isError ? 'mono error-text' : (verdict === 'pass' ? 'mono pass-text' : verdict === 'fail' ? 'mono fail-text' : 'mono')
        ));

        return `
            <div class="run-result-card ${topClass}">
                <div class="run-result-header">
                    <span class="run-result-label">${topLabel}</span>
                    ${isTestCase ? '<span class="run-tc-badge">Test Case 1</span>' : '<span class="run-tc-badge custom">Custom Input</span>'}
                </div>
                <div class="run-result-rows">
                    ${rows.join('')}
                </div>
            </div>`;
    }

    function buildRow(label, value, cls = '') {
        return `
            <div class="run-row">
                <div class="run-row-label">${label}</div>
                <div class="run-row-value ${cls}">${value || '<em class="empty-val">empty</em>'}</div>
            </div>`;
    }

    function buildInfoCard(msg, type) {
        const cls = type === 'error' ? 'run-fail' : type === 'info' ? 'run-info' : 'run-pass';
        return `<div class="run-info-card ${cls}"><span>${msg}</span></div>`;
    }

    // ------------- "Try Again" popup (some tests failed) -------------
    function resetToPending() {
        STATE.results = STATE.testCases.map(() => ({ status: 'pending' }));
        renderTestCases();
        setOutputHTML(buildInfoCard('🔄 Results cleared — fix your code and try again!', 'info'), 'html');
    }

    function showTryAgain(passed, total) {
        const existing = document.getElementById('tryAgainModal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'tryAgainModal';

        const pct = Math.round((passed / total) * 100);
        const barColor = passed === 0 ? '#e17055' : passed < total ? '#fdcb6e' : '#00b894';

        overlay.innerHTML = `
            <div class="tryagain-card">
                <div class="tryagain-icon">😅</div>
                <h2 class="tryagain-title">Almost There!</h2>
                <div class="tryagain-score">
                    <span class="score-passed">${passed}</span>
                    <span class="score-sep">/</span>
                    <span class="score-total">${total}</span>
                    <span class="score-label">test cases passed</span>
                </div>
                <div class="tryagain-bar-wrap">
                    <div class="tryagain-bar" style="width:${pct}%;background:${barColor}"></div>
                </div>
                <p class="tryagain-hint">Check the <strong>Test Cases</strong> tab to see which ones failed, then fix your code and try again.</p>
                <div class="tryagain-actions">
                    <button class="celeb-btn celeb-btn-primary" id="tryAgainFix">
                        🛠 Fix My Code
                    </button>
                    <button class="celeb-btn celeb-btn-ghost" id="tryAgainHint">
                        💡 Get a Hint
                    </button>
                </div>
            </div>`;

        document.body.appendChild(overlay);

        function dismiss(callback) {
            overlay.classList.add('celeb-fade-out');
            setTimeout(() => {
                overlay.remove();
                resetToPending();
                if (callback) callback();
            }, 350);
        }

        document.getElementById('tryAgainFix').addEventListener('click', () => {
            dismiss(() => {
                switchTab('tests');
                if (STATE.editorInstance) STATE.editorInstance.focus();
            });
        });

        document.getElementById('tryAgainHint').addEventListener('click', () => {
            dismiss(() => {
                DOM.chatInput.value = 'My solution failed some test cases. Can you give me a hint?';
                sendChatMessage();
            });
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) dismiss();
        });
    }

    function setOutput(text, type = 'stdout') {
        DOM.outputContent.innerHTML = '';
        DOM.outputContent.textContent = text;
        DOM.outputContent.className = 'output-content ' + type;
        switchTab('console');
    }

    function setOutputHTML(html, type = 'html') {
        DOM.outputContent.innerHTML = html;
        DOM.outputContent.className = 'output-content output-rich';
        switchTab('console');
    }

    function switchTab(tabId) {
        STATE.currentOutputTab = tabId;
        DOM.outputTabs.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        const consoleContent = DOM.outputContent;
        const testContent = DOM.testCasesContainer;
        if (tabId === 'console') {
            consoleContent.style.display = 'block';
            testContent.style.display = 'none';
        } else {
            consoleContent.style.display = 'none';
            testContent.style.display = 'block';
        }
    }

    // ------------- Monaco editor -------------
    function initMonaco() {
        if (typeof monaco === 'undefined') {
            setTimeout(initMonaco, 500);
            return;
        }

        const theme = getTheme();
        const editor = monaco.editor.create(document.getElementById('editor'), {
            value: getStarterCode(STATE.language),
            language: STATE.language === 'cpp' ? 'cpp' : STATE.language,
            theme: theme === 'dark' ? 'vs-dark' : 'vs',
            automaticLayout: true,
            fontSize: 13,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            fontLigatures: true,
            minimap: { enabled: false },
            scrollbar: { vertical: 'visible', horizontal: 'visible', verticalScrollbarSize: 8 },
            padding: { top: 12, bottom: 12 },
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            tabSize: 4,
            insertSpaces: true,
            bracketPairColorization: { enabled: true },
            guides: { bracketPairs: true },
            suggest: { showKeywords: true },
            wordWrap: 'on',
        });

        STATE.editorInstance = editor;
        window.__compilerEditorInstance = editor; // expose for panel resize

        const resizeObserver = new ResizeObserver(() => editor.layout());
        resizeObserver.observe(document.getElementById('editor'));

        DOM.langSelect.addEventListener('change', function () {
            const newLang = this.value;
            STATE.language = newLang;
            const model = editor.getModel();
            if (model) {
                const newLangId = newLang === 'cpp' ? 'cpp' : newLang;
                monaco.editor.setModelLanguage(model, newLangId);
            }
            editor.setValue(getStarterCode(newLang));
            // Update editor badge
            const badge = document.getElementById('editorLangBadge');
            if (badge) {
                const labels = { python: 'Python', java: 'Java', c: 'C', cpp: 'C++' };
                badge.textContent = labels[newLang] || newLang;
            }
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function () {
            DOM.runBtn.click();
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter, function () {
            DOM.submitBtn.click();
        });

        editor.focus();
    }

    function getStarterCode(lang) {
        const templates = {
            python: '# Write your solution here\n\ndef solve():\n    pass\n\nif __name__ == "__main__":\n    solve()\n',
            java: 'public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}\n',
            c: '#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
            cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}\n',
        };
        return templates[lang] || templates.python;
    }

    // ------------- Run all test cases for Submit -------------
    async function runAllTestCases() {
        const code = STATE.editorInstance.getValue();
        const lang = STATE.language;
        const results = [];

        for (let i = 0; i < STATE.testCases.length; i++) {
            const tc = STATE.testCases[i];
            try {
                const resp = await fetch('/api/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        language: lang,
                        code: code,
                        stdin: tc.input || '',
                    }),
                });
                const data = await resp.json();
                const actual = (data.stdout || '').trim();
                const expected = String(tc.expected ?? '').trim();
                const passed = actual === expected;
                results.push({
                    input: tc.input,
                    expected: tc.expected,
                    actual: actual,
                    passed: passed,
                });
                STATE.results[i] = {
                    status: passed ? 'passed' : 'failed',
                    actual: actual,
                    expected: tc.expected,
                    input: tc.input,
                };
                renderTestCases();
            } catch (err) {
                results.push({
                    input: tc.input,
                    expected: tc.expected,
                    actual: 'Error: ' + err.message,
                    passed: false,
                });
                STATE.results[i] = {
                    status: 'failed',
                    actual: 'Error: ' + err.message,
                    expected: tc.expected,
                    input: tc.input,
                };
                renderTestCases();
            }
        }

        return results;
    }

    // ------------- Celebration Modal (all tests passed) -------------
    function showCelebration(passed, total, problemTitle) {
        // Remove any existing
        const existing = document.getElementById('celebrationModal');
        if (existing) existing.remove();

        // Confetti canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'confettiCanvas';
        canvas.style.cssText = `
            position:fixed; top:0; left:0; width:100vw; height:100vh;
            pointer-events:none; z-index:10000;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        const COLORS = ['#6c5ce7','#a29bfe','#00b894','#fdcb6e','#e17055','#fd79a8','#74b9ff','#55efc4'];
        const pieces = Array.from({ length: 160 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            w: 8 + Math.random() * 10,
            h: 4 + Math.random() * 6,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            rot: Math.random() * Math.PI * 2,
            vx: (Math.random() - 0.5) * 3,
            vy: 3 + Math.random() * 4,
            vr: (Math.random() - 0.5) * 0.15,
            opacity: 1,
        }));

        let raf;
        let elapsed = 0;
        function drawConfetti(ts) {
            if (!elapsed) elapsed = ts;
            const dt = ts - elapsed;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.x  += p.vx;
                p.y  += p.vy;
                p.rot += p.vr;
                if (dt > 2800) p.opacity = Math.max(0, p.opacity - 0.018);
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            if (dt < 4200) {
                raf = requestAnimationFrame(drawConfetti);
            } else {
                canvas.remove();
            }
        }
        raf = requestAnimationFrame(drawConfetti);

        // Modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'celebrationModal';
        overlay.innerHTML = `
            <div class="celeb-card">
                <div class="celeb-trophy">🏆</div>
                <h2 class="celeb-title">You Nailed It!</h2>
                <p class="celeb-subtitle">
                    <strong>${passed}/${total}</strong> test cases passed
                </p>
                <p class="celeb-problem">${escapeHtml(problemTitle)}</p>
                <div class="celeb-stars">⭐⭐⭐</div>
                <div class="celeb-actions">
                    <button class="celeb-btn celeb-btn-primary" id="celebNext">
                        🔄 Next Problem
                    </button>
                    <button class="celeb-btn celeb-btn-ghost" id="celebClose">
                        ✖ Close
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Wire buttons
        document.getElementById('celebNext').addEventListener('click', () => {
            overlay.remove();
            if (raf) cancelAnimationFrame(raf);
            canvas.remove();
            resetForNewProblem();
        });
        document.getElementById('celebClose').addEventListener('click', () => {
            overlay.classList.add('celeb-fade-out');
            setTimeout(() => overlay.remove(), 350);
            if (raf) cancelAnimationFrame(raf);
            setTimeout(() => canvas.remove(), 350);
        });
        // Close on backdrop click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) document.getElementById('celebClose').click();
        });

        // AI teacher congratulation message
        const praises = [
            `🎉 Incredible work! You solved **${problemTitle}** with a perfect score!`,
            `🚀 All ${total} test cases passed! Your solution is flawless. Keep it up!`,
            `🏆 Perfect submission! You've mastered **${problemTitle}**. Ready for the next challenge?`,
            `⭐ Outstanding! Every test case passed. You're getting better every day!`,
        ];
        const praise = praises[Math.floor(Math.random() * praises.length)];
        addChatMessage('ai', praise);
    }

    // ------------- Event binding -------------
    function bindEvents() {
        DOM.runBtn.addEventListener('click', function () {
            if (STATE.isRunning) return;
            STATE.isRunning = true;
            DOM.runBtn.disabled = true;
            DOM.runBtn.innerHTML = '<span class="spinner"></span> Running';
            executeRunTestCase().finally(() => {
                STATE.isRunning = false;
                DOM.runBtn.disabled = false;
                DOM.runBtn.innerHTML = '▶ Run';
            });
        });

        DOM.submitBtn.addEventListener('click', function () {
            if (STATE.isSubmitting) return;
            if (!STATE.testCases.length) {
                setOutput('// No test cases to run. Please refresh the problem.', 'info');
                return;
            }
            STATE.isSubmitting = true;
            DOM.submitBtn.disabled = true;
            DOM.submitBtn.innerHTML = '<span class="spinner"></span> Submitting';
            runAllTestCases().then((results) => {
                const passed = results.filter(r => r.passed).length;
                const total  = results.length;
                if (passed === total && total > 0) {
                    showCelebration(passed, total, STATE.problem?.title || 'the problem');
                } else {
                    showTryAgain(passed, total);
                }
            }).finally(() => {
                STATE.isSubmitting = false;
                DOM.submitBtn.disabled = false;
                DOM.submitBtn.textContent = '✓ Submit';
                switchTab('tests');
            });
        });

        DOM.newProblemBtn.addEventListener('click', function () {
            resetForNewProblem();
        });

        DOM.chatSend.addEventListener('click', sendChatMessage);
        DOM.chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });

        DOM.chatClear.addEventListener('click', function () {
            DOM.chatMessages.innerHTML = '';
            STATE.chatHistory = [];
            addChatMessage('ai', '🧹 Chat cleared. Ask me anything!');
        });

        // Quick action chips
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const msg = this.dataset.msg;
                if (msg) {
                    DOM.chatInput.value = msg;
                    sendChatMessage();
                }
            });
        });

        DOM.themeToggle.addEventListener('click', toggleTheme);

        DOM.outputTabs.forEach(btn => {
            btn.addEventListener('click', function () {
                switchTab(this.dataset.tab);
            });
        });

        const handle = document.querySelector('.resize-handle');
        if (handle) {
            let isDragging = false;
            let startY = 0;
            let startHeight = 0;

            handle.addEventListener('mousedown', function (e) {
                isDragging = true;
                startY = e.clientY;
                const panel = this.parentElement;
                startHeight = panel.offsetHeight;
                document.body.style.cursor = 'ns-resize';
                document.body.style.userSelect = 'none';
            });

            document.addEventListener('mousemove', function (e) {
                if (!isDragging) return;
                const panel = handle.parentElement;
                const delta = startY - e.clientY;
                const codePanel = panel.parentElement;
                const maxAllowed = codePanel.offsetHeight * 0.72;
                const newHeight = Math.min(Math.max(startHeight + delta, 80), maxAllowed);
                panel.style.height = newHeight + 'px';
                panel.style.maxHeight = newHeight + 'px';
                if (window.__STATE && window.__STATE.editorInstance) {
                    window.__STATE.editorInstance.layout();
                }
            });

            document.addEventListener('mouseup', function () {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        STATE.language = DOM.langSelect.value || 'python';
        initMonaco();
        bindEvents();
        resetForNewProblem();

        console.log('🚀 HeyMine AI Labs — Compiler ready');
    });

    window.__STATE = STATE;
})();