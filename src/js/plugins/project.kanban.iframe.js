Drupal.contribkanban.behaviors.drupalorgKanbanIframe = function(context) {
    var projectName = window.location.pathname.split("/").pop();
    $(context).find('.view-project-issue-project-searchapi')
    .prepend('<iframe src="https://contribkanban.com/board/' + projectName + '?embed=1" style="width: 100%; height: 450px;">View kanban board</iframe>');
};
