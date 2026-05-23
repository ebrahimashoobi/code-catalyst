const appState = {
  premiumUntil: localStorage.getItem('dlm_premiumUntil') || null,
  premiumPrice: 46.32,
  premiumDurationDays: 30,
  aiMinutesUsed: Number(localStorage.getItem('dlm_aiMinutes') || 0),
  aiLimitMinutes: 120,
  blockedUntil: localStorage.getItem('dlm_blockedUntil') || null,
  investmentBonusUsed: localStorage.getItem('dlm_bonusUsed') === 'true',
  secretCode: 'fortune',
  bonusAmount: 50,
};

const elements = {
  planStatus: document.getElementById('planStatus'),
  panel: document.getElementById('panelContent'),
  panelTitle: document.getElementById('panelTitle'),
  panelBody: document.getElementById('panelBody'),
  openWorkout: document.getElementById('openWorkout'),
  openInvest: document.getElementById('openInvest'),
  openStudy: document.getElementById('openStudy'),
  openChat: document.getElementById('openChat'),
  closePanel: document.getElementById('closePanel'),
  upgradeButton: document.getElementById('upgradeButton'),
};

const premiumActive = () => {
  if (!appState.premiumUntil) return false;
  const until = new Date(appState.premiumUntil);
  return until > new Date();
};

const updateLocalStorage = () => {
  localStorage.setItem('dlm_aiMinutes', String(appState.aiMinutesUsed));
  if (appState.premiumUntil) localStorage.setItem('dlm_premiumUntil', appState.premiumUntil);
  if (appState.blockedUntil) localStorage.setItem('dlm_blockedUntil', appState.blockedUntil);
  localStorage.setItem('dlm_bonusUsed', appState.investmentBonusUsed ? 'true' : 'false');
};

const getPlanLabel = () => {
  return premiumActive() ? `Premium mode ($${appState.premiumPrice.toFixed(2)})` : 'Free mode';
};

const showPanel = (title, bodyHtml) => {
  elements.panelTitle.textContent = title;
  elements.panelBody.innerHTML = bodyHtml;
  elements.panel.classList.add('active');
  elements.planStatus.textContent = getPlanLabel();
};

const closePanel = () => {
  elements.panel.classList.remove('active');
};

elements.closePanel.addEventListener('click', closePanel);

elements.openWorkout.addEventListener('click', () => {
  showPanel('Personal Workout Coach', `
    <div class="section-group">
      <h3>Today's workout</h3>
      <p>Follow this session for strength and health.</p>
      <ol>
        <li>Warm-up: 5 minutes of light cardio.</li>
        <li>Strength: Squats, push-ups, planks (3 sets each).</li>
        <li>Cool-down: Stretching for 5 minutes.</li>
      </ol>
      <p>Explanation: This builds muscle and improves fitness safely.</p>
      <a href="https://www.youtube.com/results?search_query=beginner+home+workout+routine" target="_blank" class="link-button">Watch workout video →</a>
    </div>
  `);
});

elements.openInvest.addEventListener('click', () => {
  const canRedeem = !appState.investmentBonusUsed;
  showPanel('Investing & Money Saving', `
    <div class="section-group">
      <h3>How to invest</h3>
      <p>Start small, learn basics, and grow wealth over time.</p>
      <ul>
        <li>Understand compound interest: Money earns money.</li>
        <li>Diversify: Don't put all in one place.</li>
        <li>Start with index funds for beginners.</li>
        <li>Note: Always research and consult professionals.</li>
      </ul>
      <p class="small-note">Secure saving with built-in credit card protection from hackers.</p>
      <a href="https://www.youtube.com/results?search_query=beginner+investing+explained" target="_blank" class="link-button">Watch investing explanation video →</a>
      ${canRedeem ? '<button id="redeemBonus">Redeem first investment bonus</button><div id="bonusForm" class="hidden"><label for="bonusCode">Enter code</label><input id="bonusCode" placeholder="Secret code" /><button id="applyBonus">Apply</button><p id="bonusMessage"></p></div>' : '<p>Bonus already redeemed.</p>'}
    </div>
  `);

  if (canRedeem) {
    setTimeout(() => {
      document.getElementById('redeemBonus').addEventListener('click', () => {
        document.getElementById('bonusForm').classList.remove('hidden');
      });
      document.getElementById('applyBonus').addEventListener('click', handleBonusRedeem);
    }, 0);
  }
});

elements.openStudy.addEventListener('click', () => {
  showPanel('Study Help', `
    <div class="section-group">
      <h3>Study resources</h3>
      <p>Access great apps for students.</p>
      <a href="https://www.khanacademy.org/" target="_blank" class="link-button">Khan Academy →</a>
      <a href="https://www.duolingo.com/" target="_blank" class="link-button">Duolingo for languages →</a>
    </div>
  `);
});

