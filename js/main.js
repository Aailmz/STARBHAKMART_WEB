(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);

$(document).ready(function () {
	var itemData = {};
	var price;

	$('.item').on('click', function (e) {
	  e.preventDefault();
	
	  price = $(this).data('price');
	  var cartitemClass = $(this).data('cartitem');
	
	  if (!itemData[cartitemClass]) {
		itemData[cartitemClass] = {
		  clickCount: 0,
		  total: 0,
		  title: '',
		  text: ''
		};
	  }
	
	  itemData[cartitemClass].title = $(this).find('.card-title').text();
	  itemData[cartitemClass].text = $(this).find('.card-text').text();

	  var existingCartitem = $('#overflowbar .cartitem.' + cartitemClass);
	
	  if (existingCartitem.length) {
		existingCartitem.html($('.cartitem.' + cartitemClass).html());
	  } else {
		$('#overflowbar').append('<div class="cartitem ' + cartitemClass + '">' +
		  '<div class="cart-content">' +
		  '<div class="cart-title">' + itemData[cartitemClass].title + '</div>' +
		  '<div class="cart-text">' + itemData[cartitemClass].text + '</div>' +
		  '</div>' +
		  '<div class="click-count">' + itemData[cartitemClass].clickCount + '</div>' +
		  '<div class="price">' + itemData[cartitemClass].total + '</div>' +
		  '</div>');
	  }
	  alert("Barang berhasil dimasukkan ke dalam Cart!");
	  itemData[cartitemClass].clickCount++;
	  itemData[cartitemClass].total += price;
	
	  displayTotals();
	});
	$('#overflowbar').on('click', '.delete', function () {
        var cartitemClass = $(this).data('cartitem');
        if (itemData[cartitemClass]) {
            itemData[cartitemClass].clickCount--;

            if (itemData[cartitemClass].clickCount <= 0) {
                delete itemData[cartitemClass];
                $(this).closest('.cartitem').remove();
				alert("Barang berhasil dihapus dari Cart!");
            } else {
                itemData[cartitemClass].total = itemData[cartitemClass].clickCount * price;

                var cartitem = $(this).closest('.cartitem');
                cartitem.find('.click-count').text(itemData[cartitemClass].clickCount);

                var formattedTotal = format_uang(itemData[cartitemClass].total);
                cartitem.find('.price .priceshow').text(formattedTotal);
            }
            displayTotals();
        }
    });
	$('#overflowbar').on('click', '.plus', function () {
        var cartitemClass = $(this).data('cartitem');
        if (itemData[cartitemClass]) {
            itemData[cartitemClass].clickCount++;

            if (itemData[cartitemClass].clickCount <= 0) {
                delete itemData[cartitemClass];
                $(this).closest('.cartitem').remove();
            } else {
                itemData[cartitemClass].total = itemData[cartitemClass].clickCount * price;

                var cartitem = $(this).closest('.cartitem');
                cartitem.find('.click-count').text(itemData[cartitemClass].clickCount);

                var formattedTotal = format_uang(itemData[cartitemClass].total);
                cartitem.find('.price .priceshow').text(formattedTotal);
            }
            displayTotals();
        }
    });

	function format_uang(jumlah) {
		if (jumlah < 9000) {
		  return jumlah;
		} else {
		  var formatted = jumlah.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		  return formatted;
		}
	  }
	
	  function displayTotals() {
		$('#overflowbar').empty();
	  
		for (var key in itemData) {
		  var formattedTotal = format_uang(itemData[key].total);
	  
		  var cartitemContent = 
			'<div class="cartitem ' + key + '">' +
			  '<div class="cart-title">' + itemData[key].title +
			  '<div class="rp">Rp</div>' +
			  '<div class="priceshow">' + formattedTotal + '</div>' + '</div>' +
			  '<div class="unit">Unit Price: ' +
			  '<div class="cart-text">' + itemData[key].text + '</div>' +
			  '<div class="quantity">Quantity: </div>' + 
			  '<div class="click-count">' + itemData[key].clickCount + '</div>' + 
			  '</div>' +
			  '<div class="price" style="display:none;">' + itemData[key].total + '</div>' + 
			  '<button class="delete" data-cartitem="' + key + '">' +
			  '<img class="deleteimage" src="/images/Icons/Minus.png" alt="Delete">' +'</button>' +
			  '<button class="plus" data-cartitem="' + key + '">' +
			  '<img class="plusimage" src="/images/Icons/plus.png" alt="Plus">' +'</button>' +
			  '<button class="trash" data-cartitem="' + key + '">' +
			  '<img class="trashimage" src="/images/Icons/Trash.png" alt="Trash">' +'</button>' +
			  '</div>' +
			'</div>';
	  
		  $('#overflowbar').append(cartitemContent);
		}
	  
		var totalCount = getTotal('.click-count');
		var totalPrice = getTotal('.price');
		var formattedTotalPrice = format_uang(totalPrice);
	
		$('.click-count.overall').text(totalCount);
		$('.price.overall').text(formattedTotalPrice);
	
		var discount = 0;
		var tax = totalPrice * 0.1;
		var formattedTax = format_uang(tax);
		var total = totalPrice + tax;
		var formattedTotal = format_uang(total);
	
		$('#discount').text(format_uang(discount));
		$('#tax').text(formattedTax);
		$('#total').text(formattedTotal);

		$('.trash').on('click', function () {
            var cartitemClass = $(this).data('cartitem');
            delete itemData[cartitemClass];
            $(this).closest('.cartitem').remove();
			alert("Barang berhasil dihapus dari Cart!");
            displayTotals();
        });
	  }
	  
	
	function getTotal(elementClass) {
	  var total = 0;
	  $(elementClass).each(function () {
		total += parseInt($(this).text()) || 0;
	  });
	  return total;
	}


});
