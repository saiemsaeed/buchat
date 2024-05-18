var activeChatUsername = '';
var chats = [];
var profiles = [
  {
    username: 'saiembae',
    name: 'Saiem Bae',
    profilePicture: './resources/profile-saiem.jpeg',
    status: 'online',
    lastMessage: 'I Love You ❤️',
    lastMessageDate: 'Today',
  },
  {
    username: 'humaazhar',
    name: 'Huma Azhar',
    profilePicture: './resources/profile-huma.webp',
    status: 'offline',
    lastMessage: 'Hello',
    lastMessageDate: '15 April',
  },
  {
    username: 'muhammadabdullah',
    name: 'Muhammad Abdullah',
    profilePicture: './resources/profile-abdullah.jpeg',
    status: 'offline',
    lastMessage: 'Goodbye',
    lastMessageDate: '16 April',
  },
  {
    username: 'johndoe',
    name: 'John Doe',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: 'Hey there!',
    lastMessageDate: 'Today',
  },
  {
    username: 'janesmith',
    name: 'Jane Smith',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'How are you?',
    lastMessageDate: 'Yesterday',
  },
  {
    username: 'mikejohnson',
    name: 'Mike Johnson',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: "What's up?",
    lastMessageDate: 'Today',
  },
  {
    username: 'emilydavis',
    name: 'Emily Davis',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'Good morning!',
    lastMessageDate: '2 days ago',
  },
  {
    username: 'alexwilson',
    name: 'Alex Wilson',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: 'See you later!',
    lastMessageDate: 'Today',
  },
  {
    username: 'sarahthompson',
    name: 'Sarah Thompson',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'Nice to meet you!',
    lastMessageDate: 'Yesterday',
  },
  {
    username: 'davidbrown',
    name: 'David Brown',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: "How's it going?",
    lastMessageDate: 'Today',
  },
  {
    username: 'jessicawilson',
    name: 'Olivia Taylor',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'Have a great day!',
    lastMessageDate: '3 days ago',
  },
  {
    username: 'danielanderson',
    name: 'Daniel Anderson',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: "What's the plan?",
    lastMessageDate: 'Today',
  },
  {
    username: 'sophiamartinez',
    name: 'Sophia Martinez',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'Take care!',
    lastMessageDate: 'Yesterday',
  },
  {
    username: 'jessicalee',
    name: 'Jessica Lee',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: 'Hey!',
    lastMessageDate: 'Today',
  },
  {
    username: 'ryanjohnson',
    name: 'Ryan Johnson',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'Good night!',
    lastMessageDate: 'Yesterday',
  },
  {
    username: 'emmawilson',
    name: 'Emma Wilson',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: 'How are you doing?',
    lastMessageDate: 'Today',
  },
  {
    username: 'michaelbrown',
    name: 'Michael Brown',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'offline',
    lastMessage: 'See you soon!',
    lastMessageDate: '2 days ago',
  },
  {
    username: 'sophiedavis',
    name: 'Sophie Davis',
    profilePicture: './resources/profile-placeholder.jpg',
    status: 'online',
    lastMessage: 'Good luck!',
    lastMessageDate: 'Today',
  },
];

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

window.addEventListener('load', function () {
  activeChatUsername = profiles[0].username;
  generateChats();
  generateProfiles();
  loadUserMessages(profiles[0].username);
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
  if (message.sender === 'current') {
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

function loadUserMessages(username) {
  const activeProfileEl = document.getElementById(`profile-${activeChatUsername}`);
  const nextProfileEl = document.getElementById(`profile-${username}`);
  if (activeProfileEl) {
    activeProfileEl.classList.remove('activeProfile');
  }
  nextProfileEl.classList.add('activeProfile');
  activeChatUsername = username;
  var chatMessages = document.getElementById('messages-container');
  chatMessages.innerHTML = '';
  var profile = profiles.find((profile) => profile.username === username);
  var chat = chats.find((chat) => chat.username === username);
  chat.messages.forEach((message) => {
    chatMessages.innerHTML += generateMessage(message, profile);
  });
}
