/**
 * Courtesy of the Dreditor project.
 *
 * Content Scope Runner.
 *
 * While Firefox/GreaseMonkey supports advanced DOM manipulations, Chrome does
 * not. For maximum browser compatibility, this user script injects itself into
 * the page it is executed on.
 *
 * Support and available features for user scripts highly varies across browser
 * vendors. Some browsers (e.g., Firefox) require to install a browser extension
 * (GreaseMonkey) in order to install and execute user scripts. Some others
 * have built-in support for user scripts, but do not support all features of
 * GreaseMonkey (variable storage, cross-domain XHR, etc). In the special case
 * of Chrome, user scripts are executed before the DOM has been fully loaded and
 * initialized; they can only access and manipulate the plain DOM document as
 * is, but none of the scripts on the actual page are loaded yet.
 *
 * Bear in mind, with Content Scope Runner, unsafeWindow and all other
 * GreaseMonkey specific features are not available.
 *
 * The global __PAGE_SCOPE_RUN__ variable is prepended to the user script to
 * control execution. Make sure this variable does not clash with actual page
 * variables.
 *
 * @see http://userscripts.org/scripts/show/68059
 * @see http://wiki.greasespot.net/Content_Scope_Runner
 *
 * @todo FIXME upstream:
 *   - Bogus SCRIPT type attribute.
 *   - data attribute throws MIME type warning in Chrome; textContent approach
 *     of earlier versions is correct.
 *   - Append to HEAD.
 *   - Removal/clean-up is completely invalid.
 *   - setTimeout() approach seems useless?
 *   - Code comments.
 */
/*jshint ignore:start*/
var drupalorg_kanban_loader = function ($) {
/*jshint ignore:end*/
Drupal.contribkanban = {
  version: '1.0.0',
  behaviors: {},
  attachBehaviors: function (context) {
    // Apply behaviors.
    console.log (Drupal.contribkanban.behaviors);
    $.each(Drupal.contribkanban.behaviors, function () {
      this(context);
    });
  },
};

Drupal.contribkanban.behaviors.drupalorgKanbanIframe = function(context) {
    var projectName = window.location.pathname.split("/").pop();
    console.log(projectName);
    $(context).find('.view-project-issue-project-searchapi')
    .prepend('<iframe src="https://contribkanban.com/board/' + projectName + '?embed=1" style="width: 100%; height: 450px;">View kanban board</iframe>');
};

Drupal.contribkanban.behaviors.drupalorgKanbanProjectLink = function(context) {
    var projectName = window.location.pathname.split("/").pop();
    console.log(projectName);
    $(context).find('.issue-cockpit-All')
    .prepend('<h3>Kanban</h3><a href="https://contribkanban.com/board/' + projectName + '">View kanban board</a>');
};

jQuery(document).ready(function () {
  Drupal.contribkanban.attachBehaviors(this);
});
/*jshint ignore:start*/
// End of Content Scope Runner.
};
/*jshint ignore:end*/


// If not already running in the page, inject this script into the page.
if (typeof __PAGE_SCOPE_RUN__ === 'undefined') {
  // Define a closure/function in the global scope in order to reference the
  // function caller (the function that executes the user script itself).
  (function page_scope_runner() {
    // Retrieve the source of dreditor_loader, inject and run.
    var self_src = '(' + drupalorg_kanban_loader.toString() + ')(jQuery);';

    // Add the source to a new SCRIPT DOM element; prepend it with the
    // __PAGE_SCOPE_RUN__ marker.
    // Intentionally no scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.textContent = "var __PAGE_SCOPE_RUN__ = true;\n" + self_src;

    // Inject the SCRIPT element into the page.
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
  })();

  // End execution. This code path is only reached in a GreaseMonkey/user
  // script environment. User script environment implementations differ; not all
  // browsers (e.g., Opera) understand a return statement here, and it would
  // also prevent inclusion of this script in unit tests. Therefore, the entire
  // script needs to be wrapped in a condition.
}
// Drupal is undefined when drupal.org is down.
else if (typeof Drupal === 'undefined') {
}
// Execute the script as part of the content page.
else {
  drupalorg_kanban_loader(jQuery); /*jshint ignore:line*/
}
