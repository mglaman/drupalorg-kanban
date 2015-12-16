Drupal.contribkanban.behaviors.drupalorgKanbanProjectLink = function(context) {
    var projectName = window.location.pathname.split("/").pop();
    $(context).find('.issue-cockpit-All')
    .prepend('<h3>Kanban</h3><a href="https://contribkanban.com/board/' + projectName + '">View kanban board</a>');
};
