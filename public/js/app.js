$('#searched-books-section').on('click', 'button', function(event) {
  event.preventDefault();
  console.log(event.target);
  let className = $(event.target).siblings('form').attr('class');
  if (event.target.className.includes('viewDetails')) {
    if (className.includes('hide-me')) {
      $(event.target).siblings('form').removeClass('hide-me');
    } else {
      $(event.target).siblings('form').addClass('hide-me');
    }
  }
});
