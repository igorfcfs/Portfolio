import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useIntl } from 'gatsby-plugin-intl';

const ENDPOINT =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3001'
    : '/api/chat';

const SUGGESTIONS_BY_LOCALE = {
  pt: ['Quem é o Igor?', 'Quais são suas habilidades?', 'Ele se encaixa em vagas de backend?', 'Fale sobre sua experiência'],
  en: ['Who is Igor?', 'What are his skills?', 'Would he fit a backend role?', 'Tell me about his experience'],
  es: ['¿Quién es Igor?', '¿Cuáles son sus habilidades?', '¿Se adapta a roles de backend?', 'Cuéntame su experiencia'],
  zh: ['Igor是谁？', '他有哪些技能？', '他适合后端职位吗？', '介绍他的工作经历'],
};

const PLACEHOLDER_BY_LOCALE = {
  pt: 'Pergunte sobre o Igor...',
  en: 'Ask about Igor...',
  es: 'Pregunta sobre Igor...',
  zh: '询问关于Igor的问题...',
};

const WELCOME_BY_LOCALE = {
  pt: "Olá! Sou o assistente de IA do Igor. Pergunte qualquer coisa sobre sua trajetória, habilidades ou se ele seria um ótimo fit para o seu time 🚀",
  en: "Hi! I'm Igor's AI assistant. Ask me anything about his background, skills, or whether he'd be a great fit for your team 🚀",
  es: "¡Hola! Soy el asistente de IA de Igor. Pregúntame cualquier cosa sobre su trayectoria, habilidades o si sería un gran aporte para tu equipo 🚀",
  zh: "你好！我是Igor的AI助手。您可以问我任何关于他的背景、技能，或者他是否适合您的团队 🚀",
};

const LABEL_BY_LOCALE = {
  pt: { title: '👋 Fale com a IA', subtitle: 'Pergunte sobre o Igor' },
  en: { title: '👋 Chat with AI', subtitle: 'Ask me about Igor' },
  es: { title: '👋 Habla con la IA', subtitle: 'Pregúntame sobre Igor' },
  zh: { title: '👋 与 AI 对话', subtitle: '问我关于 Igor' },
};

// ---------------------------------------------------------------------------
// Animations
// ---------------------------------------------------------------------------
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const pulse = keyframes`
  0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
  40%           { transform: scale(1); opacity: 1; }
`;

const ring = keyframes`
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
`;

const shimmer = keyframes`
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
`;

const labelSlide = keyframes`
  from { opacity: 0; transform: translateX(8px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ---------------------------------------------------------------------------
// Styled components
// ---------------------------------------------------------------------------
const Wrapper = styled.div`
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;

  @media (max-width: 480px) {
    bottom: 16px;
    right: 16px;
  }
`;

const ToggleBtnWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BtnLabel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 9px 15px;
  border-radius: 14px;
  background: var(--light-navy);
  border: 1px solid var(--accent);
  box-shadow: 0 6px 24px var(--navy-shadow), 0 0 0 4px var(--accent-tint);
  white-space: nowrap;
  animation: ${labelSlide} 0.4s var(--easing), ${float} 3s ease-in-out infinite;
  cursor: pointer;

  /* little arrow pointing to the button */
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    right: -6px;
    width: 12px;
    height: 12px;
    transform: translateY(-50%) rotate(45deg);
    background: var(--light-navy);
    border-right: 1px solid var(--accent);
    border-top: 1px solid var(--accent);
  }

  .label-title {
    background: linear-gradient(135deg, var(--accent), #f57dff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .label-subtitle {
    color: var(--slate);
    font-size: 11px;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const PingRing = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), #f57dff);
  opacity: 0;
  animation: ${ring} 2s ease-out infinite;
  pointer-events: none;
`;

const PingRing2 = styled(PingRing)`
  animation-delay: 0.7s;
`;

const ToggleBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--accent) 0%, #57cbff 40%, #f57dff 100%);
  background-size: 200% 200%;
  color: var(--navy);
  cursor: pointer;
  box-shadow:
    0 0 0 3px var(--accent-tint-20),
    0 8px 32px var(--accent-tint-50),
    0 0 60px var(--accent-tint-20);
  transition: var(--transition);
  flex-shrink: 0;
  animation: ${shimmer} 4s ease infinite, ${float} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.12);
    box-shadow:
      0 0 0 4px var(--accent-tint-40),
      0 12px 40px var(--accent-tint-50),
      0 0 80px var(--accent-tint-30);
    animation: ${shimmer} 1.5s ease infinite;
  }

  svg {
    width: 26px;
    height: 26px;
    filter: drop-shadow(0 0 6px rgba(0,0,0,0.3));
    transition: transform 0.3s var(--easing);
    position: relative;
    z-index: 1;
  }
`;

const Panel = styled.div`
  width: 360px;
  /* Never exceed the viewport: subtract the toggle button (62px),
     the gap (12px), the wrapper's bottom offset (32px) and a top
     safety margin (~24px) so the panel can't overflow the top edge. */
  height: 560px;
  max-height: calc(100vh - 130px);
  display: flex;
  flex-direction: column;
  background: var(--light-navy);
  border: 1px solid var(--lightest-navy);
  border-radius: 16px;
  box-shadow: 0 30px 60px -20px var(--navy-shadow);
  overflow: hidden;
  animation: ${fadeIn} 0.25s var(--easing);

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    height: auto;
    max-height: calc(100vh - 96px);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  background: var(--navy);
  border-bottom: 1px solid var(--lightest-navy);
  flex-shrink: 0;

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 700;
    color: var(--navy);
    flex-shrink: 0;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .name {
    font-size: var(--fz-sm);
    font-weight: 600;
    color: var(--lightest-slate);
    line-height: 1.2;
  }

  .status {
    font-size: var(--fz-xxs);
    color: var(--accent);
    font-family: var(--font-mono);
  }

  .close-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--slate);
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
      color: var(--lightest-slate);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--lightest-navy);
    border-radius: 4px;
  }
`;

const Bubble = styled.div`
  max-width: 82%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: var(--fz-sm);
  line-height: 1.55;
  word-break: break-word;

  p {
    margin: 0 0 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    font-weight: 600;
    color: ${({ role }) => (role === 'user' ? 'inherit' : 'var(--white)')};
  }

  a {
    color: ${({ role }) => (role === 'user' ? 'var(--navy)' : 'var(--accent)')};
    text-decoration: underline;
  }

  ul {
    margin: 4px 0 8px;
    padding-left: 4px;
    list-style: none;

    &:last-child {
      margin-bottom: 0;
    }
  }

  li {
    position: relative;
    padding-left: 16px;
    margin-bottom: 5px;

    &:before {
      content: '▹';
      position: absolute;
      left: 0;
      color: ${({ role }) => (role === 'user' ? 'var(--navy)' : 'var(--accent)')};
    }
  }

  ${({ role }) =>
    role === 'user'
      ? css`
          align-self: flex-end;
          background: var(--accent);
          color: var(--navy);
          border-bottom-right-radius: 4px;
        `
      : css`
          align-self: flex-start;
          background: var(--navy);
          color: var(--lightest-slate);
          border: 1px solid var(--lightest-navy);
          border-bottom-left-radius: 4px;
        `}
`;

const TypingIndicator = styled.div`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: var(--navy);
  border: 1px solid var(--lightest-navy);
  border-radius: 14px;
  border-bottom-left-radius: 4px;

  span {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: ${pulse} 1.2s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.3s; }
  }
`;

const SuggestionsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 12px;
  flex-shrink: 0;
`;

const SuggestionChip = styled.button`
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid var(--accent);
  background: transparent;
  color: var(--accent);
  font-size: var(--fz-xxs);
  font-family: var(--font-mono);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;

  &:hover {
    background: var(--accent-tint);
  }
`;

