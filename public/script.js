const voiceSelect = document.querySelector("#voiceSelect");
const playButton = document.querySelector("#playButton");
const textInput = document.querySelector("textArea");
const languageSelect = document.querySelector("#languageSelect");

//Speech Recognition

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const rec = new SpeechRecognition();
rec.leng = "sr-RS";
rec.continuous = true;

rec.onresult = function (e) {
  for (let i = e.resultIndex; i < e.results.length; i++) {
    const script = e.results[i][0].transcript.toLowerCase().trim();
    console.log(script);
    textInput.value = script;
  }
};
rec.start();

//Array od supported languages
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "sr", name: "Serbian" },
  { code: "zn-CN", name: "Chinese (Simplified)" },
];

// Populate lagugane select box

languages.forEach(({ code, name }) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = name;
  languageSelect.appendChild(option);
});

//Load Voices
let voices = [];
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = voices
    .map(
      (voice, index) =>
        `<option value="${index}">${voice.name} (${voice.lang})</option>`
    )
    .join(""); //.map nam daje array a .join nam vraca string
}

//Trigger loading voices when thay bacome available

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

//translate Text with severless function
async function translateText(text, targetLeng) {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        target: targetLeng,
      }),
    });
    //Provera,ako nesto nije uredu...
    if (!response.ok) {
      throw new Error(`Error ${response.status}:${await response.text()}`);
    }
    //ako je sve ok
    const data = await response.json();
    return data.data.translations[0].translatedText; //prvo data je const,drugo data(podaci) iz response.json()
  } catch (error) {
    console.error("Translation Error: ", error);
    alert("Failed to translate text");
    return text;
  }
}

//Text to speech
function playText(text, voiceIndex) {
  const utterance = new SpeechSynthesisUtterance(text);
  if (voices[voiceIndex]) {
    utterance.voice = voices[voiceIndex];
  }
  speechSynthesis.speak(utterance);
}

//Play TTS

playButton.addEventListener("click", async () => {
  const text = textInput.value.trim();
  const targetLang = languageSelect.value;
  const selectedVoiceIndex = voiceSelect.value;

  if (!text) {
    alert("Please enter some text!");
    return;
  }

  try {
    // Translate text
    const translatedText = await translateText(text, targetLang);
    // Play text
    playText(translatedText, selectedVoiceIndex);
  } catch (error) {
    console.error("Error during processing: ", error);
    alert("An error occurred");
  }
});
