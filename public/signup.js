const signupNicknameInput = document.getElementById('signup-nickname-input');

const nicknameExistsMessage = document.getElementById(
  'nickname-exists-message'
);

const handleSignupResult = (status) => {
  if (status == 409) {
    nicknameExistsMessage.hidden = false;
    signupNicknameInput.addEventListener(
      'input',
      () => (nicknameExistsMessage.hidden = true),
      { once: true }
    );
  }
};
