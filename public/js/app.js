$('#searched-books-section').on('click', 'button', function(event) {
  event.preventDefault();
  let className = $(event.target).parent().siblings('form').attr('class');
  if (event.target.className.includes('viewDetails')) {
    if (className.includes('hide-me')) {
      $(event.target).parent().siblings('form').removeClass('hide-me');
    } else {
      $(event.target).parent().siblings('form').addClass('hide-me');
    }
  }
});
