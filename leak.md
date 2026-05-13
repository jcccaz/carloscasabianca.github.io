# INTERNAL LEAK TERMINAL

Recovered fragments from closed work, failed attempts, and flagged subjects.

---

## CLOSED PROJECT

### TRIAPP / TRIAI

**status:** closed — archived

**summary:**  
Tried to wrap ChatGPT, Claude, and Gemini into one "super app" that would pick the best answer.  
Built a Council Mode where models debated each other.  
Built Hard Mode where the enforcer rejected soft answers.  
Built the Gold Noir aesthetic that everything still runs on.

**failure mode:**  
It was too slow and too chaotic.  
The models argued well but nothing was governed.  
Good outputs and bad outputs looked the same coming out.

**resolution:**  
Didn't kill it — evolved it.  
Everything that worked became KorumOS.  
The Council is still running. Now it has rules.

---

## FAILED ATTEMPT

### Consensus as Truth

**objective:**  
Get three AIs to agree on an answer so I know it's correct.

**finding:**  
They usually agreed on the same hallucination.  
Consensus made the output more confident, not more accurate.  
Groupthink applies to bots too.

**what replaced it:**  
Adversarial pressure instead of agreement.  
One model builds. One attacks. A Governor decides.  
The output that survives that process is the one that ships.

---

## FLAGGED SUBJECT

### The Provenance Problem

**status:** solved — Decision Ledger shipped

**original question:**  
If three different AI models contribute to a decision, who actually made it?  
Can you prove what happened after the fact?  
Can you prove it wasn't tampered with?

**answer at the time:**  
No idea. That's going to be a problem.

**answer now:**  
Hash-chained audit trail. Every council event recorded.  
SHA-256 per event, HMAC-signed chain.  
Every decision has a cryptographic proof certificate.  
You can verify it didn't change. You can prove who decided what.

---

## FUTURE PROJECT

### KORUM SENTINEL

**subject:**  
Pre-council injection defense

**hypothesis:**  
If someone sends a command-style query designed to anchor the council,  
the council will execute it without questioning the framing.  
The governance layer starts after the prompt — but the attack is in the prompt.

**current status:**  
Designed. Not yet built.  
Query normalization layer that detects decision verbs, warns the operator,  
and optionally rewrites to neutral framing before any model sees it.
