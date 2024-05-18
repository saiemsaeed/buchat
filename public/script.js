var activeChatUsername = '';
var profiles = [];
var chats = [];
const url = 'http://localhost:3000';

async function fetchProfiles() {
  try {
    const response = await fetch(`${url}/api/profiles`);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

async function fetchMessages(username) {
  try {
    const response = await fetch(`${url}/api/messages/${username}`);

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

function generateChats() {
  chats = profiles.map((profile) => {
    const chatHistory = generateChatHistory(profile.username, 10);
    profile.lastMessage = chatHistory[chatHistory.length - 1].text;

    return {
      username: profile.username,
      messages: chatHistory,
    };
  });
}

function generateChatHistory(name, count) {
  var messages = [];
  for (var i = 0; i < count; i++) {
    messages.push({
      sender: i % 2 ? name : 'current',
      text: generateRandomMessage(),
      timestamp: generateRandomTimestamp(),
    });
  }
  return messages;
}

function generateRandomMessage() {
  var messages = [
    'Hello',
    'How are you?',
    'What are you up to?',
    'I miss you',
    'Good morning',
    'Good night',
    'See you later',
    'Take care',
    'Have a great day',
    'Nice to meet you',
  ];

  var randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

function generateRandomTimestamp() {
  var startDate = new Date(2022, 0, 1);
  var endDate = new Date();
  var randomTimestamp = new Date(
    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()),
  );
  return randomTimestamp.toLocaleString();
}

function scrollToBottom() {
  var chatMessages = document.getElementById('messages-container');
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateProfile(username, name, profilePicture, status, lastMessage, lastMessageDate) {
  return `<div
    id="profile-${username}"
    class="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md
    ${username === activeChatUsername ? 'activeProfile' : ''}
    "
    onclick="loadUserMessages('${username}')"
  >
    <div class="flex-2">
      <div class="w-12 h-12 relative">
        <img
          class="w-12 h-12 rounded-full mx-auto"
          src="${profilePicture}"
          alt="chat-user"
        />
        <span
          class="absolute w-4 h-4 ${
            status === 'online' ? 'bg-green-400' : 'bg-gray-400'
          } rounded-full right-0 bottom-0 border-2 border-white"
        ></span>
      </div>
    </div>
    <div class="flex-1 px-2">
      <div class="truncate w-52">
        <span id="pname" class="text-gray-800">${name}</span>
      </div>
      <div id="pmessage" class="text-gray-800"><small>${lastMessage}</small></div>
    </div>
    <div class="flex-2 text-right">
      <div id="pdate" class="text-gray-800"><small>${lastMessageDate}</small></div>
    </div>
  </div>`;
}

function generateProfiles() {
  var chatList = document.getElementById('chatlist');
  profiles.forEach((profile) => {
    chatList.innerHTML += generateProfile(
      profile.username,
      profile.name,
      profile.profilePicture,
      profile.status,
      profile.lastMessage,
      profile.lastMessageDate,
    );
  });
}

window.addEventListener('load', async function () {
  profiles = await fetchProfiles();
  activeChatUsername = profiles[1].username;
  console.log(profiles);
  generateChats();
  generateProfiles();
  const messages = await fetchMessages(profiles[1].username);
  loadUserMessages(profiles[1].username, messages);
});

function searchProfiles() {
  var input = document.getElementById('profile-search').value;
  var chatList = document.getElementById('chatlist');
  chatList.innerHTML = '';

  profiles.forEach((profile) => {
    if (profile.name.toLowerCase().includes(input.toLowerCase())) {
      chatList.innerHTML += generateProfile(
        profile.username,
        profile.name,
        profile.profilePicture,
        profile.status,
        profile.lastMessage,
        profile.lastMessageDate,
      );
    }
  });
}

function generateMessage(message, profile) {
  if (message.sender === activeChatUsername) {
    return `
      <div class="message me mb-4 flex text-right">
        <div class="flex-1 px-2">
          <div class="inline-block bg-[#6e56cf] rounded-full p-2 px-6 text-white">
            <span>${message.text}</span>
          </div>
          <div class="pr-4"><small class="text-gray-500">15 April</small></div>
        </div>
      </div>
    `;
  }

  return `
    <div class="message mb-4 flex">
      <div class="flex-2">
        <div class="w-12 h-12 relative">
          <img
            class="w-12 h-12 rounded-full mx-auto"
            src=${profile.profilePicture}
            alt="chat-user"
          />
          <span
            class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"
          ></span>
        </div>
      </div>
      <div class="flex-1 px-2">
        <div class="inline-block bg-gray-300 rounded-full p-2 px-4 text-gray-700">
          <span>${message.text}</span>
        </div>
        <div class="pl-4"><small class="text-gray-500">15 April</small></div>
      </div>
    </div>
  `;
}

function sendMessage() {
  var chatInput = document.getElementById('chat-input');
  var chatMessages = document.getElementById('messages-container');

  var profile = profiles.find((profile) => profile.username === activeChatUsername);

  var chat = chats.find((chat) => chat.username === activeChatUsername);
  chat.messages.push({
    sender: 'current',
    text: chatInput.value,
    timestamp: new Date().toLocaleString(),
  });
  chatMessages.innerHTML += generateMessage(
    {
      sender: 'current',
      text: chatInput.value,
      timestamp: new Date().toLocaleString(),
    },
    profile,
  );
  chatInput.value = '';
  scrollToBottom();
}

function loadUserMessages(username, messages) {
  console.log(username, messages, 'sss');
  const nextProfile = profiles.find((profile) => profile.username === username);
  const activeProfileEl = document.getElementById(`profile-${activeChatUsername}`);
  const nextProfileEl = document.getElementById(`profile-${username}`);
  if (activeProfileEl) {
    activeProfileEl.classList.remove('activeProfile');
  }

  nextProfileEl.classList.add('activeProfile');
  activeChatUsername = username;

  var chatMessages = document.getElementById('messages-container');
  chatMessages.innerHTML = '';
  messages.forEach((message) => {
    chatMessages.innerHTML += generateMessage(message, nextProfile);
  });
}
