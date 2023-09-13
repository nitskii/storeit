/* eslint-disable */

const nicknameInput = document.getElementById('nickname-input');

const nicknameExistsMessage = document.getElementById(
  'nickname-exists-message'
);

const handleSignupResult = (status) => {
  if (status == 409) {
    nicknameExistsMessage.hidden = false;
    nicknameInput.addEventListener(
      'input',
      () => (nicknameExistsMessage.hidden = true),
      { once: true }
    );
  }
};
