/**
 * Production-ready Text-to-Speech utility using Web Speech Synthesis API
 * Works on iOS, Android, and Desktop browsers
 *
 * Features:
 * - iOS user gesture requirement handling
 * - Automatic voice selection
 * - Language support (en-IN, en-US, etc.)
 * - Graceful fallback for unsupported browsers
 * - Cancels existing speech before new speech
 */

// Track if TTS has been initialized (iOS requires user gesture)
let isTTSInitialized = false;
let isUserGestureRequired = false;

// Check if TTS is supported
const isTTSSupported = () => {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
};

// Initialize TTS on first user gesture (iOS requirement)
const initializeTTS = () => {
  if (!isTTSSupported()) {
    console.warn("Text-to-Speech is not supported in this browser");
    return false;
  }

  // iOS requires a user gesture to enable speechSynthesis
  // We'll test this by trying to get voices
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) {
      // On iOS, voices array is empty until user gesture
      isUserGestureRequired = true;
      return false;
    }
    isTTSInitialized = true;
    return true;
  } catch (error) {
    console.warn("TTS initialization error:", error);
    isUserGestureRequired = true;
    return false;
  }
};

// Get available voices and select the best one
const getBestVoice = (lang = "en-IN") => {
  if (!isTTSSupported()) return null;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Priority: 1) Exact language match, 2) Language family match, 3) Default
  const exactMatch = voices.find((voice) => voice.lang === lang);
  if (exactMatch) return exactMatch;

  // Try language family (e.g., en-IN -> en-US, en-GB)
  const langFamily = lang.split("-")[0];
  const familyMatch = voices.find((voice) => voice.lang.startsWith(langFamily));
  if (familyMatch) return familyMatch;

  // Fallback to first available voice
  return voices[0] || null;
};

// Wait for voices to load (especially on Chrome/Edge)
const waitForVoices = () => {
  return new Promise((resolve) => {
    if (!isTTSSupported()) {
      resolve(null);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    // Voices may load asynchronously
    const checkVoices = () => {
      const loadedVoices = window.speechSynthesis.getVoices();
      if (loadedVoices.length > 0) {
        resolve(loadedVoices);
      } else {
        // Timeout after 1 second
        setTimeout(() => resolve(loadedVoices), 1000);
      }
    };

    // Chrome/Edge load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = checkVoices;
    } else {
      checkVoices();
    }
  });
};

/**
 * Main function to speak text
 * @param {string} text - The text to speak
 * @param {Object} options - Optional configuration
 * @param {string} options.lang - Language code (default: 'en-IN')
 * @param {number} options.rate - Speech rate 0.1-10 (default: 1)
 * @param {number} options.pitch - Voice pitch 0-2 (default: 1)
 * @param {number} options.volume - Volume 0-1 (default: 1)
 * @param {Function} options.onStart - Callback when speech starts
 * @param {Function} options.onEnd - Callback when speech ends
 * @param {Function} options.onError - Callback on error
 * @returns {boolean} - Returns true if speech was initiated, false otherwise
 */
export const speakText = async (text, options = {}) => {
  // Validate input
  if (!text || typeof text !== "string" || text.trim().length === 0) {
    console.warn("speakText: Empty or invalid text provided");
    return false;
  }

  // Check browser support
  if (!isTTSSupported()) {
    console.warn("speakText: Text-to-Speech is not supported in this browser");
    if (options.onError) {
      options.onError(new Error("TTS not supported"));
    }
    return false;
  }

  // Initialize TTS if needed (iOS requirement)
  if (!isTTSInitialized) {
    const initialized = initializeTTS();
    if (!initialized && isUserGestureRequired) {
      console.warn(
        "speakText: User gesture required to enable TTS (iOS requirement)"
      );
      if (options.onError) {
        options.onError(new Error("User gesture required to enable TTS"));
      }
      return false;
    }
  }

  // Cancel any existing speech
  try {
    window.speechSynthesis.cancel();
  } catch (error) {
    console.warn("speakText: Error canceling previous speech:", error);
  }

  // Wait for voices to be available
  await waitForVoices();

  // Get the best voice for the language
  const lang = options.lang || "en-IN";
  const voice = getBestVoice(lang);

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text.trim());

  // Set language
  utterance.lang = lang;

  // Set voice if available
  if (voice) {
    utterance.voice = voice;
  }

  // Set speech parameters
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.volume = options.volume !== undefined ? options.volume : 1.0;

  // Set up event handlers
  utterance.onstart = () => {
    if (options.onStart) {
      options.onStart();
    }
  };

  utterance.onend = () => {
    if (options.onEnd) {
      options.onEnd();
    }
  };

  utterance.onerror = (event) => {
    console.error("speakText: Speech synthesis error:", event.error);
    if (options.onError) {
      options.onError(event.error || new Error("Speech synthesis failed"));
    }
  };

  // Speak
  try {
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error("speakText: Error speaking text:", error);
    if (options.onError) {
      options.onError(error);
    }
    return false;
  }
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = () => {
  if (!isTTSSupported()) return;

  try {
    window.speechSynthesis.cancel();
  } catch (error) {
    console.warn("stopSpeaking: Error stopping speech:", error);
  }
};

/**
 * Check if speech is currently active
 */
export const isSpeaking = () => {
  if (!isTTSSupported()) return false;
  return window.speechSynthesis.speaking;
};

/**
 * Pause current speech
 */
export const pauseSpeaking = () => {
  if (!isTTSSupported()) return;

  try {
    window.speechSynthesis.pause();
  } catch (error) {
    console.warn("pauseSpeaking: Error pausing speech:", error);
  }
};

/**
 * Resume paused speech
 */
export const resumeSpeaking = () => {
  if (!isTTSSupported()) return;

  try {
    window.speechSynthesis.resume();
  } catch (error) {
    console.warn("resumeSpeaking: Error resuming speech:", error);
  }
};

/**
 * Get available voices for a language
 */
export const getVoices = (lang = null) => {
  if (!isTTSSupported()) return [];

  const voices = window.speechSynthesis.getVoices();
  if (!lang) return voices;

  return voices.filter((voice) => voice.lang.startsWith(lang.split("-")[0]));
};

/**
 * Initialize TTS on user gesture (call this on button click, etc.)
 * This is especially important for iOS
 */
export const initializeTTSOnGesture = () => {
  if (!isTTSSupported()) return false;

  // Try to initialize
  const initialized = initializeTTS();

  // If voices are empty, try to trigger voice loading
  if (!initialized) {
    try {
      // Create a dummy utterance to trigger voice loading (iOS)
      const dummyUtterance = new SpeechSynthesisUtterance("");
      dummyUtterance.volume = 0;
      window.speechSynthesis.speak(dummyUtterance);
      window.speechSynthesis.cancel();

      // Wait a bit and check again
      setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          isTTSInitialized = true;
        }
      }, 100);
    } catch (error) {
      console.warn("initializeTTSOnGesture: Error:", error);
    }
  }

  return initialized;
};

// Auto-initialize on page load (for non-iOS devices)
if (typeof window !== "undefined") {
  // Load voices when they become available
  if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (!isTTSInitialized) {
        initializeTTS();
      }
    };
  }

  // Try to initialize immediately (works on most browsers except iOS)
  if (document.readyState === "complete") {
    initializeTTS();
  } else {
    window.addEventListener("load", initializeTTS);
  }
}
