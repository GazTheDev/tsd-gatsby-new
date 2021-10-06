$().ready(function() {

    var n_timeout;

    $document = $(document);
    $ads = $('.adsbygoogle');

    if($ads.length > 0) {

        if($ads.is(':hidden')) {
            $ads.before('<a class="button" style="width: auto; margin-bottom: 0;" href="/advertise-on-fminside">Advertise</a>');
        }

    }

    $document.on('click', 'ul.view a', function(event) {

        event.preventDefault();

        var classname = $(this).attr('class');

        $('ul.view li a').removeClass('active');

        $(this).addClass('active');

        if(classname == 'list') {
            $('#content').addClass('list');
        } else {
            $('#content').removeClass('list');
        }

        
    });

    $document.on('click', 'span.meta', function(event) {

        event.preventDefault();

        $(this).closest('div.comment').toggleClass('collapsed');

        
    });

    $document.on('click', 'ul.footer a.angle', function(event) {

        event.preventDefault();

        $('ul.footer').toggleClass('open');

        var open = $('ul.footer').attr('class');

        if(open == 'menu footer open')
            $('ul.footer a.angle').css('transform', 'rotate(180deg)');
        else
            $('ul.footer a.angle').css('transform', 'rotate(360deg)');

    });

    $document.on('click', 'h2.suitable a.angle', function(event) { 

        event.preventDefault();

        $('ol#suitable').toggleClass('open');

        var open = $('ol#suitable').attr('class');

        if(open == 'open')
            $('h2.suitable a.angle').css('transform', 'rotate(180deg)');
        else
            $('h2.suitable a.angle').css('transform', 'rotate(360deg)');

    });

    $document.on('click', 'h2.non-suitable a.angle', function(event) { 

        event.preventDefault();

        $('ol#non-suitable').toggleClass('open');

        var open = $('ol#non-suitable').attr('class');

        if(open == 'open')
            $('h2.non-suitable a.angle').css('transform', 'rotate(180deg)');
        else
            $('h2.non-suitable a.angle').css('transform', 'rotate(360deg)');

    });

    $document.on('click','a#hamburger', function(event) {
        
        event.preventDefault();

        $('#menu').toggleClass('open');

    });

    $document.on('click','a#filter', function(event) {

        event.preventDefault();

        $('div.formation-filter').toggleClass('open');
        $('div#sidebar').toggleClass('open');
        $('a#hamburger').css('z-index', '1');
    });

    $document.on('click','div.news p img', function(event) {

        $(this).toggleClass('zoom');

    });		

    $document.on('click','a.screenshot', function(event) {

        event.preventDefault();

        $(this).toggleClass('zoom');

    });		

    $document.on('click','a.direct, a.steam', function(event) {

        $.ajax({
            url: '/resources/inc/ajax/add-download.php',
            success: function(msg) {

            }
            
        });

        var download_instructions = $('div.download-instruction'); 

        download_instructions.scrollIntoView();

    });

    $document.on('change','select#version', function(event) {

        event.preventDefault();

        var version = $(this).val();

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/change-version.php',
            data: 'version='+version,
            success: function(msg) {
                location.reload();
            }
            
        });


    });

    $document.on('click','div.score a', function(event) {

        event.preventDefault();

        var comment_id = $(this).attr('comment-id');
        var type = $(this).attr('comment-type');
        
        if($(this).hasClass('plus')) {
            var rating = 1;
        } else {
            var rating = -1;
        }

        $(this).parents('div.score').find('a').removeClass('active');
        $(this).addClass('active');

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/like-dislike.php',
            data: 'comment_id='+comment_id+'&rating='+rating+'&type='+type,
            success: function(msg) {

                if(msg.length > 0) {

                    $('#score_'+comment_id).html(msg);
                    $('#score_'+comment_id).addClass('updated');
                
                }


            }
            
        });

    });

    $document.on('click','a.reply', function(event) {

        event.preventDefault();

        var comment_id = $(this).attr('comment-id');
        var content = $('#comment_'+comment_id).html();

        $('#reply_to').html('<input type="hidden" name="parent_id" value="'+comment_id+'"><h3>Replying to: </h3><span><a id="close" href=""></a></span><div class="comment">'+content+'</div>');
        $('textarea#comment').focus();

    });

    $document.on('click', 'a#close', function(event) {
        event.preventDefault();

        $('#reply_to').html('');
    })

    $document.on('click','form#add-comment a.button.submit', function(event) {

        var type = $(this).attr('type');

        event.preventDefault();

        $('form#add-comment').addClass('loading');

        if(type == 'player') {

            $.ajax({
                type: 'POST',
                url: '/resources/inc/ajax/add-comment.php',
                data: $('form#add-comment').serialize(),
                success: function(msg) {

                    var data = JSON.parse(msg);

                    if(data[0] == 1) {
                        $('input#username').attr('disabled','disabled');
                        $('textarea#comment').val('');
                        $('#reply_to').html('');

                        if(history.pushState)
                            history.pushState(null, null, '#comment_'+data[2]);
                        else
                            location.hash = '#comment_'+data[2];

                        rebuild_comments();

                    }

                    if(data[0] == 2) {
                        console.log(2);
                    }

                    if(data[0] == 3) {

                        $.each(data[1], function(key, val) {
                            $('form#add-comment input[name="'+key+'"]').addClass('error');
                            $('form#add-comment textarea[name="'+key+'"]').addClass('error');
                        });

                        $('.error').first().focus();

                    }

                    $('form#add-comment').removeClass('loading');

                }
                
            });

        }

        if (type == 'club') { 
            
            $.ajax({
                type: 'POST',
                url: '/resources/inc/ajax/add-comment-club.php',
                data: $('form#add-comment').serialize(),
                success: function(msg) {

                    var data = JSON.parse(msg);

                    if(data[0] == 1) {

                        $('input#username').attr('disabled','disabled');
                        $('textarea#comment').val('');
                        $('#reply_to').html('');

                        if(history.pushState)
                            history.pushState(null, null, '#comment_'+data[2]);
                        else
                            location.hash = '#comment_'+data[2];

                        rebuild_comments_clubs();

                    }

                    if(data[0] == 2) {
                        console.log(2);
                    }

                    if(data[0] == 3) {

                        $.each(data[1], function(key, val) {
                            $('form#add-comment input[name="'+key+'"]').addClass('error');
                            $('form#add-comment textarea[name="'+key+'"]').addClass('error');
                        });

                        $('.error').first().focus();

                    }

                    $('form#add-comment').removeClass('loading');

                }
                
            });
        }

        if (type == 'article') { 
            
            $.ajax({
                type: 'POST',
                url: '/resources/inc/ajax/add-comment-article.php',
                data: $('form#add-comment').serialize(),
                success: function(msg) {

                    var data = JSON.parse(msg);

                    if(data[0] == 1) {
                        $('input#username').attr('disabled','disabled');
                        $('textarea#comment').val('');
                        $('#reply_to').html('');

                        if(history.pushState)
                            history.pushState(null, null, '#comment_'+data[2]);
                        else
                            location.hash = '#comment_'+data[2];

                        rebuild_comments_article();

                    }

                    if(data[0] == 2) {
                        console.log(2);
                    }

                    if(data[0] == 3) {

                        $.each(data[1], function(key, val) {
                            $('form#add-comment input[name="'+key+'"]').addClass('error');
                            $('form#add-comment textarea[name="'+key+'"]').addClass('error');
                        });

                        $('.error').first().focus();

                    }

                    $('form#add-comment').removeClass('loading');

                }
                
            });
        }

    });
    
    $document.on('click', '.editor .controls a', function(event) {

        event.preventDefault();

        var editor = $(this).closest('.editor');
        var textarea = $(editor).find('textarea');
        var preview = $(editor).find('.preview');

        textarea.focus();

        var text = textarea.getSelection().text;

        switch(this.id) {

            case 'h1' :
                if(text.length == 0) {
                    textarea.replaceSelectedText('## ','collapseToEnd');
                } else {
                    if(text[0] == '#' && text[1] == '#') {
                        textarea.replaceSelectedText(text.slice(3),'select');
                    } else {
                        textarea.replaceSelectedText('## '+text,'select');
                    }
                }
            break;

            case 'bold' :
                if(text.length == 0) {
                    textarea.surroundSelectedText('**','**');
                } else {
                    if(text[0] == '*' && text[1] == '*' && text[(text.length-2)] == '*' && text[(text.length-1)] == '*') {
                        textarea.replaceSelectedText(text.slice(2, -2),'select');
                    } else {
                        textarea.replaceSelectedText('**'+text+'**','select');
                    }
                }

            break;

            case 'italic' :
                if(text.length == 0) {
                    textarea.surroundSelectedText('*','*');
                } else {
                    if(text[0] == '*' && text[(text.length-1)] == '*' && (text[1] != '*' || text[2] == '*')) {
                        textarea.replaceSelectedText(text.slice(1, -1),'select');
                    } else {
                        textarea.replaceSelectedText('*'+text+'*','select');
                    }
                }
            break;

            case 'strikethrough' :
                if(text.length == 0) {
                    textarea.surroundSelectedText('~~','~~');
                } else {
                    if(text[0] == '~' && text[1] == '~' && text[(text.length-1)] == '~' && text[(text.length-2)] == '~') {
                        textarea.replaceSelectedText(text.slice(2, -2),'select');
                    } else {
                        textarea.replaceSelectedText('~~'+text+'~~','select');
                    }
                }
            break;

            case 'underline' :
                if(text.length == 0) {
                    textarea.surroundSelectedText('__','__');
                } else {
                    if(text[0] == '_' && text[1] == '_' && text[(text.length-1)] == '_' && text[(text.length-2)] == '_') {
                        textarea.replaceSelectedText(text.slice(2, -2),'select');
                    } else {
                        textarea.replaceSelectedText('__'+text+'__','select');
                    }
                }
            break;

            case 'list-ul' :
                if(text.length == 0) {
                    textarea.replaceSelectedText('* ','collapseToEnd');
                } else {
                    var newtext = '';
                    lines = text.split('\n');

                    for(var i = 0; i < lines.length; i++)
                        newtext = newtext + '* '+lines[i]+'\n';

                    textarea.replaceSelectedText(newtext,'select');
                }
            break;

            case 'list-ol' :
                if(text.length == 0) {
                    textarea.replaceSelectedText('1. ','collapseToEnd');
                } else {
                    var newtext = '';
                    lines = text.split('\n');

                    for(var i = 0; i < lines.length; i++)
                        newtext = newtext + (i+1)+'. '+lines[i]+'\n';

                    textarea.replaceSelectedText(newtext,'select');
                }
            break;

            case 'link' :
                if(text.length == 0)
                    textarea.replaceSelectedText('[linktekst](https://voorbeeld.nl)','select');
                else
                    textarea.surroundSelectedText('['+text+'](https://',')');
            break;

            case 'preview' :

                if($(textarea).is(':visible')) {

                    $(this).addClass('code');

                    $.ajax({
                        type: 'POST',
                        url: '/resources/inc/ajax/parsedown.php',
                        data: 'text='+$(textarea).val(),
                        success: function(msg) {

                            preview.html(msg);
                            textarea.hide();
                            preview.show();
                        }
                    });

                } else {
                    $(this).removeClass('code');
                    preview.hide();
                    textarea.show();
                }

            break;
        }

    });

    // NEW

    jQuery.expr[':'].icontains = function(a, i, m) {
        return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };

    $document.on('dblclick', 'div#player div.title span.image', function(event) {

        var likes = parseInt($('#likes b').html());
        var image = $(this);

        $.ajax({
            url: '/beheer/modules/players/resources/inc/frontend/add-like.php',
            success: function(msg) {
                if(msg == 1) {
                    image.addClass('liked');
                    $('#likes b').html(likes + 1);
                    $('#likes').addClass('liked')
                }
            }

        });

        return false;

    });

    $document.on('click', '#likes i', function(event) {

        event.preventDefault();

        $('div#player div.title span.image').dblclick();

    });
