$(function () {
  const sortableTable = new SortableTable();
  sortableTable.setTable(document.querySelector('#list-hp'));
  loadMembers(sortableTable);
  $('#search-hp').find('input[name="status"]:radio').change(function () {
    loadMembers(sortableTable);
  });
  sortableTable.setCellRenderer((col, row) => {
    const colValue = row[col.id];
    if (col.isHeader) {
      if (typeof colValue !== 'undefined') {
        return `<th>${colValue}</th>`;
      }
      return '<th></th>';
    }

    if (typeof colValue !== 'undefined') {
      if (col.id === 'join_date') {
        return '<td class="d-none">${colValue}</td>';
      }
      return `<td>${colValue}</td>`;
    }
    return '<td></td>';
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
      const isJoinUnknown = isUnknownDate(this.join_date);

      const dateOfGraduate = adjustDate(this.graduate_date);
      let isGraduate = false;
      if (dateOfGraduate !== '') {
        isGraduate = true;
        // 未来なら卒業フラグ落とす
        if (dateOfGraduate.isAfter(moment())) {
          isGraduate = false;
        }
      }

      // 表示フィルター
      if (status === 'active' && isGraduate) {
        return true;
      }
      if (status === 'graduation' && !isGraduate) {
        return true;
      }

      // 表示調整
      let unit;
      if (typeof this.unit === "object") {
        unit = this.unit.join('<br/>');
      } else {
        unit = this.unit;
      }

      const member = {
        name: this.member_name,
        unit: unit,
        birthday: formatDate(dateOfBirth, false),
        age: calAge(dateOfBirth, moment()),
        join_date: formatDate(dateOfJoin, isJoinUnknown),
      };
      members.push(member)
    })
    sortableTable.setData(members);
    sortableTable.sort('join_date', 'asc');
    $("#loading").addClass('d-none');
    $("#list-hp").removeClass('d-none');
  });
}
