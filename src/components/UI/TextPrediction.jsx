import React, { useState, useEffect, useRef } from 'react';
import OpenAI from 'openai';
import '../../assets/css/textpred.css';
import SpeechToTextButton from './SpeechToTextButton';

const GhostTextCompletion = ({ label, name, value, handleChange, noEdit, className, max }) => {
  const [input, setInput] = useState(value || '');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.REACT_APP_DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true
  });

  console.log(value, 'input', input)

  useEffect(() => {
    const fetchCompletion = async () => {
      if (input.length < 3) {
        setSuggestion('');
        return;
      }

      setIsLoading(true);
      try {
        const completion = await openai.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "Predict the most likely continuation of this text. Assume correspondence in an organization. Return only the text that would come next, without repeating the input:"
            },
            { role: "user", content: input }
          ],
          model: "deepseek-chat",
          max_tokens: 15,
          temperature: 0.7
        });

        setSuggestion(completion.choices[0].message.content.trim());
      } catch (error) {
        console.error("Completion error:", error);
        setSuggestion('');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchCompletion, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const handleKeyDown = (e) => {
    // Accept suggestion on Tab or Right Arrow
    if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion) {
      e.preventDefault();
      acceptSuggestion();
    }
  };

  const acceptSuggestion = () => {
    setInput(prev => prev + '' + suggestion);
    setSuggestion('');
    handleChange({ target: { name, value: input + '' + suggestion } });
  };

  const handleTranscript = (transcript) => {
    setInput(prev => prev + '' + transcript);
    handleChange({ target: { name, value: input + '' + transcript } });
  };

  return (
    <div className="ghost-container">
      <div className="m-b-10 w-100 m-t-20 m-r-10">
        <div className="flex">
          <div className={`label-box ellipses-over `}>{label}</div>
          <div className="rel" style={{ height: "auto", border: "1px solid #17621A", width: "100%" }}>
            <div className="textarea-wrapper">
              {suggestion && (
                <div className="ghost-suggestion">
                  Suggestion:
                  <span className="suggestion"> {suggestion}</span>
                </div>
              )}
              <textarea
                disabled={noEdit}
                maxLength={max}
                autoComplete="off"
                name={name}
                rows={4}
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  handleChange(e);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Start typing..."
                className="ghost-textarea"
              />

            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
        </div>
      )}


      <SpeechToTextButton onTranscript={handleTranscript} />
    </div>
  );
};

export default GhostTextCompletion;