/*
    $document.on('mouseleave', 'span#potential', function(event) {

        $('i.potential_value').remove();
        $('#player_stats').removeClass('potential-active');

    });

    $document.on('mouseover', 'span#potential', function(event) {

        if($('#player_stats').hasClass('potential-active')) {
            // do nothing
        } else {

            $('#player_stats').addClass('potential-active');

            var ability = parseInt($('#ability').html());
            var potential = parseInt($('#potential').html());
            var gap = potential - ability;

            var smooth = 1 + ((gap/100) * 2.5);
            var modifier = ability + (gap / smooth);

            $.each($('td.stat'), function(event) {

                var value = $(this).html();
                var pot_value = Math.round((value / ability) * modifier);

                if(pot_value > 20) {
                    pot_value = 20;
                }

                if(pot_value > value) {
                    var difference = '<u>+'+(pot_value-value)+'</u>';
                } else {
                    var difference = '';
                }

                $(this).append('<i class="potential_value">'+pot_value+difference+'</i>');
            });

            var nationality = $(this).attr('value');

        }

    });
*/
    $document.on('click', 'div.nations a', function(event) {

        clearTimeout(n_timeout);

        event.preventDefault();

        $('div.nations').hide();

        var nationality = $(this).attr('value');

        $('input[name="nationality"]').val(nationality);
        $('form.filter').trigger('change');

        return false;

    });

    $document.on('keyup', 'input[name="nationality"]', function(event) {
        if(event.which == 13) {
            if($(this).val().length > 0) {
                $('div.nations li a:not(:hidden):eq(0)').click();
            } else {
                $('form.filter').trigger('change');
                $('div.nations').hide();
            }
            $(this).blur();
        }

        if(event.which == 27) {
            $('div.nations').hide();
            $(this).blur();
        }

    });

    $document.on('change', 'input[name="nationality"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $document.on('keyup', 'input[name="nationality"]', function(event) {

        event.preventDefault();

        $('div.nations').addClass('search-active');
        $('div.nations li a').removeClass('show');
        $('div.nations li').find('a:icontains("'+$(this).val()+'")').addClass('show');

    });

    $document.on('focus', 'input[name="nationality"]', function(event) {
        event.preventDefault();
        $('div.nations').show();
    });

    $document.on('blur', 'input[name="nationality"]', function(event) {
        event.preventDefault();
        n_timeout = setTimeout(function(){ $('div.nations').hide() }, 200);
    });

    $document.on('click', 'img.flag', function(event) {

        event.preventDefault();

        var code = $(this).attr('code');

        $('input[name="nationality"]').val(code);
        $('form.filter').trigger('change');

    });

    $document.on('click', 'a.remove-all-filters', function(event) {

        event.preventDefault();

        $('input[name="league"]').attr('disabled', false);


        $.each($('form.filter input'), function(event) {
            
            if($(this).attr('type') == 'text') {
                $(this).val('');
            }
            
            if($(this).attr('type') == 'checkbox') {
                $(this).prop('checked',false);
            }
        });


        $('form.filter').trigger('change');

    });

    /////////////////////////////////////////////////////

    
    $document.on('click', 'div.leagues a', function(event) {

        clearTimeout(n_timeout);

        event.preventDefault();

        $('div.leagues').hide();

        var league = $(this).attr('value');

        $('input[name="league"]').val(league);
        $('form.filter').trigger('change');

        return false;

    });

    $document.on('keyup', 'input[name="league"]', function(event) {
        if(event.which == 13) {
            if($(this).val().length > 0) {
                $('div.leagues li a:not(:hidden):eq(0)').click();
            } else {
                $('form.filter').trigger('change');
                $('div.leagues').hide();
            }
            $(this).blur();
        }

        if(event.which == 27) {
            $('div.leagues').hide();
            $(this).blur();
        }

    });

    $document.on('change', 'input[name="league"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $document.on('keyup', 'input[name="league"]', function(event) {

        event.preventDefault();

        $('div.leagues').addClass('search-active');
        $('div.leagues li a').removeClass('show');
        $('div.leagues').find('li a:icontains("'+$(this).val()+'")').addClass('show');

    });

    $document.on('focus', 'input[name="league"]', function(event) {
        event.preventDefault();
        $('div.leagues').show();
    });

    $document.on('blur', 'input[name="league"]', function(event) {
        event.preventDefault();
        n_timeout = setTimeout(function(){ $('div.leagues').hide() }, 200);
    });

    ////////////////////////////////////////////////////////////////////////
    var fields = ['clause', 'max_wage', 'min_value'];

    $document.on('click', 'div.filter-examples a', function(event) {

        clearTimeout(n_timeout);

        event.preventDefault();

        var a = $(this);
        var type = a.attr('type');

        $(fields).each(function(key, value) {

            if(type == value) {

                $('div.filter-examples').hide();

                var amount = a.html();

                $('input[name="'+type+'"]').val(amount);
                $('form.filter').trigger('change');

                return false;
            }
        });

    });

    $document.on('keyup', 'input[name="clause"]', function(event) {

        console.log($(this).val());

        if(event.which == 13) {
            if($(this).val().length > 0) {

                var first_option = $('div.filter-examples[type="clause"] li a:not(:hidden):eq(0)');

                if(first_option.length > 0)
                    first_option.click();
                else
                    $('form.filter').trigger('change');

            } else {
                $('form.filter').trigger('change');
                $('div.filter-examples[type="clause"]').hide();
            }
            $(this).blur();
            return false;
        }

        if(event.which == 27) {
            $('div.filter-examples').hide();
            $(this).blur();
            return false;
        }

        $('div.filter-examples[type="clause"]').addClass('search-active');
        $('div.filter-examples[type="clause"] li a').removeClass('show');
        $('div.filter-examples[type="clause"]').find('li a:icontains("'+$(this).val()+'")').addClass('show');

    });

    $document.on('change', 'input[name="clause"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $document.on('focus', 'input[name="clause"]', function(event) {
        event.preventDefault();
        $('div.filter-examples[type="clause"]').show();
    });

    $document.on('blur', 'input[name="clause"]', function(event) {
        event.preventDefault();
        n_timeout = setTimeout(function(){ $('div.filter-examples[type="clause"]').hide() }, 200);
    });

    $document.on('keyup', 'input[name="max_wage"]', function(event) {

        console.log($(this).val());

        if(event.which == 13) {
            if($(this).val().length > 0) {

                var first_option = $('div.filter-examples[type="max_wage"] li a:not(:hidden):eq(0)');

                if(first_option.length > 0)
                    first_option.click();
                else
                    $('form.filter').trigger('change');

            } else {
                $('form.filter').trigger('change');
                $('div.filter-examples[type="clause"]').hide();
            }
            $(this).blur();
            return false;
        }

        if(event.which == 27) {
            $('div.filter-examples').hide();
            $(this).blur();
            return false;
        }

        $('div.filter-examples[type="max_wage"]').addClass('search-active');
        $('div.filter-examples[type="max_wage"] li a').removeClass('show');
        $('div.filter-examples[type="max_wage"]').find('li a:icontains("'+$(this).val()+'")').addClass('show');

    });

    $document.on('change', 'input[name="max_wage"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $document.on('focus', 'input[name="max_wage"]', function(event) {
        event.preventDefault();
        $('div.filter-examples[type="max_wage"]').show();
    });

    $document.on('blur', 'input[name="max_wage"]', function(event) {
        event.preventDefault();
        n_timeout = setTimeout(function(){ $('div.filter-examples[type="max_wage"]').hide() }, 200);
    });

    $document.on('keyup', 'input[name="min_value"]', function(event) {

        console.log($(this).val());

        if(event.which == 13) {
            if($(this).val().length > 0) {

                var first_option = $('div.filter-examples[type="min_value"] li a:not(:hidden):eq(0)');

                if(first_option.length > 0)
                    first_option.click();
                else
                    $('form.filter').trigger('change');

            } else {
                $('form.filter').trigger('change');
                $('div.filter-examples[type="clause"]').hide();
            }
            $(this).blur();
            return false;
        }

        if(event.which == 27) {
            $('div.filter-examples').hide();
            $(this).blur();
            return false;
        }

        $('div.filter-examples[type="min_value"]').addClass('search-active');
        $('div.filter-examples[type="min_value"] li a').removeClass('show');
        $('div.filter-examples[type="min_value"]').find('li a:icontains("'+$(this).val()+'")').addClass('show');

    });

    $document.on('change', 'input[name="min_value"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $document.on('focus', 'input[name="min_value"]', function(event) {
        event.preventDefault();
        $('div.filter-examples[type="min_value"]').show();
    });

    $document.on('blur', 'input[name="min_value"]', function(event) {
        event.preventDefault();
        n_timeout = setTimeout(function(){ $('div.filter-examples[type="min_value"]').hide() }, 200);
    });

    /////

    $document.on('click', 'div.tags a', function(event) {

        clearTimeout(n_timeout);

        event.preventDefault();

        $('div.tags').hide();

        var league = $(this).attr('value');

        $('input[name="tags"]').val(tags);

        return false;

    });

    $document.on('keyup', 'input[name="tags"]', function(event) {
        if(event.which == 13) {
            if($(this).val().length > 0) {
                $('div.tags li a:not(:hidden):eq(0)').click();
            } else {
                $('div.tags').hide();
            }
            $(this).blur();
        }

        if(event.which == 27) {
            $('div.tags').hide();
            $(this).blur();
        }

    });

    $document.on('change', 'input[name="tags"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
    });

    $document.on('keyup', 'input[name="tags"]', function(event) {

        event.preventDefault();

        $('div.tags').addClass('search-active');
        $('div.tags li a').removeClass('show');
        $('div.tags').find('li a:icontains("'+$(this).val()+'")').addClass('show');

    });

    $document.on('focus', 'input[name="tags"]', function(event) {
        event.preventDefault();
        $('div.leagues').show();
    });

    $document.on('blur', 'input[name="tags"]', function(event) {
        event.preventDefault();
        n_timeout = setTimeout(function(){ $('div.tags').hide() }, 200);
    });


    $document.on('click', 'a.remove-all-filters', function(event) {

        event.preventDefault();

        $('input[name="league"]').attr('disabled', false);

        $('input[name="nationality"]').attr('disabled', false);

        $.each($('form.filter input'), function(event) {
            
            if($(this).attr('type') == 'text') {
                $(this).val('');
            }
            
            if($(this).attr('type') == 'checkbox') {
                $(this).prop('checked',false);
            }
        });

        $('form.filter').trigger('change');

    });


    $document.on('click', 'a.remove-filter', function(event) {

        event.preventDefault();

        $(this).parents('div.filter').remove();

        var type = $(this).attr('type');
        var filter = $(this).attr('filter_name');

        var input = $('div#sidebar').find('input[name="'+filter+'"]');

        $('input[name="league"]').attr('disabled', false);

        $('input[name="nationality"]').attr('disabled', false);

        if(input.length > 0) {


            if(input.attr('type') == 'text') {
                input.val('');
            }
            
            if(input.attr('type') == 'checkbox') {
                input.prop('checked',false);
            }
        } else {
            var inputs = $('div#sidebar').find('input[name="'+filter+'[]"]:checked');
            
            $.each(inputs, function(event) {
                $(this).prop('checked',false);
            });
        }

        $('form.filter').trigger('change');

    });

    $document.on('click', 'body#clubs a.loadmore', function(event) {

        event.preventDefault();

        $('form.filter').addClass('loading');
        $('#club_table').addClass('loading');

        $(this).remove();

        $.ajax({
            url: '/beheer/modules/clubs/resources/inc/frontend/generate-club-table.php',
            data: 'ajax_request=1&loadmore=true',
            success: function(msg) {
                $('#club_table div.clubs').append(msg);
                $('form.filter').removeClass('loading');
                $('#club_table').removeClass('loading');
            }

        });

    });

    $document.on('click', 'body#clubs a.sort', function(event) {

        event.preventDefault();

        $('form.filter').addClass('loading');
        $('#club_table').addClass('loading');

        var sortorder = $(this).attr('data-sort');

        $.ajax({
            url: '/beheer/modules/clubs/resources/inc/frontend/generate-club-table.php',
            data: 'ajax_request=1&sortorder='+sortorder,
            success: function(msg) {
                $('#club_table').html(msg);
                $('form.filter').removeClass('loading');
                $('#club_table').removeClass('loading');
            }

        });

    });

    $document.on('change', 'body#players select#player_view', function(event) {

        event.preventDefault();

        $('form.filter').addClass('loading');
        $('#player_table').addClass('loading');

        $.ajax({
            url: '/beheer/modules/players/resources/inc/frontend/generate-player-table.php',
            data: 'ajax_request=1&view='+$(this).val(),
            success: function(msg) {
                $('#player_table').html(msg);
                $('form.filter').removeClass('loading');
                $('#player_table').removeClass('loading');
            }

        });

    });

    $document.on('click', 'body#players a.loadmore', function(event) {

        event.preventDefault();

        $('form.filter').addClass('loading');
        $('#player_table').addClass('loading');

        $(this).remove();

        $.ajax({
            url: '/beheer/modules/players/resources/inc/frontend/generate-player-table.php',
            data: 'ajax_request=1&loadmore=true',
            success: function(msg) {
                $('#player_table div.players').append(msg);
                $('form.filter').removeClass('loading');
                $('#player_table').removeClass('loading');
            }

        });

    });

    $document.on('click', 'body#players a.sort', function(event) {

        event.preventDefault();

        $('form.filter').addClass('loading');
        $('#player_table').addClass('loading');

        var sortorder = $(this).attr('data-sort');

        $.ajax({
            url: '/beheer/modules/players/resources/inc/frontend/generate-player-table.php',
            data: 'ajax_request=1&sortorder='+sortorder,
            success: function(msg) {
                $('#player_table').html(msg);
                $('form.filter').removeClass('loading');
                $('#player_table').removeClass('loading');
            }

        });

    });

    $document.on('change', 'body#players select.orderby', function(event) {

        $('form.filter').addClass('loading');
        $('#player_table').addClass('loading');

        var sortorder = $(this).val();

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/players/resources/inc/frontend/generate-player-table.php',
                    data: 'ajax_request=1&sortorder='+sortorder,
                    success: function(msg) {
                        $('#player_table').html(msg);
                        $('form.filter').removeClass('loading');
                        $('#player_table').removeClass('loading');
                    }

                });
            }

        });

    });

    $document.on('change', 'body#players form.filter', function(event) {

        $('form.filter').addClass('loading');
        $('#player_table').addClass('loading');

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/players/resources/inc/frontend/generate-player-table.php',
                    data: 'ajax_request=1',
                    success: function(msg) {
                        $('#player_table').html(msg);
                        $('form.filter').removeClass('loading');
                        $('#player_table').removeClass('loading');
                    }

                });
            }

        });

    });

    $document.on('change', 'body#clubs div.formation-filter', function(event) {

        $('div#dynamic_formation').addClass('loading');

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form#formation').serialize(),
            success: function(msg) {
                
                $.ajax({
                    type: 'GET',
                    url: '/beheer/modules/clubs/resources/inc/frontend/generate_formations.php',
                    data: 'ajax_request=1',
                    success: function(msg) {
                        $('div#dynamic_formation').html(msg);
                        $('div#dynamic_formation').removeClass('loading');
                        $('div.formation-filter').removeClass('open');

                    }

                });
            }

        });

    });

    $document.on('change', 'body#clubs select.orderby', function(event) {

        $('form.filter').addClass('loading');
        $('#club_table').addClass('loading');

        var sortorder = $(this).val();

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/clubs/resources/inc/frontend/generate-club-table.php',
                    data: 'ajax_request=1&sortorder='+sortorder,
                    success: function(msg) {
                        $('#club_table').html(msg);
                        $('form.filter').removeClass('loading');
                        $('#club_table').removeClass('loading');
                    }

                });
            }

        });

    });


    $document.on('change', 'body#clubs form.filter', function(event) {

        $('form.filter').addClass('loading');
        $('#club_table').addClass('loading');

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/clubs/resources/inc/frontend/generate-club-table.php',
                    data: 'ajax_request=1',
                    success: function(msg) {
                        $('#club_table').html(msg);
                        $('form.filter').removeClass('loading');
                        $('#club_table').removeClass('loading');
                    }

                });
            }

        });

    });

    /*

    $document.on('change', 'body#shortlists form.filter', function(event) {

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/news/resources/inc/frontend/search.php',
                    success: function(msg) {
                        $('div#content').html(msg);

                    }

                });
            }

        });

    });

    $document.on('change', 'body#downloads form.filter', function(event) {

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/news/resources/inc/frontend/search.php',
                    success: function(msg) {
                        $('div#content').html(msg);
                    }

                });
            }

        });

    });

    $document.on('change', 'body#guides form.filter', function(event) {

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('form.filter').serialize(),
            success: function(msg) {
                
                $.ajax({
                    url: '/beheer/modules/news/resources/inc/frontend/search.php',
                    success: function(msg) {
                        $('div#content').html(msg);

                    }

                });
            }

        });

    });

    */

    $document.on('click', '.rating-form a', function(event) {
        event.preventDefault();
        $('#rating-form').removeClass('error');
        $('.rating-form a').removeClass('active');
        $(this).prevAll().addClass('active');
        $(this).addClass('active');
        $('input[name=rating]').val($(this).attr('data-rating'));
    });

    $document.on('click', '#aanbieder .tabs a', function(event){

        event.preventDefault();

        $('#aanbieder .tabs a').removeClass('active');
        $(this).addClass('active');

        var id = $(this).attr('data-id');

        $('#open_tab').html($('#'+id).html());
        $('#closed_tab div.tab').show();
        $('#closed_tab #'+id).hide()

    });

    $document.on('click', '#calendar_signin a.send', function(event) {

        event.preventDefault();

        $('#calendar_signin').submit();
    });

    $document.on('click', 'a.mark', function(event) {

        event.preventDefault();

        var anchor = this;
        var type = $(this).attr('data-type');
        var id = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/mark.php',
            data: '&type='+type+'&id='+id,
            success: function(msg) {

                if(msg == 1) {

                    if(type == 2) {
                        $('div.topic').addClass('read');
                    } else {
                        $('div.forum').addClass('read');
                    }

                    $(anchor).addClass('success');

                } else {

                    $(anchor).addClass('error').attr('title',msg);

                }

            }
        });
    });

    $document.on('keypress','#title,#content', function(event) {
        $(this).removeClass('error');
    });

    $document.on('click', '#register div.header', function(event) {
        $('html, body').animate({
            scrollTop: $("#registration").offset().top
        }, 500, function() {
            $('input[name="pers_email"]').addClass('focus');
            update_focus();
        });
    });

    $document.on('change', '#subscription', function(event) {

        if($(this).val() == 1)
            $('.company').hide();
        else
            $('.company').show();

    });

    $document.on('click', 'a.cancel', function(event) {

        event.preventDefault();

        var type = $(this).attr('data-type');
        var id = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/edit_'+type+'.php',
            data: '&'+type+'_id='+id+'&cancel=1',
            success: function(msg) {
                $('#'+type+'_'+id+' .content div.top').html(msg);
            }
        });

        $('#'+type+'_'+id+' .content div').html(msg);
    });

    $document.on('click', 'a.save', function(event) {

        event.preventDefault();

        var type = $(this).attr('data-type');
        var id = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/edit_'+type+'.php',
            data: $('#'+type+'_'+id+' .form').serialize()+'&'+type+'_id='+id,
            success: function(msg) {

                var message = JSON.parse(msg);

                if(message[0] == 2) {
                    $.each(message[1],function(k,v) {
                        if(k == 'agree')
                            $('#agree').addClass('error');
                        else
                            $('#'+k).addClass('error');
                    });
                } else {
                    $('#'+type+'_'+id+' .content div.top').html(message[1]);
                }
            }
        });
    });

    $document.on('click', 'a.edit', function(event) {

        event.preventDefault();

        var type = $(this).attr('data-type');
        var id = $(this).attr('data-id');

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/edit_'+type+'.php',
            data: '&'+type+'_id='+id,
            success: function(msg) {

                $('#'+type+'_'+id+' .content div.top').html(msg);
            }
        });
    });

    $document.on('click', 'a.register', function(event) {

        event.preventDefault();

        $('#registration input').removeClass('error');

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/content/resources/inc/frontend/lid-worden.php',
            data: $('#registration').serialize(),
            success: function(msg) {

                try {

                    var msg = JSON.parse(msg);
                    var i = 1;

                    $.each(msg,function(key,val) {
                        if(i == 1) {
                            $('.focus').removeClass('focus');
                            $('input[name="'+val+'"]').addClass('focus');
                        }
                        
                        if(val == 'rubrieken')
                            $('').addClass('error');
                        else
                            $('input[name="'+val+'"]').addClass('error');
                        
                        i++;
                    });

                    update_focus(150);

                } catch(e) {

                    $('#register').html(msg);

                }

            }
        });
    });

    $document.on('submit', 'form#login', function(event) {

        event.preventDefault();

        $('#login input').removeClass('error');

        $.ajax({
            type: 'POST',
            url: '/beheer/resources/core/ajax/login.php',
            data: $('#login').serialize(),
            success: function(msg) {

                if(msg == 1) {
                    $('#login').remove();
                } else if(msg == 2) {
                    $('#login input[name="password"]').val('');
                    $('#login input[name="password"]').addClass('error focus');
                } else if(msg == 3) {
                    $('#login input[name="email"]').addClass('error focus');
                    $('#login input[name="password"]').addClass('error');
                } else {
                    window.location.href = msg;
                }

                update_focus();

            }
        });
    });

    $document.on('click', 'a.login', function(event) {

        event.preventDefault();

        $('#login input').removeClass('error');

        $.ajax({
            type: 'POST',
            url: '/beheer/resources/core/ajax/login.php',
            data: $('#login').serialize(),
            success: function(msg) {

                if(msg == 1) {
                    $('#login').remove();
                } else if(msg == 2) {
                    $('input').removeClass('focus');
                    $('#login input[name="password"]').val('');
                    $('#login input[name="password"]').addClass('error focus');
                } else if(msg == 3) {
                    $('input').removeClass('focus');
                    $('#login input[name="email"]').addClass('error focus');
                    $('#login input[name="password"]').addClass('error');
                } else {
                    window.location.href = msg;
                }

                update_focus();

            }
        });
    });

    $document.on('click', 'a.undo', function(event) {

        event.preventDefault();

        var id = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        var obj = this;

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/undo_'+type+'.php',
            data: '&id='+id,
            success: function(msg) {

                if(msg == 1) {
                    $('#'+type+'_'+id).removeClass('removed');
                    $(obj).removeClass('undo');
                    $(obj).addClass('delete');
                } else {
                    $('#'+type+'_'+id).addClass('error');
                    $('#'+type+'_'+id).attr('title',msg);
                }

            }
        });
    });

    $document.on('click', 'a.delete', function(event) {

        event.preventDefault();

        var id = $(this).attr('data-id');
        var type = $(this).attr('data-type');
        var obj = this;

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/delete_'+type+'.php',
            data: '&id='+id,
            success: function(msg) {

                if(msg == 1) {
                    $('#'+type+'_'+id).addClass('removed');
                    $(obj).removeClass('delete');
                    $(obj).addClass('undo');
                } else {
                    $('#'+type+'_'+id).addClass('error');
                    $('#'+type+'_'+id).attr('title',msg);
                }

            }
        });
    });

    $document.on('click', 'form#new_topic a.submit', function(event) {

        $('form#new_topic input').removeClass('error');
        $('form#new_topic textarea').removeClass('error');

        $.ajax({
            type: 'POST',
            data: $('#new_topic').serialize(),
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/post_topic.php',
            success: function(msg) {

                if(msg == 2) {
                    $('#main_body').prepend('<div class="error">Er ging iets fout tijdens het toevoegen, dit is een databasefout. De eigenaar is op de hoogte gesteld van het probleem.</div>');
                    return false;
                }

                var message = JSON.parse(msg);

                if(message[0] == 1) {
                    window.location.href = '/forum/'+message[1]+'/'+message[2]+'-'+message[3]+'/';
                } else {
                    $.each(message[1],function(k,v) {
                        $('#'+k).addClass('error');
                    });
                }
                                        
            }
        });

        return false;

    });

    $document.on('click', 'form#new_reply a.submit', function(event) {

        $('form#new_reply input').removeClass('error');
        $('form#new_reply textarea').removeClass('error');

        $.ajax({
            type: 'POST',
            data: $('#new_reply').serialize(),
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/post_reply.php',
            success: function(msg) {

                if(msg == 2) {
                    $('#main_body').prepend('<div class="error">Er ging iets fout tijdens het toevoegen, dit is een databasefout. De eigenaar is op de hoogte gesteld van het probleem.</div>');
                    return false;
                }

                var message = JSON.parse(msg);

                if(message[0] == 1) {
                    $('#topic').append(message[1]);
                    $('#quick_reply').hide();
                } else {
                    $.each(message[1],function(k,v) {
                        $('#'+k).addClass('error');
                    });
                }
                                        
            }
        });

        return false;

    });


    $document.on('click', 'form#new_review a.submit', function(event) {

        $('#rating-form').removeClass('error');

        $.ajax({
            type: 'POST',
            data: $('#new_review').serialize(),
            url: '/beheer/modules/aanbieders/resources/inc/frontend/ajax/post-review.php',
            success: function(msg) {

                if(msg == 2) {
                    $('#main_body').html('<div class="error">Er ging iets fout tijdens het toevoegen, dit is een databasefout. De eigenaar is op de hoogte gesteld van het probleem.</div>');
                    return false;
                }

                var message = JSON.parse(msg);

                if(message[0] == 1) {
                    window.location = '/reviews';
                } else {
                    $.each(message[1],function(k,v) {
                        $('#'+k).addClass('error');
                        $('#'+k).title(v);
                    });
                }
                                        
            }
        });

        return false;

    });

    $document.on('click', 'a.heart', function(event) {

        event.preventDefault();

        var value = Number($(this).html());
        var obj = this;

        var id = $(this).attr('data-id');
        var type = $(this).attr('data-type');

        $.ajax({
            type: 'POST',
            url: '/beheer/modules/forum/resources/inc/frontend/ajax/add_heart.php',
            data: '&'+type+'_id='+id,
            success: function(msg) {

                if(msg == 1) {
                    $(obj).addClass('active');
                    $(obj).html(value+1);
                } else {
                    $(obj).removeClass('active');
                    $(obj).html(value-1);
                }

            }
        });
    });


    $document.on('submit', 'form#filter', function(event) {
        event.preventDefault();
    });

    $document.on('change', 'form#filter', function(event) {

        var type = $('#type').val();

        $.ajax({
            type: 'POST',
            url: '/resources/inc/ajax/update_filter.php',
            data: $('#filter').serialize(),
            success: function(msg) {

                $.ajax({
                    type: 'POST',
                    url: '/beheer/modules/'+type+'/resources/inc/frontend/ajax/overview.php',
                    success: function(msg) {

                        $('#main_body').html(msg);
                                                
                    }
                });

            }
        });

    });

    $document.on('click blur focus', '#search ul li a', function(event){

        var id = $(this).attr('data-id');
        
        $('#search ul li a').removeClass('active');
        $(this).addClass('active');

        $('.tab').hide();
        $('#tab_'+id).show();
        $('#tab_'+id+' input').focus();
    
    });

    $document.on('click', '#top ul li a', function(event){

        event.preventDefault();

        var href = $(this).attr('href');

        $('#top li').removeClass('active');
        $(this).parent('li').addClass('active');
        $('#top').addClass('default');
        $('#front').addClass('loading');

        setTimeout(function() {window.location = href}, 200);
    
    });

    $document.on('click', '#top.collapsed', function(event){
        $('#top').removeClass('collapsed');
        $('#top').removeClass('notrans');
        $('#top').addClass('fixed');
    });

    $document.on('click', '.tag ul li a', function(event) {

        event.preventDefault();
    });

    $document.on('keyup', 'input[name="club"]', function(event) {


        if($(this).val().length > 0) {

            $('input[name="league"]').attr('disabled', true);

        } else { 
            $('input[name="league"]').attr('disabled', false);
        }

    });



    /*

        $('.fullpage').on('DOMMouseScroll mousewheel', function (event) {

            if(event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0 ) {
                var ele = $('main');
                $("html, body").animate({
                    scrollTop: $(ele).offset().top
                }, 300);
                return false;
            } else {

            }
            
        });

    */

    var lastScrollTop = 0;

    $(window).scroll(function(event) {

        var st = $(this).scrollTop();

        if($('#front').length > 0) {
            var target = 170;
        } else {
            var target = 80;
        }

        if(st >= lastScrollTop){

            if($('#front').length > 0) {

                if(st > (target-20))
                    $('#top').hide();

                if(st > (target-1))
                    $('#top').show();

            }

            if(st >= target) {
                if($('#top').hasClass('default') == false) {
                    $('#top').addClass('notrans');
                    $('#top').addClass('default');
                    $('#top').show();
                }
                $('#top').removeClass('fixed');
                $('#top').addClass('collapsed');
            }
        } else {


            if($('#front').length > 0) {
                if(st < (target-20))
                    $('#top').show();
            }

            $('#top').removeClass('collapsed');
            $('#top').addClass('fixed');

            if($('#top').hasClass('notrans') == true) {
                $('#top').removeClass('notrans');
            }

            if(st < target) {
                if($('#front').length > 0) {
                    $('#top').removeClass('default');
                    $('#top').removeClass('fixed');
                }
            }
        }

        lastScrollTop = st;

    });

    // OLD
    
    update_focus();
    
    if($('#map')[0])
        load_map('map', 15);

    $("#logo_input").on("change", function() {
    
        var formData = new FormData($('form#aanbieder')[0]);
                    
        $.ajax({
            url: '/beheer/modules/aanbieders/resources/inc/ajax/update_logo.php',
            type: 'POST',
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false);
                }
                return myXhr;
            },
            beforeSend: beforeSendHandler,
            success: function(data) {
                $("#logo_result").html(data);
                $('#progress_wrapper').hide();

                resetFormElement($('#logo_input'));
            },
            error: errorHandler,
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        });
        
    });

    $("#afbcal_input").on("change", function() {
    
        var formData = new FormData($('#calendar_form')[0]);
                    
        $.ajax({
            url: '/beheer/modules/calendar/resources/inc/ajax/update_image.php',
            type: 'POST',
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){
                    myXhr.upload.addEventListener('progress',progressHandlingFunction, false);
                }
                return myXhr;
            },
            beforeSend: beforeSendHandler,
            success: function(data) {
                $("#afbcal_result").html(data);
                $('#progress_wrapper').hide();
            },
            error: errorHandler,
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $document.on('click', 'div.url', function(event) {
        
        if(document.selection) { // IE
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById('url'));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById('url'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }

    });

    $document.on('click', 'a.copy', function(event) {
        
        event.preventDefault();

        var a = $(this);

        copyToClipboard('#'+a.attr('copy_id'));

        a.addClass('copied');

        setTimeout(function(){ a.removeClass('copied') }, 1000);

    });

    if($('#upload-image').length > 0) {

        var uploader = new plupload.Uploader({
            runtimes: 'html5',
            drop_element : 'container',
            browse_button: 'pickfiles',
            url: '/resources/inc/ajax/upload-screenshot.php',
            chunk_size: '10mb',
            max_file_size: '20mb',
            filters: {
                max_file_size: '20mb',
                mime_types: [{title: "files", extensions: "jpg,png,bmp"}]
            },
            init: {
                PostInit: function () {
                    document.getElementById('filelist').innerHTML = '';
                },
                FilesAdded: function (up, files) {
                    $('.fileselect').hide();
                    plupload.each(files, function (file) {
                        document.getElementById('filelist').innerHTML += `<div id="${file.id}" class="file"><h3>Uploaden..</h3><strong>0%</strong> - ${file.name} (${plupload.formatSize(file.size)})<div class="progress"><div class="inner"></div></div></div>`;
                    });
                    uploader.start();
                },
                UploadProgress: function (up, file) {

                    if(file.percent == 100) {

                        $(`#${file.id}`).addClass('complete');
                        $(`#${file.id} h3`).html('Finished');
                        document.querySelector(`#${file.id} strong`).innerHTML = `<span>${file.percent}%</span>`;
                        $(`#${file.id} .inner`).css('width',`${file.percent}%`);

                    } else {

                        document.querySelector(`#${file.id} strong`).innerHTML = `<span>${file.percent}%</span>`;
                        $(`#${file.id} .inner`).css('width',`${file.percent}%`);

                    }

                },
                Error: function (up, err) {
                    console.log(err);
                },
                UploadComplete: function(up, files) {
                    setTimeout(function(){ location.reload(); }, 2000);
                }
            }
        });

        uploader.bind('Init', function(up, params) {

            if (uploader.features.dragdrop) {

                var target = document.getElementById('container');
                
                target.ondragover = function(event) {
                    event.dataTransfer.dropEffect = "copy";
                };
                
                target.ondragenter = function() {
                    this.className = "dragover";
                };
                
                target.ondragleave = function() {
                    this.className = "";
                };
                
                target.ondrop = function() {
                    this.className = "";
                };
            }
        });

        uploader.init();
    }

});

