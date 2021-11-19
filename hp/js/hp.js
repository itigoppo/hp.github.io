$(function () {
  const sortableTable = new SortableTable();
  sortableTable.setTable(document.querySelector('#list-hp'));
  loadMembers(sortableTable);
  $('#search-hp').find('input[name="status"]:radio').change(function () {
    loadMembers(sortableTable);
  });
});


const loadMembers = (sortableTable) => {
  $("#loading").removeClass('d-none');
  $("#list-hp").addClass('d-none');
  $.getJSON("../data/members.json", function (data) {
    const members = [];
    const status = $('#search-hp').find('input[name="status"]:checked').val();

    $(data.member).each(function () {
      const dateOfBirth = moment(this.birth_date);

      // 日付の型調整
      const dateOfJoin = adjustDate(this.join_date);
      const isJoinUnknown =  isUnknownDate(this.join_date);

      const dateOfGraduate = adjustDate(this.graduate_date);
      const isGraduateUnknown =  isUnknownDate(this.graduate_date);
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
