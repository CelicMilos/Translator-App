const voiceSelect = document.querySelector("#voiceSelect");
const playButton = document.querySelector("#playButton");
const textInput = document.querySelector("textArea");
const languageSelect = document.querySelector("#languageSelect");

//Array od supported languages
const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
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

//Play TTS

playButton.addEventListener("click", () => {
  const utterance = new SpeechSynthesisUtterance(textInput.value);
  const selectedVoice = voices[voiceSelect.value];
  if (selectedVoice) utterance.voice = selectedVoice;
  speechSynthesis.speak(utterance);
});
