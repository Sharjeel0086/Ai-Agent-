import { useState, useRef, useCallback } from "react";

interface UseVoiceOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: Error) => void;
}

export function useVoice(options: UseVoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const startListening = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      options.onError?.(new Error("Speech recognition not supported"));
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition() as any;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      options.onError?.(new Error(`Speech recognition error: ${event.error}`));
      setIsListening(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      options.onTranscript?.(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [options]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, []);

  const speak = useCallback((text: string, lang = "en-US") => {
    if (!("speechSynthesis" in window)) {
      options.onError?.(new Error("Speech synthesis not supported"));
      return;
    }

    const synthesis = window.speechSynthesis;
    synthesis.cancel(); // Cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      options.onError?.(new Error(`Speech synthesis error: ${event.error}`));
      setIsSpeaking(false);
    };

    synthesisRef.current = synthesis;
    synthesis.speak(utterance);
  }, [options]);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported: "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
  };
}