// FUNCTIONS

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function clear_form(id) {
    $('#'+id+' :input').not(':button, :submit, :reset, :hidden, :checkbox, :radio').val('');
    $('#'+id+' :checkbox, :radio').prop('checked', false);
    $('#'+id).trigger('change');
}

function resetFormElement(e) {
    e.wrap('<form>').closest('form').get(0).reset();
    e.unwrap();
}

function isset() {

    var a = arguments,
    l = a.length,
    i = 0, undef;

    if(l === 0) 
        throw new Error('Empty isset');

    while(i !== l) {
    
        if(a[i] === undef || a[i] === null) 
            return false;
        i++;
    }

    return true;
}

function empty(mixed_var) {

    var undef, key, i, len;
    var emptyvalue = [undef, null, false, 0, "", "0"];

    for(i = 0, len = emptyvalue.length; i < len; i++) {
        if(mixed_var === emptyvalue[i])
            return true;
    }

    if(typeof mixed_var === "object") {

        for(key in mixed_var) {

            if(mixed_var.hasOwnProperty(key))
                return false;s
        }

        return true;

    }

    return false;

}

function update_focus(offset) {

    if($('.focus:visible').length > 0) {
        var fc 	= $('.focus:visible');
        var fcv = fc.val();
        
        fc.focus().val('').val(fcv);

        if(isset(offset)) {

            $top_offset = (fc.offset().top - offset);

            $('html,body').scrollTop($top_offset);

        }

    }

}

