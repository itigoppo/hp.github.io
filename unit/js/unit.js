$(function () {
  // $("#list-hp").addClass('d-none');
  let hash = location.hash;
  if (hash === '') {
    hash = '#morning';
  }

  $.ajaxSetup({async: false}); // 同期通信(json取ってくるまで待つ)
  $.getJSON("../data/units.json", function (data) {
    $(data.units).each(function () {
      let checked = '';
      if (hash === "#" + this.key) {
        checked = ' checked';
      }
      $("div#unit_list").append("<div class=\"form-check form-check-inline\">\n" +
        "<label class=\"form-check-label\">\n" +
        "<input class=\"form-check-input\" type=\"radio\" name=\"unit\" value=\"" + this.key + "\"" + checked + ">\n" +
        this.name + "\n" +
        "</label>\n" +
        "</div>");
    })
  });
  $.ajaxSetup({async: true}); // 非同期に戻す

  const sortableTable = new SortableTable();
  sortableTable.setTable(document.querySelector('#list-hp'));
  loadMembers(sortableTable);

  const search = $('#search-hp');
  search.find('input[name="status"]:radio').change(function () {
    loadMembers(sortableTable);
  });
  search.find('input[name="unit"]:radio').change(function () {
    loadMembers(sortableTable);
  });
});

const loadMembers = (sortableTable) => {
  $("#loading").removeClass('d-none');
  $("#list-hp").addClass('d-none');
  const selectUnitCategory = $('#search-hp').find('input[name="unit"]:checked').val();

  $.getJSON("../data/members.json", function (data) {
    const members = [];
    const status = $('#search-hp').find('input[name="status"]:checked').val();

    $(data.member).each(function () {
      const dateOfBirth = moment(this.birth_date);
      // ユニット絞り込み
      let skip = true;
      // 兼任(移籍)ユニットがあるか
      const isTransfer = isInUnit(this.concurrent_unit, selectUnitCategory);
      if (isInUnit(this.unit, selectUnitCategory) || isTransfer) {
        skip = false;
      }
      // 該当ユニットじゃないなら表示しない
      if (skip) {
        return;
      }

      // 日付の型調整
      let dateOfJoin;
      let isJoinUnknown;
      let dateOfGraduate;
      let isGraduateUnknown;
      let dateOfAnnounce;
      let isAnnounceUnknown;
      let hall;

      if (isTransfer) {
        dateOfJoin = adjustDate(this.concurrent_join_date);
        isJoinUnknown = isUnknownDate(this.concurrent_join_date);
        dateOfGraduate = adjustDate(this.concurrent_graduate_date);
        isGraduateUnknown = isUnknownDate(this.concurrent_graduate_date);
        dateOfAnnounce = adjustDate(this.concurrent_graduate_announcement_date);
        isAnnounceUnknown = isUnknownDate(this.concurrent_graduate_announcement_date);
        if (typeof this.concurrent_graduate_hall !== "undefined") {
          hall = this.concurrent_graduate_hall;
        }
      } else {
        dateOfJoin = adjustDate(this.unit_join_date);
        isJoinUnknown = isUnknownDate(this.unit_join_date);
        dateOfGraduate = adjustDate(this.unit_graduate_date);
        isGraduateUnknown = isUnknownDate(this.unit_graduate_date);
        dateOfAnnounce = adjustDate(this.unit_graduate_announcement_date);
        isAnnounceUnknown = isUnknownDate(this.unit_graduate_announcement_date);
        if (typeof this.unit_graduate_hall !== "undefined") {
          hall = this.unit_graduate_hall;
        }
      }

      let isGraduate = false;
      let ageOfGraduate;
      if (dateOfGraduate !== '') {
        isGraduate = true;
        ageOfGraduate = calAge(dateOfBirth, dateOfGraduate);
        // 未来なら卒業フラグ落とす
        if(dateOfGraduate.isAfter(moment())) {
          isGraduate = false;
        }
      }

      // 発表から卒業までの日数
      let announceElapsedDays;
      let announcePeriod;
      if (dateOfAnnounce !== '') {
        announceElapsedDays = moment().diff(dateOfAnnounce, 'days');
        if (isGraduate) {
          announceElapsedDays = dateOfGraduate.diff(dateOfAnnounce, 'days');
        }
        // 発表から卒業までの期間
        announcePeriod = formatElapsedPeriod(announceElapsedDays);
      }


      // 在籍日数
      let elapsedDays = moment().diff(dateOfJoin, 'days');
      if (isGraduate) {
        elapsedDays = dateOfGraduate.diff(dateOfJoin, 'days');
      }

      // 在籍期間
      const elapsedPeriod = formatElapsedPeriod(elapsedDays);

      // 表示フィルター
      if (status === 'active' && isGraduate) {
        return true;
      }
      if (status === 'graduation' && !isGraduate) {
        return true;
      }

      const member = {
        name: this.member_name,
        join_date: formatDate(dateOfJoin, isJoinUnknown),
        join_age: calAge(dateOfBirth, dateOfJoin),
        graduate_date: formatDate(dateOfGraduate, isGraduateUnknown),
        graduate_age: ageOfGraduate,
        announcement_date: formatDate(dateOfAnnounce, isAnnounceUnknown),
        between_announcement: announcePeriod,
        graduate_hall: hall,
        enrollment: elapsedPeriod,
        enrollment_day: elapsedDays,
      };
      members.push(member)
    })
    sortableTable.setData(members);
    sortableTable.sort('join_date', 'asc');
    $("#loading").addClass('d-none');
    $("#list-hp").removeClass('d-none');
  });
}

const loadUnits = (category) => {
  const units = [];
  $.ajaxSetup({async: false}); // 同期通信(json取ってくるまで待つ)
  $.getJSON("../data/units.json", function (data) {
    $(data.units).each(function () {
      if (category === this.key) {
        if (typeof this.group === "undefined") {
          units.push(this.name);
        } else {
          Array.prototype.push.apply(units, this.group);
        }
      }

    })
  });
  $.ajaxSetup({async: true}); // 非同期に戻す

  return units;
}

const isInUnit = (belongToUnit, selectUnitCategory) => {
  const selectUnits = loadUnits(selectUnitCategory);

  let result = false;
  // ユニット絞り込み
  if (typeof belongToUnit === "undefined") {
    // ユニット所属していない
    result = false;
  } else if (typeof belongToUnit === "object") {
    for (let cnt1 = 0; cnt1 < belongToUnit.length; cnt1++) {
      if (selectUnits.indexOf(belongToUnit[cnt1]) >= 0) {
        result = true;
      }
    }
  } else {
    if (selectUnits.indexOf(belongToUnit) >= 0) {
      result = true;
    }
  }

  return result;
}
