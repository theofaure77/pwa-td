export default function checkConnectivity({}) {
  if (navigator.onLine) {
    changeConnectivity(true);
  } else {
    changeConnectivity(false);
  }

  window.addEventListener('online', () => changeConnectivity(true));
  window.addEventListener('offline', () => changeConnectivity(false));
}

function changeConnectivity(state) {
  const event = new CustomEvent('connection-changed', {
    detail: state
  });
  document.dispatchEvent(event);
}