function beforeSendHandler(e) {
    
    var height = $('div#logo_wrapper').height();
    
    $('#progress_wrapper').height(height);
    $('#progress_wrapper').css('line-height', height+'px');

    $('#progress_wrapper').show();

}

function errorHandler(e) {
}

function progressHandlingFunction(e) {
    if(e.lengthComputable){
        $('progress').attr({value:e.loaded,max:e.total});
    }
}

function resetpassword(event, href) {
                        
    $.ajax({
        type: 'POST',
        url: '/beheer/resources/core/ajax/resetpassword.php',
        data: $("#resetpass").serialize(),
        success: function(msg)
        {

            if(msg == 1)
                $('#lostpass').html('<h1>Herstel e-mail verstuurd</h1><p>Er is een wachtwoord herstel e-mail naar uw e-mailadres gestuurd.<br /><br />Volg de instructies in de e-mail om uw wachtwoord opnieuw in te stellen.</p>');
            else
                $('#error').html('<div class="error">'+msg+'</div>');			
        }
        
    });

}

function load_map(id, zoom) {

    geocoder = new google.maps.Geocoder();

    var address = $('#address').val();

    geocoder.geocode({ 'address': address}, function(results, status) {
    
        if(status == google.maps.GeocoderStatus.OK) {

            var location = results[0].geometry.location;
                    
            var myOptions = {
                zoom: zoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: location
            }

            map = new google.maps.Map(document.getElementById(id), myOptions);

            var marker = new google.maps.Marker({
                position: location, 
                map: map
            }); 
            
        } else {
            $('#'+id).html("Het adres kon niet gevonden worden: " + status);
        }
    });

}

