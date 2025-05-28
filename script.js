const videoElement = document.getElementById('videoElement');
const startButton = document.getElementById('startButton');
const captureButton = document.getElementById('captureButton');
const displayPhotos = document.querySelector('.displayPhotos');
const cameraScreen = document.querySelector('.cameraScreen');
const startButtonContainer = document.querySelector('.startButtonContainer');

let stream;
let count = 0;
const maxPhotos = 4; // Increase max if you want

async function startWebcam() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    startButton.disabled = true;
    captureButton.disabled = false;
    startButton.style.display = "none";
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
}

function capturePhoto() {
    if (count >= maxPhotos) return;
    count++;

    // Create canvas to grab current frame
    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');
    
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.translate(canvas.width, 0); // Shift origin to right edge
    context.scale(-1, 1);
    // Draw video frame to canvas (normal orientation)
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    context.setTransform(1, 0, 0, 1, 0, 0);

    // Create img element from canvas
    const imgDataUrl = canvas.toDataURL('image/jpeg');
    const img = document.createElement("img");
    img.src = imgDataUrl;
    displayPhotos.appendChild(img);

    const a = document.createElement('a');
    a.href = imgDataUrl;
    a.download = `photo_${Date.now()}.jpg`; // unique filename based on timestamp
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (count === maxPhotos) {
        // disable the capture button and display images
        captureButton.disabled = true;
        document.querySelector('.cameraAndButtons').style.display = 'none';
        displayPhotos.classList.add('finalGallery');
        
        const photostrip_bottom = document.createElement("p");
        photostrip_bottom.textContent = "2andbeii";
        photostrip_bottom.classList.add("photostrip-text");
        displayPhotos.appendChild(photostrip_bottom);

        document.querySelector('.decorationContainer').style.display = "block";
    }
}

const colorSelection = document.querySelectorAll('.colorSelection > span')

colorSelection.forEach(elm => {
   elm.addEventListener('click', function(event) {
    const bgColor = window.getComputedStyle(event.target).backgroundColor;
    const textColor = window.getComputedStyle(event.target).color;
    
    const finalGallery = document.querySelector('.displayPhotos.finalGallery');
    const photoStripText = document.querySelector('.photostrip-text');

    if (finalGallery) {
      finalGallery.style.backgroundColor = bgColor;
    }

    if (photoStripText) {
      photoStripText.style.backgroundColor = bgColor;
      photoStripText.style.color = textColor;
    }
  })
})

const save_strip_button = document.getElementById('saveStripButton');

save_strip_button.addEventListener('click', function() {
    const finalGallery = document.querySelector('.displayPhotos.finalGallery');

    if (!finalGallery) return;

    html2canvas(finalGallery).then(canvas => {
        const imgDataUrl = canvas.toDataURL('image/jpeg');

        const a = document.createElement('a');
        a.href = imgDataUrl;
        a.download = `strip_${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});


startButton.addEventListener('click', startWebcam);
captureButton.addEventListener('click', capturePhoto);
