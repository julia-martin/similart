const radioBtns = document.querySelectorAll("input[name='selected-work']");
const submitBtns = document.querySelectorAll("button[type='submit']");
const inputs = document.querySelectorAll("input");

function handleRadioButton(e) {
  radioBtns.forEach(input => {
    if (input.checked) {
      input.parentElement.style.backgroundColor = 'lavenderblush';
    } else {
      input.parentElement.style.backgroundColor = 'transparent';
    }
  });
}

function validateFile(fileInput, filePath) {
  const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert('Invalid file type');
    fileInput.value = '';
    return false;
  }
  return true;
}

function showPreview(e) {
  let fileInput = document.getElementById('user-submission');
  let filePath = fileInput.value;
  if (!validateFile(fileInput, filePath)) return;

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('image-preview').innerHTML = `<p>Your image:</p><img src="${e.target.result}"/>`;
    };

    reader.readAsDataURL(fileInput.files[0]);
  }
}

function checkValidity(e) {
  const currForm = this.closest('form');
  if (currForm.checkValidity()) {
    currForm.querySelector('button').removeAttribute('disabled');
  };
}

// Attach event listeners
radioBtns.forEach(input => input.addEventListener('change', handleRadioButton));
inputs.forEach(input => input.addEventListener('change', checkValidity));
document.getElementById('user-submission').addEventListener('change', showPreview);