function href(url) {
    window.location.href = 'http://'+url;
}

function rebuild_comments() {

    $('div#comments').addClass('loading');

    $.ajax({
        url: '/resources/inc/ajax/rebuild-comments.php',
        success: function(msg) {
            $('div#comments').html(msg);
            $('div#comments').removeClass('loading');
            var hash = window.location.hash;
            if(hash.length > 0)
                location.hash = hash;
        }
    });

}

function rebuild_comments_clubs() {

    $('div#comments').addClass('loading');

    $.ajax({
        url: '/resources/inc/ajax/rebuild-comments-clubs.php',
        success: function(msg) {
            $('div#comments').html(msg);
            $('div#comments').removeClass('loading');
            var hash = window.location.hash;
            if(hash.length > 0)
                location.hash = hash;
        }
    });

}

function rebuild_comments_article() {

    $('div#comments').addClass('loading');

    $.ajax({
        url: '/resources/inc/ajax/rebuild-comments-article.php',
        success: function(msg) {
            $('div#comments').html(msg);
            $('div#comments').removeClass('loading');
            var hash = window.location.hash;
            if(hash.length > 0)
                location.hash = hash;
        }
    });

}

(function(e,t,n){"$:nomunge";function c(){s=t[o](function(){r.each(function(){var t=e(this),n=t.width(),r=t.height(),i=e.data(this,a);if(n!==i.w||r!==i.h){t.trigger(u,[i.w=n,i.h=r])}});c()},i[f])}var r=e([]),i=e.resize=e.extend(e.resize,{}),s,o="setTimeout",u="resize",a=u+"-special-event",f="delay",l="throttleWindow";i[f]=250;i[l]=true;e.event.special[u]={setup:function(){if(!i[l]&&this[o]){return false}var t=e(this);r=r.add(t);e.data(this,a,{w:t.width(),h:t.height()});if(r.length===1){c()}},teardown:function(){if(!i[l]&&this[o]){return false}var t=e(this);r=r.not(t);t.removeData(a);if(!r.length){clearTimeout(s)}},add:function(t){function s(t,i,s){var o=e(this),u=e.data(this,a);u.w=i!==n?i:o.width();u.h=s!==n?s:o.height();if(typeof r=="function"){r.apply(this,arguments)}}if(!i[l]&&this[o]){return false}var r;if(e.isFunction(t)){r=t;return s}else{r=t.handler;t.handler=s}}};})(jQuery,this);
!function(e){function t(e,t){var n=typeof e[t];return"function"===n||!("object"!=n||!e[t])||"unknown"==n}function n(e,t){return typeof e[t]!=x}function r(e,t){return!("object"!=typeof e[t]||!e[t])}function o(e){window.console&&window.console.log&&window.console.log("RangyInputs not supported in your browser. Reason: "+e)}function a(e,t,n){return 0>t&&(t+=e.value.length),typeof n==x&&(n=t),0>n&&(n+=e.value.length),{start:t,end:n}}function c(e,t,n){return{start:t,end:n,length:n-t,text:e.value.slice(t,n)}}function l(){return r(document,"body")?document.body:document.getElementsByTagName("body")[0]}var i,u,s,d,f,v,p,m,g,x="undefined";e(document).ready(function(){function h(e,t){var n=e.value,r=i(e),o=r.start;return{value:n.slice(0,o)+t+n.slice(r.end),index:o,replaced:r.text}}function y(e,t){e.focus();var n=i(e);return u(e,n.start,n.end),""==t?document.execCommand("delete",!1,null):document.execCommand("insertText",!1,t),{replaced:n.text,index:n.start}}function T(e,t){e.focus();var n=h(e,t);return e.value=n.value,n}function E(e,t){return function(){var n=this.jquery?this[0]:this,r=n.nodeName.toLowerCase();if(1==n.nodeType&&("textarea"==r||"input"==r&&/^(?:text|email|number|search|tel|url|password)$/i.test(n.type))){var o=[n].concat(Array.prototype.slice.call(arguments)),a=e.apply(this,o);if(!t)return a}return t?this:void 0}}var S=document.createElement("textarea");if(l().appendChild(S),n(S,"selectionStart")&&n(S,"selectionEnd"))i=function(e){var t=e.selectionStart,n=e.selectionEnd;return c(e,t,n)},u=function(e,t,n){var r=a(e,t,n);e.selectionStart=r.start,e.selectionEnd=r.end},g=function(e,t){t?e.selectionEnd=e.selectionStart:e.selectionStart=e.selectionEnd};else{if(!(t(S,"createTextRange")&&r(document,"selection")&&t(document.selection,"createRange")))return l().removeChild(S),void o("No means of finding text input caret position");i=function(e){var t,n,r,o,a=0,l=0,i=document.selection.createRange();return i&&i.parentElement()==e&&(r=e.value.length,t=e.value.replace(/\r\n/g,"\n"),n=e.createTextRange(),n.moveToBookmark(i.getBookmark()),o=e.createTextRange(),o.collapse(!1),n.compareEndPoints("StartToEnd",o)>-1?a=l=r:(a=-n.moveStart("character",-r),a+=t.slice(0,a).split("\n").length-1,n.compareEndPoints("EndToEnd",o)>-1?l=r:(l=-n.moveEnd("character",-r),l+=t.slice(0,l).split("\n").length-1))),c(e,a,l)};var w=function(e,t){return t-(e.value.slice(0,t).split("\r\n").length-1)};u=function(e,t,n){var r=a(e,t,n),o=e.createTextRange(),c=w(e,r.start);o.collapse(!0),r.start==r.end?o.move("character",c):(o.moveEnd("character",w(e,r.end)),o.moveStart("character",c)),o.select()},g=function(e,t){var n=document.selection.createRange();n.collapse(t),n.select()}}l().removeChild(S);var b=function(e,t){var n=h(e,t);try{var r=y(e,t);if(e.value==n.value)return b=y,r}catch(o){}return b=T,e.value=n.value,n};d=function(e,t,n,r){t!=n&&(u(e,t,n),b(e,"")),r&&u(e,t)},s=function(e){u(e,b(e,"").index)},m=function(e){var t=b(e,"");return u(e,t.index),t.replaced};var R=function(e,t,n,r){var o=t+n.length;if(r="string"==typeof r?r.toLowerCase():"",("collapsetoend"==r||"select"==r)&&/[\r\n]/.test(n)){var a=n.replace(/\r\n/g,"\n").replace(/\r/g,"\n");o=t+a.length;var c=t+a.indexOf("\n");"\r\n"==e.value.slice(c,c+2)&&(o+=a.match(/\n/g).length)}switch(r){case"collapsetostart":u(e,t,t);break;case"collapsetoend":u(e,o,o);break;case"select":u(e,t,o)}};f=function(e,t,n,r){u(e,n),b(e,t),"boolean"==typeof r&&(r=r?"collapseToEnd":""),R(e,n,t,r)},v=function(e,t,n){var r=b(e,t);R(e,r.index,t,n||"collapseToEnd")},p=function(e,t,n,r){typeof n==x&&(n=t);var o=i(e),a=b(e,t+o.text+n);R(e,a.index+t.length,o.text,r||"select")},e.fn.extend({getSelection:E(i,!1),setSelection:E(u,!0),collapseSelection:E(g,!0),deleteSelectedText:E(s,!0),deleteText:E(d,!0),extractSelectedText:E(m,!1),insertText:E(f,!0),replaceSelectedText:E(v,!0),surroundSelectedText:E(p,!0)})})}(jQuery);