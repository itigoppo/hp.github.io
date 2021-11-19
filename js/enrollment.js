const isUnknownDate = (date) => {
  if (typeof date !== "undefined" && date.indexOf('dd') !== -1) {
    return true;
  }

  return false;
}

const adjustDate = (date) => {
  if (typeof date !== "undefined") {
    if (isUnknownDate(date)) {
      const dateOfUnknown = date.split('-');
      return moment(Number(dateOfUnknown[0]) + '-' + Number(dateOfUnknown[1]) + '-01').endOf('month');
    } else {
      return moment(date);
    }
  }

  return '';
}

const formatDate = (date, isUnknown) => {
  if (typeof date === "undefined" || date === '') {
    return '';
  }

  let dateFormat = 'YYYY年MM月DD日';

  if (isUnknown) {
    dateFormat =  dateFormat + '(不明)';
  }

  // 未来マーク
  if(date.isAfter(moment())) {
    dateFormat =  dateFormat + '*';
  }

  return date.format(dateFormat);
}

const calAge = (dateOfBirth, dataOfBase) => {
  // 西暦を比較して年齢を算出
  let baseAge = dataOfBase.year() - dateOfBirth.year();

  // 比較用にベース年の誕生月日で日付作成
  const dataOfBaseYear = dataOfBase.year() + '-' + (dateOfBirth.month() + 1) + '-' + dateOfBirth.date();

  // 今日が誕生日より前の日付である場合、算出した年齢から-1した値を返す
  if (dataOfBase.isBefore(dataOfBaseYear)) {
    return baseAge - 1;
  }

  // 今日が誕生日 または 誕生日を過ぎている場合は算出した年齢をそのまま返す
  return baseAge;
}

const formatElapsedPeriod = (elapsedDays) => {
  const DAYS_PER_MONTH = 365 / 12;
  const elapsedYear = Math.floor(elapsedDays / 365);
  const elapsedMonth = Math.floor((elapsedDays - 365 * elapsedYear) / DAYS_PER_MONTH);
  const elapsedDay = Math.floor((elapsedDays - 365 * elapsedYear - DAYS_PER_MONTH * elapsedMonth));

  return elapsedYear + '年' + elapsedMonth + 'ヶ月' + elapsedDay + '日';
}

$(function () {
  $.ajaxSetup({async: false}); // 同期通信(json取ってくるまで待つ)
  $.getJSON("../data/units.json", function (data) {
    $(data.units).each(function () {
      $("ul#unit-menu").append("<li id='"+ this.key +"'><a class=\"dropdown-item\" href=\"../unit/#" + this.key + "\">" + this.name + "</a></li>");
    })
  });
  $.ajaxSetup({async: true}); // 非同期に戻す

  // ページのトップに移動
  $("#pagetop").click(function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });
})
