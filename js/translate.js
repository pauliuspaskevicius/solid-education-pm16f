// Type 'Language' declaration
function Language (id) {
  this.id = id;
  this.dictionary = null;
  this.flag = '/img/flags/' + id + '.svg';

  this.load = function () {
    var that = this;
    $.getJSON('translations/' + that.id + '.json?t=' + new Date().getTime(), function(data){
      that.dictionary = data;
    });
  }
};
// Type 'Translator' declaration
function Translator () {
  this.languages = [];
  this.languageActive = null;
}

// Object 'translator' of type 'Translaor' initialization
var translator = new Translator ();
translator.languages['en'] = new Language ('en');
translator.languages['lt'] = new Language ('lt');
translator.languages['de'] = new Language ('de');
translator.languageActive = localStorage.getItem('language') || 'lt';
// Preload languages
translator.languages['en'].load();
translator.languages['lt'].load();
translator.languages['de'].load();

var language = translator.languageActive;

$(document).ready(function() {
  setLanguage (language);
});

function setLanguage (id) {
  translator.languageActive = id;

  if (translator.languages[id].dictionary == null) {
    $.getJSON('translations/' + id + '.json?t=' + new Date().getTime(), function(data){
      try { localStorage.setItem('language', id); } catch (e) {}
      translate (data);
      $('.language-selected').removeClass('icon-en').removeClass('icon-de').removeClass('icon-lt');
      $('.language-selected').addClass('icon-' + id);
    });
  }
  else {
    try { localStorage.setItem('language', id); } catch (e) {}
    translate (translator.languages[id].dictionary);
    $('.language-selected').removeClass('icon-en').removeClass('icon-de').removeClass('icon-lt');
    $('.language-selected').addClass('icon-' + id);
  }
}

function translate (data) {
  $('h1, h2, h3, h4, h5, h6, h7, input, a, span').each(function(){
    for (var key in data) {
      if($(this).children(':not(br,b,strong,i,u,img)').length == 0) {
        if ($(this).attr('data-translation-key') == null) {
          $(this).attr('data-translation-key', $(this).text());
          $(this).attr('data-translation-key', $(this).attr('value'));
          $(this).attr('data-translation-key', $(this).attr('title'));
          $(this).attr('data-translation-key', $(this).attr('data-title'));
          $(this).attr('data-translation-key', $(this).attr('placeholder'));
        }
        if ($(this).attr('data-translation-key').toLowerCase().trim() == key.toLowerCase().trim()) {
          if ($(this).is('input[type="text"]')) {
            $(this).attr('placeholder', data[key]);
          }
          else if ($(this).is('a') && $(this).children().length > 0) {
            if ($(this).attr('title') != null) $(this).attr('title', data[key]);
            $(this).attr('data-title', data[key]);
          }
          else if ($(this).is('input[type="submit"]')) {
            $(this).attr('value', data[key]);
          }
          else {
            $(this).html(data[key]);
          }
        }
      }
    }
  });
}