const InputRow = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--lightest-navy);
  background: var(--navy);
  flex-shrink: 0;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 9px 14px;
  border-radius: 18px;
  border: 1px solid var(--lightest-navy);
  background: var(--light-navy);
  color: var(--lightest-slate);
  font-size: var(--fz-sm);
  font-family: var(--font-sans);
  line-height: 1.45;
  outline: none;
  transition: border-color 0.2s;
  min-width: 0;
  resize: none;
  /* Grows with content up to 3 lines, then scrolls vertically.
     Height and overflow are driven by JS auto-resize; overflow stays
     hidden until the content actually exceeds max-height so the
     scrollbar never shows on an empty/short field. */
  max-height: 79px;
  overflow-y: hidden;
  white-space: pre-wrap;
  word-break: break-word;

  &:focus {
    border-color: var(--accent);
  }

  &::placeholder {
    color: var(--slate);
  }

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--lightest-navy);
    border-radius: 4px;
  }
`;

const SendBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: var(--navy);
  cursor: pointer;
  flex-shrink: 0;
  transition: var(--transition);
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    transform: scale(1.08);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ---------------------------------------------------------------------------
// Icons (inline SVG — no extra dependency)
// ---------------------------------------------------------------------------
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
    <circle cx="8" cy="10" r="1.4" fill="var(--navy)" />
    <circle cx="12" cy="10" r="1.4" fill="var(--navy)" />
    <circle cx="16" cy="10" r="1.4" fill="var(--navy)" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Lightweight Markdown renderer (no dependency)
// Handles: **bold**, [links](url), `-`/`*` bullet lists, and paragraphs.
// ---------------------------------------------------------------------------
const renderInline = text => {
  // Split on **bold** and [text](url), keeping the delimiters
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">
          {link[1]}
        </a>
      );
    }
    return part;
  });
};

const MarkdownContent = ({ text }) => {
  // Split into blocks by blank lines; group consecutive bullet lines into <ul>
  const lines = text.split('\n');
  const blocks = [];
  let list = null;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push({ type: 'p', content: para.join(' ') });
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push({ type: 'ul', items: list });
      list = null;
    }
  };

  lines.forEach(raw => {
    const line = raw.trim();
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      flushPara();
      if (!list) list = [];
      list.push(bullet[1]);
    } else if (line === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  });
  flushPara();
  flushList();

  return (
    <>
      {blocks.map((b, i) =>
        b.type === 'ul' ? (
          <ul key={i}>
            {b.items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{renderInline(b.content)}</p>
        ),
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const ChatBot = () => {
  const intl = useIntl();
  const locale = intl.locale || 'en';
  const suggestions = SUGGESTIONS_BY_LOCALE[locale] || SUGGESTIONS_BY_LOCALE.en;
  const placeholder = PLACEHOLDER_BY_LOCALE[locale] || PLACEHOLDER_BY_LOCALE.en;
  const welcomeContent = WELCOME_BY_LOCALE[locale] || WELCOME_BY_LOCALE.en;
  const label = LABEL_BY_LOCALE[locale] || LABEL_BY_LOCALE.en;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'assistant', content: welcomeContent }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [streamingIdx, setStreamingIdx] = useState(-1);
  const [streamedText, setStreamedText] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const newMsgRef = useRef(null);
  const streamTimer = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll behavior: while the user is sending / awaiting a reply, keep the
  // bottom (their message + typing dots) in view. When an assistant reply
  // arrives, align the TOP of that new message instead of jumping to the
  // bottom, so the user reads it from the start. Keyed on messages.length +
  // loading only, so the typewriter reveal (streamedText) doesn't re-scroll.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (loading || (last && last.role === 'user')) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (last && last.role === 'assistant') {
      newMsgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages.length, loading]);

  // Reveal an assistant reply word-by-word at a readable pace.
  const streamReply = (fullText, index) => {
    if (streamTimer.current) clearTimeout(streamTimer.current);
    const tokens = fullText.split(/(\s+)/); // words + whitespace, order preserved
    let i = 0;
    setStreamingIdx(index);
    setStreamedText('');
    const step = () => {
      i += 2; // one word + its trailing space per tick
      setStreamedText(tokens.slice(0, i).join(''));
      if (i < tokens.length) {
        streamTimer.current = setTimeout(step, 35);
      } else {
        setStreamingIdx(-1);
        setStreamedText('');
      }
    };
    streamTimer.current = setTimeout(step, 35);
  };

  useEffect(() => () => {
    if (streamTimer.current) clearTimeout(streamTimer.current);
  }, []);

  // Auto-grow the textarea with its content (capped by CSS max-height).
  // Only enable the scrollbar once content actually overflows the cap.
  // 3 lines (line-height 1.45 * 14px ≈ 20.3px) + vertical padding (18px) ≈ 79px.
  const MAX_INPUT_HEIGHT = 79;
  const autoResize = el => {
    if (!el) return;
    el.style.height = 'auto';
    const next = el.scrollHeight;
    el.style.height = `${Math.min(next, MAX_INPUT_HEIGHT)}px`;
    el.style.overflowY = next > MAX_INPUT_HEIGHT ? 'auto' : 'hidden';
  };

  useEffect(() => {
    autoResize(inputRef.current);
  }, [input]);

  const handleKeyDown = e => {
    // Enter sends; Shift+Enter inserts a newline.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const send = async text => {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);

    const userMsg = { role: 'user', content: text.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, locale: intl.locale }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || 'Sorry, something went wrong.';
      // Assistant message index = current length of `updated` (which already
      // includes the user message), since the welcome message occupies index 0.
      const assistantIdx = updated.length;
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      streamReply(reply, assistantIdx);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    send(input);
  };

  return (
    <Wrapper>
      {open && (
        <Panel>
          <PanelHeader>
            <div className="avatar">IF</div>
            <div className="info">
              <div className="name">Igor's AI Assistant</div>
              <div className="status">● Online</div>
            </div>
            <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <CloseIcon />
            </button>
          </PanelHeader>

          <MessageList>
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1;
              const content = i === streamingIdx ? streamedText : m.content;
              return (
                <Bubble
                  key={i}
                  role={m.role}
                  ref={isLast && m.role === 'assistant' ? newMsgRef : null}>
                  {m.role === 'assistant' ? <MarkdownContent text={content} /> : m.content}
                </Bubble>
              );
            })}
            {loading && (
              <TypingIndicator>
                <span /><span /><span />
              </TypingIndicator>
            )}
            <div ref={bottomRef} />
          </MessageList>

          {showSuggestions && (
            <SuggestionsRow>
              {suggestions.map(s => (
                <SuggestionChip key={s} type="button" onClick={() => send(s)}>
                  {s}
                </SuggestionChip>
              ))}
            </SuggestionsRow>
          )}

          <InputRow onSubmit={handleSubmit}>
            <Input
              ref={inputRef}
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading}
              aria-label="Chat message"
            />
            <SendBtn type="submit" disabled={!input.trim() || loading} aria-label="Send message">
              <SendIcon />
            </SendBtn>
          </InputRow>
        </Panel>
      )}

      <ToggleBtnWrapper>
        {!open && (
          <BtnLabel onClick={() => setOpen(true)}>
            <span className="label-title">{label.title}</span>
            <span className="label-subtitle">{label.subtitle}</span>
          </BtnLabel>
        )}
        <ToggleBtn onClick={() => setOpen(o => !o)} aria-label={open ? 'Close chat' : 'Open chat'}>
          {!open && <><PingRing /><PingRing2 /></>}
          {open ? <CloseIcon /> : <ChatIcon />}
        </ToggleBtn>
      </ToggleBtnWrapper>
    </Wrapper>
  );
};

export default ChatBot;