elements.openChat.addEventListener('click', () => {
  const blockedUntil = appState.blockedUntil ? new Date(appState.blockedUntil) : null;
  const now = new Date();
  if (!premiumActive() && blockedUntil && blockedUntil > now) {
    showPanel('AI Mentor paused', `
      <div class="section-group">
        <h3>AI access limit reached</h3>
        <p>You used the free AI for ${appState.aiLimitMinutes / 60} hours. Wait until ${new Date(blockedUntil).toLocaleString()} or upgrade.</p>
      </div>
    `);
    return;
  }

  showPanel('AI Mentor', `
    <div class="section-group">
      <h3>Ask anything</h3>
      <textarea id="chatQuestion" placeholder="Ask any question, even unrelated to the app."></textarea>
      <button id="askButton">Ask the AI</button>
      <p id="chatStatus" class="small-note">Free has limits; premium is unlimited.</p>
    </div>
    <div class="section-group">
      <h3>Answer</h3>
      <div id="chatAnswer" class="status-line">Your answer will appear here.</div>
      <div id="youtubeLink" class="hidden"><a id="ytLink" href="#" target="_blank" class="link-button">Watch related video →</a></div>
    </div>
  `);

  setTimeout(() => {
    document.getElementById('askButton').addEventListener('click', handleChatAsk);
  }, 0);
});

elements.upgradeButton.addEventListener('click', () => {
  showPanel('Upgrade to Premium', `
    <div class="section-group">
      <h3>Premium benefits</h3>
      <ul>
        <li>Unlimited AI access</li>
        <li>Advanced workout plans</li>
        <li>Secure investing tools</li>
        <li>Extra study guidance</li>
      </ul>
      <p class="small-note">Premium is $${appState.premiumPrice.toFixed(2)} for 30 days.</p>
    </div>
    <div class="section-group">
      <h3>Activate</h3>
      <button id="activatePremium">Activate premium</button>
    </div>
  `);

  setTimeout(() => {
    document.getElementById('activatePremium').addEventListener('click', () => {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + appState.premiumDurationDays);
      appState.premiumUntil = expiry.toISOString();
      updateLocalStorage();
      showPanel('Premium enabled', `
        <div class="section-group">
          <h3>Premium unlocked</h3>
          <p>Active until ${new Date(appState.premiumUntil).toLocaleString()}.</p>
        </div>
      `);
    });
  }, 0);
});

const handleChatAsk = () => {
  const question = document.getElementById('chatQuestion').value.trim();
  const answerPanel = document.getElementById('chatAnswer');
  const ytLinkDiv = document.getElementById('youtubeLink');
  const ytLink = document.getElementById('ytLink');
  if (!question) {
    answerPanel.textContent = 'Type a question first.';
    return;
  }

  if (!premiumActive()) {
    appState.aiMinutesUsed += 4;
    if (appState.aiMinutesUsed >= appState.aiLimitMinutes) {
      const blockedUntil = new Date();
      blockedUntil.setDate(blockedUntil.getDate() + 3);
      appState.blockedUntil = blockedUntil.toISOString();
    }
    updateLocalStorage();
  }

  if (!premiumActive() && appState.aiMinutesUsed >= appState.aiLimitMinutes) {
    answerPanel.textContent = 'Free AI time ended. Upgrade or wait.';
    return;
  }

  answerPanel.textContent = 'Thinking...';

  fetch('http://127.0.0.1:3000/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  })
    .then((res) => res.json())
    .then((data) => {
      answerPanel.textContent = data.answer || 'No answer.';
      ytLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(question)}`;
      ytLinkDiv.classList.remove('hidden');
    })
    .catch((error) => {
      console.error('Error:', error);
      answerPanel.textContent = 'Connection error.';
    });
};

const handleBonusRedeem = () => {
  const input = document.getElementById('bonusCode');
  const message = document.getElementById('bonusMessage');
  const code = input.value.trim();
  if (!code) {
    message.textContent = 'Enter the secret code.';
    return;
  }
  if (appState.investmentBonusUsed) {
    message.textContent = 'Bonus already redeemed.';
    return;
  }
  if (code.toLowerCase() === appState.secretCode) {
    appState.investmentBonusUsed = true;
    updateLocalStorage();
    message.textContent = `Success! $${appState.bonusAmount} bonus unlocked for your first investment.`;
  } else {
    message.textContent = 'Code not recognized.';
  }
};

const initialize = () => {
  const blockedUntil = appState.blockedUntil ? new Date(appState.blockedUntil) : null;
  if (blockedUntil && blockedUntil < new Date()) {
    appState.blockedUntil = null;
    updateLocalStorage();
  }
  elements.planStatus.textContent = getPlanLabel();
};

initialize();
