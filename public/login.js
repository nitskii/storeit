const loginNicknameInput = document.getElementById('login-nickname-input');
const nicknameNotFoundMessage = document.getElementById('nickname-not-found-message');

const loginPasswordInput = document.getElementById('login-password-input');
const passwordIncorrectMessage = document.getElementById('password-incorrect-message');

const handleLoginResult = (status) => {
  switch (status) {
    case 401:
      passwordIncorrectMessage.hidden = false;
      loginPasswordInput.addEventListener(
        'input',
        () => (passwordIncorrectMessage.hidden = true),
        { once: true }
      );
      break;
    case 404:
      nicknameNotFoundMessage.hidden = false;
      loginNicknameInput.addEventListener(
        'input',
        () => (nicknameNotFoundMessage.hidden = true),
        { once: true }
      );
      break;
  }
};
