/* global $:true */
$(function() {
    'use strict';

    // ************************************************************************* //
    //  HTML templates
    // ************************************************************************* //

    // (None)


    // ************************************************************************* //
    //  Functions
    // ************************************************************************* //

    function setUpOptionsCheckboxes() {
        if(localStorage.getItem('options')){
            var optionsArr = JSON.parse(localStorage.options),
                optionsForm = $('#options-form');

            if(!optionsForm.length) {
                return;
            }

            for(var i=0;i<optionsArr.length;i++){
                var box = optionsForm.find('input:checkbox').eq(i);
                box.prop('checked', optionsArr[i]);
                setOptionDisplayState(box);
            }
        }
    }

    function setupActiveSidebarLink() {
        var pathname = window.location.pathname;

        if(pathname) {
            var pathArr = pathname.split('/');
            var path = decodeURIComponent(pathArr.slice(pathArr.length - 2, pathArr.length).join('/')); // modules/My Module.html

            $('#sidebar li > a').each(function(i) {
                var a = $(this);

                if(a.attr('href').indexOf(path) > -1) {
                    a.parent('li').addClass('active');
                }
            });
        }
    }

    function setUpWidgets() {
        var source = [];
        var sidebarSearch;

        $('#sidebar .panel-body ol > li > a').each(function(index, elem) {
            source.push($(elem).text().trim());
        });

        sidebarSearch = $('#sidebar input[type="search"]');
        sidebarSearch.autocomplete({
            source: source,
            position: { my : "left top", at: "right top" },
            select : function(event, ui) {
                $('#sidebar > li a:contains(' + ui.item.label + ')')[0].click();
            }
        });
    }

    function setupHeaderAnchors() {
        var slugger = new GithubSlugger();

        $('h1, h2, h3, h4, h5, h6', '.module-description, .class-description').each(function() {
            var $element = $(this);
            var id = slugger.slug($element.text());

            $element.attr('id', id);
            $element.addClass('anchorable-toc');
            $element.prepend('<a class="fa fa-link toc-anchor" href="#' + id + '"></a>');
        });
    }

    function setOptionDisplayState(box) {
        var cssName = $.trim(box.parent('label').text()).toLowerCase();
        if(box.is(':checked')){
            $('div.'+cssName).css('display', 'block');
            $('li.'+cssName).css('display', 'block');
            $('span.'+cssName).css('display', 'inline');
        }else{
            $('.'+cssName).css('display', 'none');
        }
    }

    function scrollToAnchor($anchor) {
        var navbarHeight = $('.navbar-fixed-top').outerHeight(true);
        $(document).scrollTop( $anchor.offset().top - navbarHeight);
    }

    $('[data-toggle=tab]').on('click', function (event, extraArgs) {
        // Why?  If responding to the click of a link or hashchange already, we really
        //  don't want to change window hash
        if (extraArgs && extraArgs.ignore === true) {
            return;
        }
        window.location.hash = $(this).attr('href');
    });

    $('[data-tabid]').on('click', function(event) {
        var tabToActivate = $(this).attr('data-tabid'),
        anchor = $(this).attr('data-anchor');
        event.preventDefault();

        $('[data-toggle=tab][href="'+ tabToActivate + '"]').click();
        // ...huh?  http://stackoverflow.com/a/9930611
        // otherwise, can't select an element by ID if the ID has a '.' in it
        var scrollAnchor = anchor.replace(/\./g, '\\.');
        scrollToAnchor($(scrollAnchor));
        window.location.hash = anchor;
    });

    function moveToWindowHash() {
        var hash = window.location.hash,
            tabToActivate = hash,
            $tabToActivate = false,
            $scroll = $(hash);

        if (!hash) {
            return;
        }

        if (hash.match(/^#method_/)) {
            tabToActivate = '#tab_methods';
        }
        else if (hash.match(/^#property_/)) {
            tabToActivate = '#tab_properties';
        }
        else if (hash.match(/^#event_/)) {
            tabToActivate = '#tab_events';
        }
        else if (hash.match(/^#attr_/)) {
            tabToActivate = '#tab_attrs';
        }
        else if (hash.match(/#l\d+/)) {
            var lineNumber = /#l(\d+)/.exec(hash)[1];
            var whichLi = parseInt(lineNumber, 10) - 1; //e.g. line 1 is 0th element
            $scroll = $('ol.linenums > li').eq(whichLi);
        }

        $tabToActivate = $('[data-toggle=tab][href="'+ tabToActivate + '"]');
        if ($tabToActivate.length) {
            $tabToActivate.trigger('click', { ignore: true });
        }

        if ($scroll.length && !hash.match(/^#tab_/)) {
            scrollToAnchor($scroll);
        }
    }

    // ************************************************************************* //
    //  Initializations + Event listeners
    // ************************************************************************* //

    //
    // Store last clicked tab in local storage
    //
    $('#main-nav li').on('click', function(e) {
        e.preventDefault();
        localStorage['main-nav'] = $(this).find('a').attr('href');
    });

    //
    // Refresh typeahead source arrays when user changes tabs
    //
    $('#main-nav li').on('shown', function(e) {
        e.preventDefault();
        setUpWidgets();
    });

    //
    // Bind change events for options form checkboxes
    //
    $('#options-form input:checkbox').on('change', function(){
        setOptionDisplayState($(this));

        // Update localstorage
        var optionsArr = [];
        $('#options-form input:checkbox').each(function(i,el) {
            optionsArr.push($(el).is(':checked'));
        });
        localStorage.options = JSON.stringify(optionsArr);
    });

    //
    // Keyboard shortcut - 's' key
    // This brings the api search input into focus.
    //
    $(window).keyup(function(e) {
        // Listen for 's' key and focus search input if pressed
        if(e.keyCode === 83){ // 's'
            $('#api-tabview-filter input').focus();
        }
    });

    //
    // Keyboard shortcut - 'ctrl+left', 'ctrl+right', 'up', 'down'
    // These shortcuts offer sidebar navigation via keyboard,
    // *only* when sidebar or any element within has focus.
    //
    var nextIndex;
    $('#sidebar').keydown(function(e) {
        var $this = $(this);

        // Determine if the control/command key was pressed
        if(e.ctrlKey){
            if(e.keyCode === 37){ // left arrow
                $('#main-nav li a:first').tab('show');
            } else if(e.keyCode === 39){ // right arrow
                $('#main-nav li a:last').tab('show');
            }
        } else {
            if(e.keyCode === 40){ // down arrow
                if ($('#api-tabview-filter input').is(':focus')) {
                    // Scenario 1: We're focused on the search input; move down to the first li
                    $this.find('.tab-content .tab-pane.active li:first a').focus();
                } else if ($this.find('.tab-content .tab-pane.active li:last a').is(':focus')) {
                    // Scenario 2: We're focused on the last li; move up to search input
                    $('#api-tabview-filter input').focus();
                } else {
                    // Scenario 3: We're in the list but not on the last element, simply move down
                    nextIndex = $this
                    .find('.tab-content .tab-pane.active li')
                    .find('a:focus')
                    .parent('li').index() + 1;
                    $this.find('.tab-content .tab-pane.active li:eq('+nextIndex+') a').focus();
                }
                e.preventDefault(); // Stop page from scrolling
            } else if (e.keyCode === 38){ // up arrow
                if($('#api-tabview-filter input').is(':focus')) {
                    // Scenario 1: We're focused on the search input; move down to the last li
                    $this.find('.tab-content .tab-pane.active li:last a').focus();
                }else if($this.find('.tab-content .tab-pane.active li:first a').is(':focus')){
                    // Scenario 2: We're focused on the first li; move up to search input
                    $('#api-tabview-filter input').focus();
                }else{
                    // Scenario 3: We're in the list but not on the first element, simply move up
                    nextIndex = $this
                    .find('.tab-content .tab-pane.active li')
                    .find('a:focus')
                    .parent('li').index() - 1;
                    $this.find('.tab-content .tab-pane.active li:eq('+nextIndex+') a').focus();
                }
                e.preventDefault(); // Stop page from scrolling
            }
        }
    });

    function setUpHashChange() {
        $(window).on('hashchange', moveToWindowHash);
    }


    // ************************************************************************* //
    //  Immediate function calls
    // ************************************************************************* //

    setupHeaderAnchors();
    setUpOptionsCheckboxes();
    setupActiveSidebarLink();
    setUpWidgets();
    setUpHashChange();

    if (window.location.hash) {
        moveToWindowHash();
    }

});
