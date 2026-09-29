import React, { useState } from 'react';
import { Bot, X, Send, Volume2, Sparkles, MessageSquare, Mic, MicOff, ArrowRight } from 'lucide-react';
import type { LanguageCode } from '../types';
import { api } from '../api';
import { getTranslation, SUPPORTED_LANGUAGES } from '../translations';
import { GovEmblem } from './GovEmblem';

interface AIAssistantModalProps {
  language: LanguageCode;
  onLodgeComplaint?: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ language, onLodgeComplaint }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const t = getTranslation(language);

  const initialGreeting: Record<LanguageCode, string> = {
    te: 'నమస్కారం! నేను ప్రజావాణి ప్రో AI సహాయకుడిని. మీరు రోడ్లు, తాగునీరు, వీధి దీపాలు లేదా పారిశుధ్యంపై సులభంగా ఫిర్యాదు చేయడానికి నేను సహాయపడతాను. మీ సమస్యను తెలుగులో మాట్లాడవచ్చు లేదా టైప్ చేయవచ్చు.',
    hi: 'नमस्ते! मैं प्रजावाणी प्रो एआई सहायक हूँ। सड़क, पेयजल, स्ट्रीट लाइट या सफाई की समस्याओं पर शिकायत दर्ज करने में मैं आपकी पूरी मदद कर सकता हूँ। आप बोलकर या लिखकर प्रश्न पूछ सकते हैं।',
    en: 'Hello! I am your PRAJAVAANI PRO AI Civic Assistant. I can help you lodge a complaint via voice or text, understand SLA time limits, and check grievance status.',
    ta: 'வணக்கம்! நான் பிரஜாவாணி புரோ AI உதவியாளர். சாலைகள், குடிநீர், தெருവിளக்கு அல்லது சுகாதாரம் தொடர்பான புகார்களை பதிவு செய்ய உங்களுக்கு உதவ முடியும்.',
    kn: 'ನಮಸ್ಕಾರ! ನಾನು ಪ್ರಜಾವಾಣಿ ಪ್ರೊ AI ಸಹಾಯಕ. ರಸ್ತೆಗಳು, ಕುಡಿಯುವ ನೀರು, ಬೀದಿ ದೀಪಗಳು ಅಥವಾ ನೈರ್ಮಲ್ಯದ ದೂರುಗಳನ್ನು ದಾಖಲಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
    ml: 'നമസ്കാരം! ഞാൻ പ്രജാവാണി പ്രോ AI സഹായിയാണ്. റോഡുകൾ, കുടിവെള്ളം, ശുചീകരണം തുടങ്ങിയ പരാതികൾ വേഗത്തിൽ രജിസ്റ്റർ ചെയ്യാൻ ഞാൻ സഹായിക്കാം.',
    mr: 'नमस्कार! मी प्रजावाणी प्रो AI सहाय्यक आहे. रस्ते, पाणीपुरवठा, पथदिवे किंवा स्वच्छता यांसारख्या तक्रारी नोंदवण्यासाठी मी मदत करू शकतो.',
    bn: 'নমস্কার! আমি প্রজাবাণী প্রো AI সহায়ক। রাস্তা, পানীয় জল, পথবাতি বা পরিচ্ছন্নতা বিষয়ক অভিযোগ দ্রুত নথিভুক্ত করতে আমি সাহায্য করব।',
    gu: 'નમસ્તે! હું પ્રજાવાણી પ્રો AI સહાયક છું. રસ્તા, પીવાનું પાણી, સ્ટ્રીટ લાઇટ કે સફાઈ સંબંધિત ફરિયાદ નોંધાવવામાં હું તમને મદદ કરીશ.',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਪ੍ਰਜਾਵਾਣੀ ਪ੍ਰੋ AI ਸਹਾਇਕ ਹਾਂ। ਸੜਕਾਂ, ਪਾਣੀ, ਸਫ਼ਾਈ ਸੰਬੰਧੀ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਨ ਵਿੱਚ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।',
    or: 'ନମସ୍କାର! ମୁଁ ପ୍ରଜାବାଣୀ ପ୍ରୋ AI ସହାୟକ। ରାସ୍ତା, ପାଣି, ସଫେଇ ସମ୍ବନ୍ଧୀୟ ଅଭିଯୋଗ ଦାଖଲ କରିବାରେ ମୁଁ ସାହାଯ୍ୟ କରିବି।',
    as: 'নমস্কাৰ! মই প্ৰজাবাণী প্ৰো AI সহায়ক। পথ মেৰামতি, খোৱাপানী বা অন্যান্য সমস্যাৰ অভিযোগ দাখিল কৰাত মই সহায় কৰিব পাৰোঁ।',
    ur: 'السلام علیکم! میں پراجاوانی پرو AI معاون ہوں۔ سڑک، پینے کا پانی، اسٹریٹ لائٹ یا صفائی کی شکایات درج کرانے میں آپ کی مدد کر سکتا ہوں۔',
  };

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: initialGreeting[language] || initialGreeting.en,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);
      utterance.lang = langMeta?.speechLocale || 'te-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);
    recognition.lang = langMeta?.speechLocale || 'te-IN';

    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsRecording(false);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.askAssistant(q, language);
      const aiReply = {
        sender: 'ai' as const,
        text: res.reply || 'Thank you. Your civic query has been processed.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
      speakText(aiReply.text);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'AI Sahayak service is ready. You can lodge a complaint directly by clicking the button below.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts: Record<LanguageCode, string[]> = {
    te: ['రోడ్డు గుంతపై ఫిర్యాదు ఎలా చేయాలి?', 'SLA పరిష్కార గడువు సమయం ఎంత?', 'పరిష్కార ధృవీకరణ ఎలా పనిచేస్తుంది?'],
    hi: ['सड़क के गड्ढे की शिकायत कैसे दर्ज करें?', 'सरकारी SLA समय सीमा क्या है?', 'समाधान सत्यापन कैसे काम करता है?'],
    en: ['How do I report a pothole?', 'What are the official SLA time limits?', 'How does citizen resolution verification work?'],
    ta: ['சாலைப் பள்ளம் குறித்து புகார் செய்வது எப்படி?', 'SLA காலக்கெடு என்ன?', 'தீர்வு சரிபார்ப்பு எவ்வாறு செயல்படுகிறது?'],
    kn: ['ರಸ್ತೆ ಗುಂಡಿಯ ಬಗ್ಗೆ ದೂರು ದಾಖಲಿಸುವುದು ಹೇಗೆ?', 'SLA ಕಾಲಮಿತಿ ಎಷ್ಟು?', 'ಪರಿಹಾರ ದೃಢೀಕರಣ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?'],
    ml: ['റോഡ് കുഴിയെക്കുറിച്ച് എങ്ങനെ പരാതി നൽകാം?', 'SLA സമയപരിധി എത്രയാണ്?', 'പരിഹാര പരിശോധന എങ്ങനെ പ്രവർത്തിക്കുന്നു?'],
    mr: ['रस्त्यावरील खड्ड्याची तक्रार कशी करावी?', 'SLA मुदत किती आहे?', 'निवारण पडताळणी कशी काम करते?'],
    bn: ['রাস্তার গর্তের অভিযোগ কীভাবে দায়ের করব?', 'SLA সময়সীমা কত?', 'সমাধান যাচাইকরণ কীভাবে কাজ করে?'],
    gu: ['રસ્તાના ખાડાની ફરિયાદ કેવી રીતે કરવી?', 'SLA સમયમર્યાદા શું છે?', 'નિવારણ ચકાસણી કેવી રીતે કામ કરે છે?'],
    pa: ['ਸੜਕ ਦੇ ਟੋਏ ਦੀ ਸ਼ਿਕਾਇਤ ਕਿਵੇਂ ਦਰਜ ਕਰੀਏ?', 'SLA ਸਮਾਂ ਸੀਮਾ ਕੀ ਹੈ?', 'ਹੱਲ ਦੀ ਤਸਦੀਕ ਕਿਵੇਂ ਕੰਮ ਕਰਦੀ ਹੈ?'],
    or: ['ରାସ୍ତା ଖାଲ ବିଷୟରେ କିପରି ଅଭିଯୋଗ କରିବି?', 'SLA ସମୟ ସୀମା କେତେ?', 'ସମାଧାନ ଯାଞ୍ଚ କିପରି କାମ କରେ?'],
    as: ['পথৰ গাঁতৰ অভিযোগ কেনেকৈ কৰিব?', 'SLA সময়সীমা কিমান?', 'সমাধান সত্যাপন কেনেদৰে কাম কৰে?'],
    ur: ['سڑک کے گڑھے کی شکایت کیسے درج کریں؟', 'SLA کی وقت کی حد کیا ہے؟', 'حل کی تصدیق کیسے کام کرتی ہے؟'],
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #0c1f4a 0%, #2563eb 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 24px rgba(37,99,235,0.45), 0 0 0 2px rgba(245, 158, 11, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 90,
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
        >
          <Bot size={22} color="#fef08a" />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.3px' }}>
            {t.sahayakTitle}
          </span>
          <span
            style={{
              background: '#10b981',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              boxShadow: '0 0 8px #10b981',
            }}
          />
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'min(420px, calc(100vw - 32px))',
            height: 'min(620px, calc(100vh - 48px))',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(12, 31, 74, 0.35)',
            border: '2px solid #f59e0b',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0c1f4a 0%, #0f2b5c 100%)',
              color: 'white',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GovEmblem size={34} variant="ashoka" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fef08a' }}>
                  {t.sahayakTitle}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#93c5fd' }}>
                  {t.sahayakSub}
                </div>
              </div>
            </div>

            <button onClick={() => setIsOpen(false)} style={{ color: 'white', padding: '4px' }}>
              <X size={18} />
            </button>
          </div>

          {/* Quick Action Banner */}
          {onLodgeComplaint && (
            <div
              style={{
                background: '#eff6ff',
                borderBottom: '1px solid #bfdbfe',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: '0.76rem', color: '#1e40af', fontWeight: 700 }}>
                💡 {t.navCitizen}
              </span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLodgeComplaint();
                }}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{t.sahayakLodgeBtn}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          )}

          {/* Message List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#fafaf9',
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.sender === 'user' ? '#0c1f4a' : '#ffffff',
                  color: m.sender === 'user' ? '#ffffff' : '#1e293b',
                  padding: '12px 14px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  position: 'relative',
                }}
              >
                <div>{m.text}</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    fontSize: '0.68rem',
                    color: m.sender === 'user' ? '#93c5fd' : '#94a3b8',
                  }}
                >
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => speakText(m.text)}
                      title={t.sahayakReadAloud}
                      style={{ color: '#2563eb', padding: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}
                    >
                      <Volume2 size={13} />
                      <span style={{ fontSize: '0.65rem' }}>{t.sahayakReadAloud}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                }}
              >
                Thinking... ⚡
              </div>
            )}
          </div>

          {/* Quick Sample Prompts */}
          <div
            style={{
              padding: '8px 12px',
              background: '#f1f5f9',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            {(samplePrompts[language] || samplePrompts.en).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                style={{
                  whiteSpace: 'nowrap',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '14px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  color: '#1e293b',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box with Microphone Voice Button */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid var(--border-color)',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <button
              onClick={toggleVoiceInput}
              style={{
                background: isRecording ? '#dc2626' : '#eff6ff',
                color: isRecording ? '#ffffff' : '#2563eb',
                border: isRecording ? 'none' : '1px solid #bfdbfe',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={t.sahayakSpeakBtn}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.sahayakInputPlaceholder}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.88rem',
              }}
            />

            <button
              onClick={() => handleSend()}
              style={{
                background: '#0c1f4a',
                color: 'white',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
