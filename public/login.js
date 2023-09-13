/* eslint-disable */

const passwordInput = document.getElementById('password-input');
const passwordIncorrectMessage = document.getElementById(
  'password-incorrect-message'
);

const nicknameInput = document.getElementById('nickname-input');
const nicknameNotFoundMessage = document.getElementById(
  'nickname-not-found-message'
);

const handleLoginResult = (status) => {
  if (status == 401) {
    passwordIncorrectMessage.hidden = false;
    passwordInput.addEventListener(
      'input',
      () => (passwordIncorrectMessage.hidden = true),
      { once: true }
    );
  } else if (status == 404) {
    nicknameNotFoundMessage.hidden = false;
    nicknameInput.addEventListener(
      'input',
      () => (nicknameNotFoundMessage.hidden = true),
      { once: true }
    );
  }
};
