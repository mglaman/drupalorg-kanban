Drupal.contribkanban = {
  version: '%PKG.VERSION%',
  behaviors: {},
  attachBehaviors: function (context) {
    // Apply behaviors.
    $.each(Drupal.contribkanban.behaviors, function () {
      this(context);
    });
  },
};
