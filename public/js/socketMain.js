  var socket = io.connect();

  /*socket.on('session', function(session) {
    document.getElementById('t').value = JSON.stringify(session);
  });

  document.getElementById('foo').addEventListener('keyup', function() {
    socket.emit('foo', this.value);
  });*/

  document.addEventListener('mousemove', onDocumentMouseMoveSender, false);

  function onDocumentMouseMoveSender(event) {
    socket.emit('DocumentMouseMove', {
      clientX: event.clientX,
      clientY: event.clientY
    });
  }

  function addScreen(screenInfos){
    socket.emit('addScreen', screenInfos);
  }

  socket.on('mousemove', function(event) {
    for (var i = 0; i < apps.length; ++i) {
      apps[i].documentMouseMove(event);
    }
  });