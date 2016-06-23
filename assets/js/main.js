$('#btn-demo-1').click(function() {
  Snack.make("This is a message only Snack.", {
    duration: Snack.INDEFINITE
  }).show();
});

$('#btn-demo-2').click(function() {
  Snack.make("This is a Snack with an action button. Click OKAY. Hurry up!", {
    duration   : Snack.INDEFINITE,
    action     : 'Okay',
    onAction   : function ( ) {
      Snack.make("Invoke an action, like this one.").show();
    }
  }).show();
});