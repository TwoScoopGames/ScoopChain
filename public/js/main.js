$(document).ready(function(){

  $('.delete-bitcone').on('click', function(){
    var uuid = $(this).data('uuid');
    var url = '/delete/' + uuid;
    if(confirm('Delete Bitcone?')){
      $.ajax({
        url: url,
        type: 'DELETE',
        success: function(result){
          console.log('Deleting Bitcone');
          window.location.href = '/';
        },
        error: function(err){
          contole.log(err);
        }
      });
    }
  });

  $('.edit-bitcone').on('click', function() {
    $('#edit-form-uuid').val($(this).data('uuid'));
    $('#edit-form-flavor').val($(this).data('flavor'));
    $('#edit-form-series').val($(this).data('series'));
    $('#edit-form-owner').val($(this).data('owner'));
    $('#edit-form-qrcode').attr('src', $(this).data('qrcode'));
  });

})
