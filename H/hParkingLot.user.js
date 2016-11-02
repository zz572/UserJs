// ==UserScript==
// @name        hParkingLot-Rider
// @name:zh-CN  【H】停车场-骑兵版
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description 此为骑兵版，步兵版等待推出
// @include     https://btso.pw/*
// @include     https://btdb.in/*
// @include     http://www.javlibrary.com/*
// @include     http://www.dmm.co.jp/*
// @include     https://www.google.co.jp/search?q=*&status=h
// @include     https://www.baidu.com/baidu?wd=*&status=h
// @include     https://www.av28.com/*
// @include     http://javpop.com/*
// @include     http://www.abase.me/*
// include     *.tokyo-hot.com/*
// include     *.caribbeancom.com/*
// include     *.1000giri.net/*
// include     *.10musume.com/*
// include     *.heyzo.com/*
// include     *.1pondo.tv/*
// @version     1.06
// @grant       GM_setValue
// @grant       GM_getValue
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.js
// @run-at      document-end
// ==/UserScript==
(function ($) {
  var linkLib = {
    /*
    'example.com': {
      cn: 标识,
      fav: 网站，图标地址,
      search: 网站，搜索地址，搜索字样用{searchTerms}代替,
      text: 选择器-要标记的文本,
      img: 选择器-要标记的图片,
      time: 选择器-发布日期,
      code: 选择器-番号
    },
    */
    'btdb.in': {
      name: 'BTDB',
      fav: 'https://btdb.in/favicon.ico',
      search: 'https://btdb.in/q/{searchTerms}/',
      text: 'h1.torrent-name,.file-name,.item-title>a',
      code: '#search-input'
    },
    'btso.pw': {
      name: 'BTSOW',
      fav: 'https://btso.pw/app/bts/View/img/favicon.ico',
      search: 'http://btso.pw/search/{searchTerms}/',
      text: 'h3,.file',
      code: '.form-control:visible'
    },
    'www.javlibrary.com': {
      name: 'JAVLibrary',
      fav: 'http://www.javlibrary.com/favicon.ico',
      search: 'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword={searchTerms}',
      text: '.text:lt(2),.id,.video>a:not(:has(img))',
      img: '#video_jacket_img,.previewthumbs>img,.id+img,strong>a',
      time: '.text:eq(2)',
      code: '#video_id .text'
    },
    'www.dmm.co.jp': {
      name: 'DMM',
      fav: 'http://www.dmm.co.jp/favicon.ico',
      search: 'http://www.dmm.co.jp/search/=/searchstr={searchTerms}',
      text: '.txt,table.mg-b20 td',
      img: '.img img,.tdmm,.crs_full>img',
      time: '.nw:contains(発売日)+td',
      code: function () {
        return prompt('请输入番号', $('.nw:contains(品番)+td').text());
      }
    },
    'www.google.co.jp': {
      name: 'Google',
      fav: 'https://www.google.co.jp/images/branding/product/ico/googleg_lodp.ico',
      search: 'https://www.google.co.jp/search?q={searchTerms}&status=h',
      text: 'h3.r>a,span.st',
      code: '#lst-ib'
    },
    'www.baidu.com': {
      name: 'Baidu',
      fav: 'https://www.baidu.com/img/baidu.svg',
      search: 'https://www.baidu.com/baidu?wd={searchTerms}&status=h',
      text: 'h3.t>a,.c-abstract',
      code: '#kw'
    },
    'www.av28.com': {
      name: 'AV28',
      fav: 'https://cdn3.iconfinder.com/data/icons/block/32/letter-24.png',
      search: 'https://www.av28.com/cn/search/{searchTerms}',
      text: '.item>div>a,.item>div>span,.row-fluid>h3,.info>p>span',
      img: '.img,.bigImage>img,.sample-box img',
      time: '.info>p:eq(1)',
      code: '.info>p>.header+span'
    },
    'javpop.com': {
      name: 'JavPOP',
      fav: 'http://javpop.com/favicon.ico',
      search: 'http://javpop.com/index.php?s={searchTerms}',
      text: '.thumb_post a:nth-child(2),h1',
      img: '.thumb_post img,.box-b img',
      code: function () {
        return $('h1').text().replace(/\[(.*?)\].*/, '$1');
      }
    },
    'www.abase.me': {
      name: 'ABase A基地',
      fav: 'http://www.abase.me/favicon.ico',
      search: 'http://www.abase.me/{searchTerms}',
      text: '.row-fluid>h3,.col-md-3 strong:eq(0),.list-group-item>a',
      img: '.col-md-9 img',
      time: '.col-md-3 strong:eq(1)',
      code: '.col-md-3 strong:eq(0)'
    },
  };
  var imgLib = {
    add: 'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519691-199_CircledPlus-24.png',
    del: 'https://cdn2.iconfinder.com/data/icons/social-messaging-productivity-1/128/trash-24.png',
    import: 'https://cdn1.iconfinder.com/data/icons/design-2d-cad-solid-set-2/60/079-Import-24.png',
    show: 'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519904-098_Spreadsheet-24.png'
  };
  var markLib = [
    { //0
      name: '等待中',
      img: 'https://cdn2.iconfinder.com/data/icons/lightly-icons/24/time-24.png',
      color: 'gray'
    },
    { //1
      name: '下载中',
      img: 'https://cdn4.iconfinder.com/data/icons/education-bold-line-1/49/34-24.png',
      color: 'blue'
    },
    { //2
      name: '已出已下-骑兵',
      img: 'https://cdn3.iconfinder.com/data/icons/chess-8/512/horse-game-role-chess-24.png',
      color: 'green'
    },
    { //3
      name: '已出已下-步兵',
      img: 'https://cdn3.iconfinder.com/data/icons/chess-8/154/chess-pawn-24.png',
      color: 'green'
    },
    { //4
      name: '已出已下已删-不喜欢的',
      img: 'https://cdn1.iconfinder.com/data/icons/lightly-icons/24/heart-broken-24.png',
      color: 'black'
    },
    { //5
      name: '女同',
      img: 'https://cdn2.iconfinder.com/data/icons/gender-and-feminism-solid/100/lesbian-24.png',
      color: 'pink'
    },
    { //6
      name: '超过1年无资源',
      img: 'https://cdn3.iconfinder.com/data/icons/transfers/100/239345-reload_time_delay-24.png',
      color: 'red'
    },
    { //7
      name: '无H-首次亮相',
      img: 'https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-5/128/new-label-24.png',
      color: 'yellow'
    },
    { //8
      name: '有种子无配额',
      img: 'https://cdn3.iconfinder.com/data/icons/math-physics/512/null-24.png',
      color: 'gray'
    }
  ];
  init();
  markAdded();
  function init() {
    $('<style></style>').appendTo('head').html('' +
    '.hBanner{position:fixed;background-color:white;z-index:999999;}' +
    '.hBanner{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;}' +
    '.hBanner>*{cursor:pointer;float:left;margin:0 1px0 1px;}' +
    '.switcher{width:32px;height:24px;background:#333;border-radius:12px;position:relative;}' +
    '.switcher>span{position:absolute;left:6px;top:2px;height:2px;color:#26CA28;font-size:16px;text-transform:Capitalize;}' +
    '.links,.addCode,.delCode,.importCode,.showCode{width:24px;height:24px;}' +
    '.links img,.addCode img{background-color:white;}' +
    '.links>*,.addCode>*{display:none;}' +
    '.links>*:nth-child(1),.addCode>*:nth-child(1){display:inline;}' +
    '.hasCode>a{margin:0 1px;display:none;}' +
    '.showTable{background-color:white;position:absolute;top:60px;}' +
    '.showTable>table{border-collapse:collapse;}' +
    '.showTable>table>thead>tr{position:fixed;top:40px;}' +
    '.showTable td{border:1px solid black;}' +
    '.showTable>button{float:right;color:red;position:fixed;right:10px;}' +
    '.showTable>button:nth-child(1){top:70px;}' +
    '.showTable>button:nth-child(2){top:100px;}');
    $('<div class="hBanner"></div>').on({
      mousedown: function (e1) {
        if (e1.target !== $('.hasCode') [0]) return;
        $(this).off('mouseout');
        $('body').mouseup(function (e2) {
          var width = 152;
          var topBorder = $(window).height() - $('.hBanner').height();
          var leftBorder = $(window).width() - $('.hBanner').width();
          var top = (e2.clientY - e1.offsetY > 0) ? e2.clientY - e1.offsetY : 0;
          top = (top > topBorder) ? topBorder : top;
          var left = (e2.clientX - e1.offsetX > width) ? e2.clientX - e1.offsetX - width : 0;
          left = (left > leftBorder) ? leftBorder : left;
          $('.hBanner').css({
            top: top + 'px',
            left: left + 'px'
          });
          GM_setValue('top', top);
          GM_setValue('left', left);
          $(this).off('mouseup');
          $('.hBanner').on({
            mouseout: function () {
              $('.hasCode>a').hide();
            }
          });
        });
      },
      mouseover: function () {
        $('.hasCode>a').show();
      },
      mouseout: function () {
        $('.hasCode>a').hide();
      }
    }).css({
      'top': function () {
        return GM_getValue('top', 0);
      },
      'left': function () {
        return GM_getValue('left', 0);
      }
    }).appendTo('body');
    $('<div class="switcher"></div>').html('<span>on</span>').appendTo('.hBanner').click(function () {
      if ($(this).find('span').text() === 'on') {
        $(this).find('span').text('off');
        undoMarkAdded();
      } else {
        $(this).find('span').text('on');
        markAdded();
      }
    });
    $('<div class="links"></div>').html(function () {
      var _html = '';
      for (var i in linkLib) {
        _html += '<img src="' + linkLib[i].fav + '" width=24 url="' + linkLib[i].search + '"title="' + linkLib[i].name + '"></img>';
      }
      return _html;
    }).click(function (e) {
      var code = getCode();
      window.open($(e.target).attr('url').replace('{searchTerms}', code));
    }).appendTo('.hBanner');
    $('<div class="addCode"title="添加到数据库/移动"></div>').html('<img src="' + imgLib.add + '"></img>').click(function () {
      addValue(GM_getValue('lastMark', 0));
    }).appendTo('.hBanner');
    $('<div class="delCode"title="从数据库中删除"></div>').html('<img src="' + imgLib.del + '"></img>').click(function () {
      delValue();
    }).appendTo('.hBanner');
    $('<div class="importCode"title="导入到数据库"></div>').html('<img src="' + imgLib.import + '"></img>').click(function () {
      importValue();
    }).appendTo('.hBanner');
    $('<div class="showCode"title="数据库展示"></div>').html('<img src="' + imgLib.show + '"></img>').one('click', function () {
      showValue();
      $(this).click(function () {
        $('.showTable').toggle();
      });
    }).appendTo('.hBanner');
    $('<div class="hasCode">(已标记)</div>').appendTo('.hBanner');
    for (var i = 0; i < markLib.length; i++) {
      $('<img src="' + markLib[i].img + '"title="' + markLib[i].name + '"></img>').val(i).click(function () {
        addValue($(this).val());
      }).appendTo('.addCode');
    }
    $('.links,.addCode').on({
      mouseover: function () {
        $(this).children(':gt(0)').show();
      },
      mouseout: function () {
        $(this).children(':gt(0)').hide();
      }
    })
    $(window).keydown(function (e) {
      if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) {
        var code = (e.shiftKey) ? prompt('请输入番号', getCode())  : getCode();
        if (!code) return;
        addValue(String.fromCharCode(e.keyCode), code);
      }
    });
  }
  function markAdded() {
    $('.hasCode a').remove();
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if (linkLib[location.host].img) {
      $(linkLib[location.host].img).removeAttr('onerror').attr({
        realSrc: function () {
          return $(this).attr('src');
        },
        src: function () {
          var keyword;
          var _src = $(this).attr('src');
          for (var i in lib) {
            keyword = new RegExp(i + '|' + i.replace('-', ''), 'gi');
            if (keyword.test(_src)) {
              if ($('.' + i).length === 0) $('<a target="_blank"></a>').addClass(i).attr('href', linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
              _src = markLib[lib[i].mark].img;
            }
          }
          return _src;
        }
      });
    }
    $(linkLib[location.host].text).html(function () {
      var keyword;
      var _html = $(this).text();
      for (var i in lib) {
        keyword = new RegExp(i + '|' + i.replace('-', ''), 'gi');
        if (keyword.test(_html)) {
          if ($('.' + i).length === 0) $('<a target="_blank"></a>').addClass(i).attr('href', linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
          _html = _html.replace(keyword, '<span style="background-color:' + markLib[lib[i].mark].color + ';">' + i + '</span>');
        }
      }
      return _html;
    });
  }
  function undoMarkAdded() {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if (linkLib[location.host].img) {
      $(linkLib[location.host].img).attr({
        src: function () {
          return $(this).attr('realSrc');
        }
      }).removeAttr('realSrc');
    }
  }
  function addValue(mark, code) { //可选参数code
    mark = parseInt(mark);
    var lib = GM_getValue('lib', null) || new Object();
    var code = code || getCode();
    if (!code) return;
    GM_setValue('lastMark', mark);
    lib[code] = {
      mark: mark
    };
    if (mark === 0 || mark === 6) lib[code].time = $(linkLib[location.host].time).text();
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }
  function delValue(code) { //可选参数code
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    var code = code || getCode();
    if (!code) return;
    delete lib[code];
    GM_setValue('lib', lib);
  }
  function importValue() {
    var notice = '请输入车位\n';
    for (var i = 0; i < markLib.length; i++) {
      notice += i + markLib[i].name + '\n';
    }
    var mark = prompt(notice);
    if (!mark) return;
    var codeArr = prompt('请输入车牌号，以|为分割');
    if (!codeArr) return;
    codeArr = codeArr.split('|');
    var lib = GM_getValue('lib', null) || new Object();
    var code;
    for (var i = 0; i < codeArr.length; i++) {
      code = codeArr[i];
      if (lib[code] === undefined) {
        lib[code] = {
          mark: mark
        };
      } else {
        lib[code].mark = mark;
      }
    }
    GM_setValue('lib', lib);
  }
  function showValue() {
    var lib = GM_getValue('lib', null) || new Object();
    var _html = '<table class="tablesorter"><thead><tr><th>数字</th><th>标记</th><th>代码</th><th>时间</th></tr></thead><tbody>';
    for (var i in lib) {
      _html += '<tr><td>' + lib[i].mark + '</td><td><img src="' + markLib[lib[i].mark].img + '"></img>' + markLib[lib[i].mark].name + '</td><td><a href="' + linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i) + '"target="_blank">' + i + '</a></td><td>' + (lib[i].time || '') + '</td></tr>';
    }
    _html += '</tbody></table>';
    $('<div class="showTable"></div>').html(_html).appendTo('body');
    $('<button>↑</button>').click(function () {
      $(window) [0].scrollTo(0, 0);
    }).prependTo('.showTable');
    $('<button>x</button>').click(function () {
      $('.showTable').toggle();
    }).prependTo('.showTable');
    $('.showTable>table').tablesorter();
  }
  function getCode() {
    if ($(window).data('code')) return $(window).data('code');
    var code;
    if (typeof linkLib[location.host].code === 'string') {
      var temp = $(linkLib[location.host].code);
      code = ((temp[0].tagName === 'INPUT')) ? temp.val()  : temp.text();
    } else if (typeof linkLib[location.host].code === 'function') {
      code = linkLib[location.host].code();
    } else {
      code = '';
    }
    $(window).data('code', code);
    return code;
  }
}) (jQuery);