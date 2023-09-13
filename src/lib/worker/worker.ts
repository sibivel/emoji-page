onmessage = function(e) {
  console.log('Worker: Message received from main script');
  console.log(e.data);
  this.postMessage(new Function(e.data)());
}